import { Module } from '@nestjs/common';
import { AmoModule } from '../amo/amo.module';
import { AccountModule } from '../account/account.module';
import { CustomFieldModule } from '../custom-field/custom-field.module';
import { ContactModule } from '../contact/contact.module';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';

@Module({
    imports: [AmoModule, AccountModule, CustomFieldModule, ContactModule],
    controllers: [DealController],
    providers: [DealService],
})
export class DealModule {}
