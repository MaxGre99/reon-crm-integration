import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from '../shared/enums/env.enum';
import { Account } from '../modules/account/account.entity';
import { WidgetModule } from '../modules/widget/widget.module';
import { appSchema } from './app.schema';
import type { AppConfig } from './app.types';
import { CustomField } from '../modules/custom-field/custom-field.entity';
import { ContactModule } from '../modules/contact/contact.module';
import { DealModule } from '../modules/deal/deal.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, validationSchema: appSchema }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<AppConfig>) => ({
                type: 'postgres',
                host: configService.get(Env.DbHost),
                port: Number(configService.get(Env.DbPort)),
                username: configService.get(Env.DbUser),
                password: configService.get(Env.DbPassword),
                database: configService.get(Env.DbName),
                entities: [Account, CustomField],
                synchronize: true,
            }),
        }),
        WidgetModule,
        ContactModule,
        DealModule,
    ],
})
export class AppModule {}
