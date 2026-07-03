import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { AmoCustomField, AmoToken, AmoCustomFieldsResponse, AmoEntityType, AmoCustomFieldType } from './amo.types';
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

    public async getCustomFields(accessToken: string, subdomain: string, entityType: AmoEntityType): Promise<AmoCustomField[]> {
        const { data } = await firstValueFrom(
            this.httpService.get<AmoCustomFieldsResponse>(`https://${subdomain}.amocrm.ru/api/v4/${entityType}/custom_fields`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );

        return data._embedded.custom_fields;
    }

    public async createCustomField(
        accessToken: string,
        subdomain: string,
        entityType: AmoEntityType,
        name: string,
        fieldType: AmoCustomFieldType
    ): Promise<AmoCustomField> {
        const { data } = await firstValueFrom(
            this.httpService.post<AmoCustomFieldsResponse>(
                `https://${subdomain}.amocrm.ru/api/v4/${entityType}/custom_fields`,
                [
                    {
                        name,
                        type: fieldType,
                    },
                ],
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
        );

        return data._embedded.custom_fields[0];
    }
}
