import { Injectable } from '@nestjs/common';
import type { AmoCustomField, AmoEntityType } from '../amo/amo.types';
import { CustomFieldRepository } from './custom-field.repository';
import { AmoService } from '../amo/amo.service';
import { Account } from '../account/account.entity';
import { AmoEntityTypes } from '../amo/amo.consts';
import { REQUIRED_CONTACT_CUSTOM_FIELDS, REQUIRED_DEAL_CUSTOM_FIELDS } from '../../shared/constants/custom-fields';
import type { RequiredCustomField } from './custom-field.types';

@Injectable()
export class CustomFieldService {
    constructor(
        private readonly customFieldRepository: CustomFieldRepository,
        private readonly amoService: AmoService
    ) {}

    public async setup(account: Account, accessToken: string): Promise<void> {
        await this.customFieldRepository.deleteByAccount(account);

        await this.processFields(account, accessToken, AmoEntityTypes.Contacts, REQUIRED_CONTACT_CUSTOM_FIELDS);
        await this.processFields(account, accessToken, AmoEntityTypes.Leads, REQUIRED_DEAL_CUSTOM_FIELDS);
    }

    private async processFields(
        account: Account,
        accessToken: string,
        entityType: AmoEntityType,
        requiredFields: RequiredCustomField[]
    ): Promise<void> {
        const existingFields = await this.amoService.getCustomFields(accessToken, account.subdomain, entityType);

        for (const { name, type } of requiredFields) {
            const amoField: AmoCustomField =
                existingFields.find((field) => field.name === name && field.type === type) ??
                (await this.amoService.createCustomField(accessToken, account.subdomain, entityType, name, type));

            await this.customFieldRepository.save(account, {
                fieldId: amoField.id,
                fieldName: amoField.name,
                fieldType: amoField.type,
            });
        }
    }
}
