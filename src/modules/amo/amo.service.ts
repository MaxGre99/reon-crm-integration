import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type {
    AmoCustomField,
    AmoToken,
    AmoCustomFieldsResponse,
    AmoEntityType,
    AmoCustomFieldType,
    AmoCustomFieldEnum,
    AmoWebhooksResponse,
    AmoWebhook,
    AmoWebhookEvent,
    AmoContact,
    AmoLead,
    AmoTask,
    AmoTasksResponse,
} from './amo.types';
import { firstValueFrom } from 'rxjs';
import { Env } from '../../shared/enums/env.enum';
import type { AppConfig } from '../../app/app.types';
import { AmoEntityTypes } from './amo.consts';

@Injectable()
export class AmoService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService<AppConfig>
    ) {}

    public async getToken(code: string, subdomain: string): Promise<AmoToken> {
        const { data } = await firstValueFrom(
            this.httpService.post<AmoToken>(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
                client_id: this.configService.get(Env.ClientId),
                client_secret: this.configService.get(Env.ClientSecret),
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.configService.get(Env.RedirectUri),
            })
        );

        return data;
    }

    public async refreshToken(refreshToken: string, subdomain: string): Promise<AmoToken> {
        const { data } = await firstValueFrom(
            this.httpService.post<AmoToken>(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
                client_id: this.configService.get(Env.ClientId),
                client_secret: this.configService.get(Env.ClientSecret),
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })
        );

        return data;
    }

    public async getCustomFields(accessToken: string, subdomain: string, entityType: AmoEntityType): Promise<AmoCustomField[]> {
        const { data } = await firstValueFrom(
            this.httpService.get<AmoCustomFieldsResponse>(`https://${subdomain}.amocrm.ru/api/v4/${entityType}/custom_fields`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );

        return data._embedded.custom_fields;
    }

    public async createCustomField(
        accessToken: string,
        subdomain: string,
        entityType: AmoEntityType,
        name: string,
        fieldType: AmoCustomFieldType,
        enums?: AmoCustomFieldEnum[]
    ): Promise<AmoCustomField> {
        const { data } = await firstValueFrom(
            this.httpService.post<AmoCustomFieldsResponse>(
                `https://${subdomain}.amocrm.ru/api/v4/${entityType}/custom_fields`,
                [{ name, type: fieldType, ...(enums ? { enums } : {}) }],
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
        );

        return data._embedded.custom_fields[0];
    }

    public async updateCustomFieldEnums(
        accessToken: string,
        subdomain: string,
        entityType: AmoEntityType,
        fieldId: number,
        enums: AmoCustomFieldEnum[]
    ): Promise<void> {
        await firstValueFrom(
            this.httpService.patch(
                `https://${subdomain}.amocrm.ru/api/v4/${entityType}/custom_fields/${fieldId}`,
                { enums },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
        );
    }

    public async getWebhooks(accessToken: string, subdomain: string): Promise<AmoWebhook[]> {
        const { data } = await firstValueFrom(
            this.httpService.get<AmoWebhooksResponse>(`https://${subdomain}.amocrm.ru/api/v4/webhooks`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        );

        return data?._embedded?.webhooks ?? [];
    }

    public async subscribeWebhook(accessToken: string, subdomain: string, destination: string, settings: AmoWebhookEvent[]): Promise<void> {
        await firstValueFrom(
            this.httpService.post(
                `https://${subdomain}.amocrm.ru/api/v4/webhooks`,
                { destination, settings },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
        );
    }

    public async getContact(accessToken: string, subdomain: string, contactId: number): Promise<AmoContact> {
        const { data } = await firstValueFrom(
            this.httpService.get<AmoContact>(`https://${subdomain}.amocrm.ru/api/v4/contacts/${contactId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        );

        return data;
    }

    public async updateContactCustomField(
        accessToken: string,
        subdomain: string,
        contactId: number,
        fieldId: number,
        value: string | number
    ): Promise<void> {
        await firstValueFrom(
            this.httpService.patch(
                `https://${subdomain}.amocrm.ru/api/v4/contacts/${contactId}`,
                { custom_fields_values: [{ field_id: fieldId, values: [{ value }] }] },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
        );
    }

    public async getLead(accessToken: string, subdomain: string, leadId: number): Promise<AmoLead> {
        const { data } = await firstValueFrom(
            this.httpService.get<AmoLead>(`https://${subdomain}.amocrm.ru/api/v4/leads/${leadId}?with=contacts`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        );

        return data;
    }

    public async updateLeadPrice(accessToken: string, subdomain: string, leadId: number, price: number): Promise<void> {
        await firstValueFrom(
            this.httpService.patch(
                `https://${subdomain}.amocrm.ru/api/v4/leads/${leadId}`,
                { price },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
        );
    }

    public async getLeadTasks(accessToken: string, subdomain: string, leadId: number): Promise<AmoTask[]> {
        const { data } = await firstValueFrom(
            this.httpService.get<AmoTasksResponse>(
                `https://${subdomain}.amocrm.ru/api/v4/tasks?filter[entity_type]=leads&filter[entity_id]=${leadId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
        );

        return data?._embedded?.tasks ?? [];
    }

    public async createTask(
        accessToken: string,
        subdomain: string,
        leadId: number,
        taskTypeId: number,
        text: string,
        completeTill: number
    ): Promise<void> {
        await firstValueFrom(
            this.httpService.post(
                `https://${subdomain}.amocrm.ru/api/v4/tasks`,
                [{ task_type_id: taskTypeId, text, complete_till: completeTill, entity_id: leadId, entity_type: AmoEntityTypes.Leads }],
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
        );
    }

    public async updateTask(accessToken: string, subdomain: string, taskId: number, text: string, completeTill: number): Promise<void> {
        await firstValueFrom(
            this.httpService.patch(
                `https://${subdomain}.amocrm.ru/api/v4/tasks/${taskId}`,
                { text, complete_till: completeTill },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
        );
    }
}
