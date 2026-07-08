import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { Endpoints } from '../../shared/constants/endpoints';
import { DealService } from './deal.service';
import type { DealWebhookPayload } from './deal.types';

@Controller(Endpoints.Webhook.Base)
export class DealController {
    private readonly logger = new Logger(DealController.name);

    constructor(private readonly dealService: DealService) {}

    @Post(Endpoints.Webhook.Leads)
    @HttpCode(HttpStatus.OK)
    public handleWebhook(@Body() payload: DealWebhookPayload): void {
        this.dealService.handleWebhook(payload).catch((error: unknown) => this.logger.error('Deal webhook error', error));
    }
}
