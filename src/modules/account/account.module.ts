import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AmoModule } from '../amo/amo.module';
import { JwtModule } from '@nestjs/jwt';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

@Module({
    imports: [TypeOrmModule.forFeature([Account]), AmoModule, JwtModule],
    providers: [AccountRepository, AccountService],
    exports: [AccountService],
})
export class AccountModule {}
