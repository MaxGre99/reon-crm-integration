import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountRepository {
    constructor(
        @InjectRepository(Account)
        private readonly repository: Repository<Account>
    ) {}

    public async upsert(accountId: number, subdomain: string, accessToken: string, refreshToken: string): Promise<void> {
        await this.repository.upsert(
            { accountId, subdomain, accessToken, refreshToken, isInstalled: true },
            { conflictPaths: ['accountId'] }
        );
    }

    public async remove(accountId: number): Promise<void> {
        await this.repository.update({ accountId }, { accessToken: null, refreshToken: null, isInstalled: false });
    }

    public async findAllInstalled(): Promise<Account[]> {
        return this.repository.findBy({ isInstalled: true });
    }
}
