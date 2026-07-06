import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomField } from './custom-field.entity';
import { Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import { CustomFieldData } from './custom-field.types';

@Injectable()
export class CustomFieldRepository {
    constructor(
        @InjectRepository(CustomField)
        private readonly repository: Repository<CustomField>
    ) {}

    public async save(account: Account, data: CustomFieldData): Promise<void> {
        await this.repository.save({
            account,
            ...data,
        });
    }

    public async findByAccount(account: Account): Promise<CustomField[]> {
        return this.repository.findBy({ account: { id: account.id } });
    }

    public async findByName(account: Account, fieldName: string): Promise<CustomField | null> {
        return this.repository.findOneBy({ account: { id: account.id }, fieldName });
    }

    public async deleteByAccount(account: Account): Promise<void> {
        await this.repository.delete({ account: { id: account.id } });
    }
}
