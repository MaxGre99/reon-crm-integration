export type ContactWebhookEntity = {
    id: string;
};

export type ContactWebhookPayload = {
    account: {
        subdomain: string;
    };
    contacts?: {
        add?: ContactWebhookEntity[];
        update?: ContactWebhookEntity[];
    };
};
