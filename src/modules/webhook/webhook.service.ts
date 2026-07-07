import { Injectable } from '@nestjs/common';
import { AmoService } from '../amo/amo.service';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../app/app.types';
import type { Account } from '../account/account.entity';
import { Env } from '../../shared/enums/env.enum';
import { REQUIRED_WEBHOOKS } from '../../shared/constants/webhooks';

@Injectable()
export class WebhookService {
    constructor(
        private readonly amoService: AmoService,
        private readonly configService: ConfigService<AppConfig>
    ) {}

    public async setup(account: Account, accessToken: string): Promise<void> {
        const redirectUri = this.configService.getOrThrow<string>(Env.RedirectUri);
        const origin = new URL(redirectUri).origin;

        const existingWebhooks = await this.amoService.getWebhooks(accessToken, account.subdomain);

        for (const { path, events } of REQUIRED_WEBHOOKS) {
            const destination = `${origin}/${path}`;
            const existingWebhook = existingWebhooks.find((webhook) => webhook.destination === destination);

            const isSubscribed = existingWebhook !== undefined && events.every((event) => existingWebhook.settings.includes(event));
            if (isSubscribed) {
                continue;
            }

            await this.amoService.subscribeWebhook(accessToken, account.subdomain, destination, events);
        }
    }
}
