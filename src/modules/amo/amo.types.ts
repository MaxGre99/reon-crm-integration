import { AmoCustomFieldTypes, AmoEntityTypes, AmoWebhookEvents } from './amo.consts';

export type AmoToken = {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
};

export type AmoCustomFieldEnum = {
    id?: number;
    value: string;
    sort: number;
};

export type AmoCustomField = {
    id: number;
    name: string;
    type: string;
    enums?: AmoCustomFieldEnum[];
};

export type AmoCustomFieldsResponse = {
    _embedded: {
        custom_fields: AmoCustomField[];
    };
};

export type AmoWebhook = {
    id: number;
    destination: string;
    settings: string[];
};

export type AmoWebhooksResponse = {
    _embedded: {
        webhooks: AmoWebhook[];
    };
};

export type AmoEntityType = (typeof AmoEntityTypes)[keyof typeof AmoEntityTypes];
export type AmoCustomFieldType = (typeof AmoCustomFieldTypes)[keyof typeof AmoCustomFieldTypes];
export type AmoWebhookEvent = (typeof AmoWebhookEvents)[keyof typeof AmoWebhookEvents];
