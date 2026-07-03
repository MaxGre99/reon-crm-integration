import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AmoService } from './amo.service';

@Module({
    imports: [HttpModule],
    providers: [AmoService],
    exports: [AmoService],
})
export class AmoModule {}
