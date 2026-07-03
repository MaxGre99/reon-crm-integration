import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { WidgetController } from './widget.controller';
import { WidgetService } from './widget.service';

@Module({
    imports: [AccountModule],
    controllers: [WidgetController],
    providers: [WidgetService],
})
export class WidgetModule {}
