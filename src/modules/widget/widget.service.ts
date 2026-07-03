import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';

@Injectable()
export class WidgetService {
    constructor(private readonly accountService: AccountService) {}

    public async install(code: string, subdomain: string): Promise<void> {
        await this.accountService.install(code, subdomain);
    }

    public async remove(accountId: number): Promise<void> {
        await this.accountService.remove(accountId);
    }
}
