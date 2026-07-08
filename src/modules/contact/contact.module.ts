import { Module } from '@nestjs/common';
import { AmoModule } from '../amo/amo.module';
import { AccountModule } from '../account/account.module';
import { CustomFieldModule } from '../custom-field/custom-field.module';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
    imports: [AmoModule, AccountModule, CustomFieldModule],
    providers: [ContactService],
    controllers: [ContactController],
    exports: [ContactService],
})
export class ContactModule {}
