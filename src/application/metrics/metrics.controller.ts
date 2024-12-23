import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
    public constructor(
        private readonly metricsService: MetricsService
    ) { }

    @Get("/uptime/host")
    public async getMetricsForUptimeHost(@Query("from") from: string, @Query("to") to: string, @Query("all") all: string, @Res() response: Response) {
        if (!from || !to || !all) {
            return response.status(HttpStatus.BAD_REQUEST).json({ error: "missing query properties on url." })
        }

        let fromDateISOString: string;
        let toDateISOString: string;

        try {
            fromDateISOString = new Date(from).toISOString()
        } catch (error) {
            if (error instanceof RangeError) {
                return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({error: "provided 'from' query param on url is not a valid date."})
            }
        }

        try {
            toDateISOString = new Date(to).toISOString()
        } catch (error) {
            if (error instanceof RangeError) {
                return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({error: "provided 'to' query param on url is not a valid date."})
            }
        }

        if (all !== "true" && all != "false") {
            return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({error: "provided 'all' query param on url is not a valid boolean."})
        }

        const output = await this.metricsService.getMetricsForUptimeHost(fromDateISOString, toDateISOString, JSON.parse(all));
        return response.status(HttpStatus.OK).json(output)
    }
}
