import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AmoModule } from '../amo/amo.module';
import { JwtModule } from '@nestjs/jwt';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';
import { CustomFieldModule } from '../custom-field/custom-field.module';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
    imports: [TypeOrmModule.forFeature([Account]), AmoModule, JwtModule, CustomFieldModule, WebhookModule],
    providers: [AccountRepository, AccountService],
    exports: [AccountService],
})
export class AccountModule {}
