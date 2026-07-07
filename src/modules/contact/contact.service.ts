import { Injectable } from '@nestjs/common';
import { AmoService } from '../amo/amo.service';
import { AccountService } from '../account/account.service';
import type { ContactWebhookPayload } from './contact.types';
import type { Account } from '../account/account.entity';
import { ContactCustomFieldNames } from '../../shared/constants/custom-fields';
import { CustomFieldService } from '../custom-field/custom-field.service';

@Injectable()
export class ContactService {
    constructor(
        private readonly amoService: AmoService,
        private readonly accountService: AccountService,
        private readonly customFieldService: CustomFieldService
    ) {}

    public async handleWebhook(payload: ContactWebhookPayload): Promise<void> {
        const account = await this.accountService.getBySubdomain(payload.account.subdomain);
        if (!account || !account.accessToken) {
            return;
        }

        const contacts = [...(payload.contacts?.add ?? []), ...(payload.contacts?.update ?? [])];
        for (const contact of contacts) {
            await this.processAge(account, Number(contact.id));
        }
    }

    public async processAge(account: Account, contactId: number): Promise<void> {
        if (!account.accessToken) {
            return;
        }

        const birthdayFieldId = await this.customFieldService.getFieldId(account, ContactCustomFieldNames.Birthday);
        const ageFieldId = await this.customFieldService.getFieldId(account, ContactCustomFieldNames.Age);
        if (birthdayFieldId === null || ageFieldId === null) {
            return;
        }

        const contact = await this.amoService.getContact(account.accessToken, account.subdomain, contactId);
        const fieldValues = contact.custom_fields_values ?? [];

        const birthdayValue = fieldValues.find((field) => field.field_id === birthdayFieldId)?.values[0]?.value;
        if (birthdayValue === undefined) {
            return;
        }

        const age = this.calculateAge(Number(birthdayValue));

        const currentAgeValue = fieldValues.find((field) => field.field_id === ageFieldId)?.values[0]?.value;
        if (currentAgeValue !== undefined && Number(currentAgeValue) === age) {
            return;
        }

        await this.amoService.updateContactCustomField(account.accessToken, account.subdomain, contactId, ageFieldId, age);
    }

    private calculateAge(birthTimestamp: number): number {
        const birthDate = new Date(birthTimestamp * 1000);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }

        return age;
    }
}
