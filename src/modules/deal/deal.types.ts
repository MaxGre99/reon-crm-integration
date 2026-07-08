export type DealWebhookEntity = {
    id: string;
};

export type DealWebhookPayload = {
    account: {
        id: string;
    };
    leads?: {
        add?: DealWebhookEntity[];
        update?: DealWebhookEntity[];
    };
};
