export type ContactWebhookEntity = {
    id: string;
};

export type ContactWebhookPayload = {
    account: {
        id: string;
    };
    contacts?: {
        add?: ContactWebhookEntity[];
        update?: ContactWebhookEntity[];
    };
};
