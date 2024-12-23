import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
    public constructor(
        private readonly metricsService: MetricsService
    ) { }

    @Get("/uptime/host")
    public async getMetricsForUptimeHost(
        @Query("from") from: Date,
        @Query("to") to: Date,
        @Query("all") all: boolean,
        @Res() response: Response
    ) {
        if (!from || !to || !all) {
            return response.status(HttpStatus.BAD_REQUEST)
        }
        const output = await this.metricsService.getMetricsForUptimeHost(from, to, all);
        return response.status(HttpStatus.OK).json(output)
    }
}
