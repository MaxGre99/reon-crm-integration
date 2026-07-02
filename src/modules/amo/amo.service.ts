import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { AmoToken } from './amo.types';
import { firstValueFrom } from 'rxjs';
import { Env } from '../../shared/enums/env.enum';
import type { AppConfig } from '../../app/app.types';

@Injectable()
export class AmoService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService<AppConfig>
    ) {}

    public async getToken(code: string, subdomain: string): Promise<AmoToken> {
        const { data } = await firstValueFrom(
            this.httpService.post<AmoToken>(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
                client_id: this.configService.get(Env.ClientId),
                client_secret: this.configService.get(Env.ClientSecret),
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.configService.get(Env.RedirectUri),
            })
        );

        return data;
    }

    public async refreshToken(refreshToken: string, subdomain: string): Promise<AmoToken> {
        const { data } = await firstValueFrom(
            this.httpService.post<AmoToken>(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
                client_id: this.configService.get(Env.ClientId),
                client_secret: this.configService.get(Env.ClientSecret),
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })
        );

        return data;
    }
}
