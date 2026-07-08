import { Module } from '@nestjs/common';
import { AmoModule } from '../amo/amo.module';
import { WebhookService } from './webhook.service';

@Module({
    imports: [AmoModule],
    providers: [WebhookService],
    exports: [WebhookService],
})
export class WebhookModule {}
