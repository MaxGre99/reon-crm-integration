export const AmoCustomFieldTypes = {
    Date: 'date',
    Numeric: 'numeric',
    Multiselect: 'multiselect',
} as const;

export const AmoEntityTypes = {
    Contacts: 'contacts',
    Leads: 'leads',
} as const;

export const AmoWebhookEvents = {
    AddContact: 'add_contact',
    UpdateContact: 'update_contact',
    AddLead: 'add_lead',
    UpdateLead: 'update_lead',
} as const;
