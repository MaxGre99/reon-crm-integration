import { AmoWebhookEvents } from '../../modules/amo/amo.consts';
import { Endpoints } from './endpoints';

export const REQUIRED_WEBHOOKS = [
    {
        path: `${Endpoints.Webhook.Base}/${Endpoints.Webhook.Contacts}`,
        events: [AmoWebhookEvents.AddContact, AmoWebhookEvents.UpdateContact],
    },
    {
        path: `${Endpoints.Webhook.Base}/${Endpoints.Webhook.Leads}`,
        events: [AmoWebhookEvents.AddLead, AmoWebhookEvents.UpdateLead],
    },
];
