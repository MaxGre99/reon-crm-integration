import { Injectable } from '@nestjs/common';
import { AmoService } from '../amo/amo.service';
import { AccountService } from '../account/account.service';
import { CustomFieldService } from '../custom-field/custom-field.service';
import { ContactService } from '../contact/contact.service';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../app/app.types';
import type { DealWebhookPayload } from './deal.types';
import type { Account } from '../account/account.entity';
import { ContactCustomFieldNames, DealCustomFieldNames } from '../../shared/constants/custom-fields';
import { Env } from '../../shared/enums/env.enum';
import type { AmoTask } from '../amo/amo.types';
import { TASK_DEADLINE_SECONDS } from './deal.consts';

@Injectable()
export class DealService {
    constructor(
        private readonly amoService: AmoService,
        private readonly accountService: AccountService,
        private readonly customFieldService: CustomFieldService,
        private readonly contactService: ContactService,
        private readonly configService: ConfigService<AppConfig>
    ) {}

    public async handleWebhook(payload: DealWebhookPayload): Promise<void> {
        const account = await this.accountService.getByAccountId(Number(payload.account.id));
        if (!account || !account.accessToken) {
            return;
        }

        const leads = [...(payload.leads?.add ?? []), ...(payload.leads?.update ?? [])];
        for (const lead of leads) {
            await this.processLead(account, Number(lead.id));
        }
    }

    private async processLead(account: Account, leadId: number): Promise<void> {
        const accessToken = account.accessToken;
        if (!accessToken) {
            return;
        }

        const lead = await this.amoService.getLead(accessToken, account.subdomain, leadId);

        const servicesFieldId = await this.customFieldService.getFieldId(account, DealCustomFieldNames.Services);
        if (servicesFieldId === null) {
            return;
        }

        const selectedServices =
            (lead.custom_fields_values ?? [])
                .find((field) => field.field_id === servicesFieldId)
                ?.values.map((item) => String(item.value)) ?? [];
        if (selectedServices.length === 0) {
            return;
        }

        const mainContact = lead._embedded?.contacts?.find((contact) => contact.is_main);
        if (!mainContact) {
            return;
        }

        const contact = await this.amoService.getContact(accessToken, account.subdomain, mainContact.id);
        const contactFieldValues = contact.custom_fields_values ?? [];

        const errorTaskTypeId = Number(this.configService.getOrThrow<string>(Env.ErrorTaskTypeId));
        const checkTaskTypeId = Number(this.configService.getOrThrow<string>(Env.CheckTaskTypeId));

        const serviceFieldIds = new Map<string, number>();
        for (const service of selectedServices) {
            const fieldId = await this.customFieldService.getFieldId(account, service);
            if (fieldId !== null) {
                serviceFieldIds.set(service, fieldId);
            }
        }

        const unfilledServices = selectedServices.filter((service) => {
            const fieldId = serviceFieldIds.get(service);
            if (fieldId === undefined) {
                return true;
            }
            const value = contactFieldValues.find((field) => field.field_id === fieldId)?.values[0]?.value;
            return value === undefined || value === '';
        });

        if (unfilledServices.length > 0) {
            const text = `У контакта не заполнены поля услуг: ${unfilledServices.join(', ')}`;
            await this.upsertTask(accessToken, account.subdomain, leadId, errorTaskTypeId, text);
            return;
        }

        const ageFieldId = await this.customFieldService.getFieldId(account, ContactCustomFieldNames.Age);
        const ageValue =
            ageFieldId !== null ? contactFieldValues.find((field) => field.field_id === ageFieldId)?.values[0]?.value : undefined;

        let age: number;
        if (ageValue !== undefined) {
            age = Number(ageValue);
        } else {
            const computedAge = await this.contactService.processAge(account, mainContact.id);
            if (computedAge === null) {
                await this.createTaskIfAbsent(accessToken, account.subdomain, leadId, errorTaskTypeId, 'Возраст контакта неизвестен');
                return;
            }
            age = computedAge;
        }

        const budget = selectedServices.reduce((sum, service) => {
            const fieldId = serviceFieldIds.get(service);
            const value =
                fieldId !== undefined ? contactFieldValues.find((field) => field.field_id === fieldId)?.values[0]?.value : undefined;
            return sum + Number(value ?? 0);
        }, 0);

        if (lead.price !== budget) {
            await this.amoService.updateLeadPrice(accessToken, account.subdomain, leadId, budget);
        }

        const text = `Проверить стоимость услуг для ${contact.name ?? ''}, возраст: ${age}`;
        await this.upsertTask(accessToken, account.subdomain, leadId, checkTaskTypeId, text);
    }

    private async upsertTask(accessToken: string, subdomain: string, leadId: number, taskTypeId: number, text: string): Promise<void> {
        const existingTask = await this.findTaskByType(accessToken, subdomain, leadId, taskTypeId);

        if (!existingTask) {
            await this.amoService.createTask(accessToken, subdomain, leadId, taskTypeId, text, this.getDeadline());
            return;
        }

        if (existingTask.text !== text) {
            await this.amoService.updateTask(accessToken, subdomain, existingTask.id, text, this.getDeadline());
        }
    }

    private async createTaskIfAbsent(
        accessToken: string,
        subdomain: string,
        leadId: number,
        taskTypeId: number,
        text: string
    ): Promise<void> {
        const existingTask = await this.findTaskByType(accessToken, subdomain, leadId, taskTypeId);
        if (existingTask) {
            return;
        }

        await this.amoService.createTask(accessToken, subdomain, leadId, taskTypeId, text, this.getDeadline());
    }

    private async findTaskByType(accessToken: string, subdomain: string, leadId: number, taskTypeId: number): Promise<AmoTask | undefined> {
        const tasks = await this.amoService.getLeadTasks(accessToken, subdomain, leadId);
        return tasks.find((task) => task.task_type_id === taskTypeId && !task.is_completed);
    }

    private getDeadline(): number {
        return Math.floor(Date.now() / 1000) + TASK_DEADLINE_SECONDS;
    }
}
