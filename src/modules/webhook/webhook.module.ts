import { Module } from '@nestjs/common';
import { AmoModule } from '../amo/amo.module';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';

@Module({
    imports: [AmoModule],
    providers: [WebhookService],
    controllers: [WebhookController],
    exports: [WebhookService],
})
export class WebhookModule {}
