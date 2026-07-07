import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Endpoints } from '../../shared/constants/endpoints';

@Controller(Endpoints.Webhook.Base)
export class WebhookController {
    @Post(Endpoints.Webhook.Leads)
    @HttpCode(HttpStatus.OK)
    public handleLeads(): void {
        return;
    }
}
