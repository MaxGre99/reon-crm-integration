import * as Joi from 'joi';
import { Env } from '../shared/enums/env.enum';
import type { AppConfig } from './app.types';

export const appSchema = Joi.object<AppConfig>({
    [Env.Port]: Joi.number().default(3000),
    [Env.ClientId]: Joi.string().required(),
    [Env.ClientSecret]: Joi.string().required(),
    [Env.RedirectUri]: Joi.string().required(),
    [Env.DbHost]: Joi.string().required(),
    [Env.DbPort]: Joi.string().required(),
    [Env.DbUser]: Joi.string().required(),
    [Env.DbPassword]: Joi.string().required(),
    [Env.DbName]: Joi.string().required(),
    [Env.ErrorTaskTypeId]: Joi.string().required(),
    [Env.CheckTaskTypeId]: Joi.string().required(),
});
