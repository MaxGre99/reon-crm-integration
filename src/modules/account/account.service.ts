import { Injectable, Logger } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AmoService } from '../amo/amo.service';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';

type AmoJwtPayload = {
    account_id: number;
};

@Injectable()
export class AccountService {
    private readonly logger = new Logger(AccountService.name);

    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly amoService: AmoService,
        private readonly jwtService: JwtService
    ) {}

    public async install(code: string, subdomain: string): Promise<void> {
        const token = await this.amoService.getToken(code, subdomain);

        const payload = this.jwtService.decode<AmoJwtPayload>(token.access_token);
        if (!payload) {
            throw new Error('Failed to decode access token');
        }

        await this.accountRepository.upsert(payload.account_id, subdomain, token.access_token, token.refresh_token);
    }

    public async remove(accountId: number): Promise<void> {
        await this.accountRepository.remove(accountId);
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    public async refreshTokens(): Promise<void> {
        const accounts = await this.accountRepository.findAllInstalled();

        for (const account of accounts) {
            if (!account.refreshToken) {
                continue;
            }

            await this.amoService
                .refreshToken(account.refreshToken, account.subdomain)
                .then((token) =>
                    this.accountRepository.upsert(account.accountId, account.subdomain, token.access_token, token.refresh_token)
                )
                .catch((error: unknown) => this.logger.error(`Failed to refresh token for account ${account.accountId}`, error));
        }
    }
}
