import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { Endpoints } from '../../shared/constants/endpoints';
import { ContactService } from './contact.service';
import type { ContactWebhookPayload } from './contact.types';

@Controller(Endpoints.Webhook.Base)
export class ContactController {
    private readonly logger = new Logger(ContactController.name);

    constructor(private readonly contactService: ContactService) {}

    @Post(Endpoints.Webhook.Contacts)
    @HttpCode(HttpStatus.OK)
    public handleWebhook(@Body() payload: ContactWebhookPayload): void {
        this.contactService.handleWebhook(payload).catch((error: unknown) => this.logger.error('Contact webhook error', error));
    }
}
