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

export type AmoCustomFieldValue = {
    field_id: number;
    field_name?: string;
    field_type?: string;
    values: { value: string | number }[];
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

export type AmoContact = {
    id: number;
    name?: string;
    custom_fields_values: AmoCustomFieldValue[] | null;
};

export type AmoLeadContact = {
    id: number;
    is_main: boolean;
};

export type AmoLead = {
    id: number;
    price: number;
    custom_fields_values: AmoCustomFieldValue[] | null;
    _embedded?: {
        contacts?: AmoLeadContact[];
    };
};

export type AmoTask = {
    id: number;
    task_type_id: number;
    text: string;
    complete_till: number;
    entity_id: number;
    entity_type: string;
    is_completed: boolean;
};

export type AmoTasksResponse = {
    _embedded: {
        tasks: AmoTask[];
    };
};

export type AmoEntityType = (typeof AmoEntityTypes)[keyof typeof AmoEntityTypes];
export type AmoCustomFieldType = (typeof AmoCustomFieldTypes)[keyof typeof AmoCustomFieldTypes];
export type AmoWebhookEvent = (typeof AmoWebhookEvents)[keyof typeof AmoWebhookEvents];
