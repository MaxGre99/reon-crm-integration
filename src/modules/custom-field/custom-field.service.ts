import { Injectable } from '@nestjs/common';
import type { AmoCustomField, AmoEntityType } from '../amo/amo.types';
import { CustomFieldRepository } from './custom-field.repository';
import { AmoService } from '../amo/amo.service';
import type { Account } from '../account/account.entity';
import { AmoCustomFieldTypes, AmoEntityTypes } from '../amo/amo.consts';
import {
    REQUIRED_CONTACT_CUSTOM_FIELDS,
    REQUIRED_DEAL_CUSTOM_FIELDS,
    REQUIRED_SERVICE_ENUM_VALUES,
} from '../../shared/constants/custom-fields';
import type { RequiredCustomField } from './custom-field.types';
import type { CustomField } from './custom-field.entity';

@Injectable()
export class CustomFieldService {
    constructor(
        private readonly customFieldRepository: CustomFieldRepository,
        private readonly amoService: AmoService
    ) {}

    public async setup(account: Account, accessToken: string): Promise<void> {
        const existingDbFields = await this.customFieldRepository.findByAccount(account);

        await this.customFieldRepository.deleteByAccount(account);

        await this.processFields(account, accessToken, AmoEntityTypes.Contacts, REQUIRED_CONTACT_CUSTOM_FIELDS, existingDbFields);
        await this.processFields(account, accessToken, AmoEntityTypes.Leads, REQUIRED_DEAL_CUSTOM_FIELDS, existingDbFields);
    }

    private async processFields(
        account: Account,
        accessToken: string,
        entityType: AmoEntityType,
        requiredFields: RequiredCustomField[],
        existingDbFields: CustomField[]
    ): Promise<void> {
        const existingAmoFields = await this.amoService.getCustomFields(accessToken, account.subdomain, entityType);

        for (const { name, type } of requiredFields) {
            const existingDbField = existingDbFields.find((f) => f.fieldName === name);
            const existingAmoField: AmoCustomField | undefined =
                (existingDbField ? existingAmoFields.find((f) => f.id === existingDbField.fieldId) : undefined) ??
                existingAmoFields.find((f) => f.name === name && f.type === type);

            let amoField: AmoCustomField;
            if (existingAmoField) {
                amoField = existingAmoField;
                if (type === AmoCustomFieldTypes.Multiselect) {
                    await this.setupMultiselectEnums(accessToken, account.subdomain, entityType, amoField);
                }
            } else {
                const enums =
                    type === AmoCustomFieldTypes.Multiselect
                        ? REQUIRED_SERVICE_ENUM_VALUES.map((value, index) => ({ value, sort: (index + 1) * 10 }))
                        : undefined;
                amoField = await this.amoService.createCustomField(accessToken, account.subdomain, entityType, name, type, enums);
            }

            await this.customFieldRepository.save(account, { fieldId: amoField.id, fieldName: name, fieldType: type });
        }
    }

    private async setupMultiselectEnums(
        accessToken: string,
        subdomain: string,
        entityType: AmoEntityType,
        field: AmoCustomField
    ): Promise<void> {
        const existingValues = (field.enums ?? []).map((e) => e.value);
        const missingValues = REQUIRED_SERVICE_ENUM_VALUES.filter((value) => !existingValues.includes(value));

        if (missingValues.length === 0) {
            return;
        }

        const maxSort = field.enums?.length ? Math.max(...field.enums.map((e) => e.sort)) : 0;
        const updatedEnums = [
            ...(field.enums ?? []),
            ...missingValues.map((value, index) => ({ value, sort: maxSort + (index + 1) * 10 })),
        ];

        await this.amoService.updateCustomFieldEnums(accessToken, subdomain, entityType, field.id, updatedEnums);
    }
}
