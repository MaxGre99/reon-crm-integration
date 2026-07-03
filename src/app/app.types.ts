import { Env } from '../shared/enums/env.enum';

export type AppConfig = {
    [Env.Port]: number;
    [Env.ClientId]: string;
    [Env.ClientSecret]: string;
    [Env.RedirectUri]: string;
    [Env.DbHost]: string;
    [Env.DbPort]: string;
    [Env.DbUser]: string;
    [Env.DbPassword]: string;
    [Env.DbName]: string;
    [Env.ErrorTaskTypeId]: string;
    [Env.CheckTaskTypeId]: string;
};
