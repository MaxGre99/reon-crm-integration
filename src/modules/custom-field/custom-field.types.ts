import type { AmoCustomFieldType } from '../amo/amo.types';

export type CustomFieldData = {
    fieldId: number;
    fieldName: string;
    fieldType: string;
};

export type RequiredCustomField = {
    name: string;
    type: AmoCustomFieldType;
};
