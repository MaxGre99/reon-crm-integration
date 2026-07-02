import { Controller, Logger, Get, Query } from '@nestjs/common';
import { Endpoints } from '../../shared/constants/endpoints';
import { WidgetService } from './widget.service';
import type { InstallQuery, RemoveQuery } from './widget.types';

@Controller(Endpoints.Widget.Base)
export class WidgetController {
    private readonly logger = new Logger(WidgetController.name);

    constructor(private readonly widgetService: WidgetService) {}

    @Get(Endpoints.Widget.Install)
    public install(@Query() query: InstallQuery): void {
        const subdomain = query.referer.replace('.amocrm.ru', '');

        this.widgetService.install(query.code, subdomain).catch((error: unknown) => this.logger.error('Install error', error));
    }

    @Get(Endpoints.Widget.Remove)
    public remove(@Query() query: RemoveQuery): void {
        this.widgetService.remove(Number(query.account_id)).catch((error: unknown) => this.logger.error('Remove error', error));
    }
}
