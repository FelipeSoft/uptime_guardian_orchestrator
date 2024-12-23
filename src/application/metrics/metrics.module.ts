import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { AxiosService } from 'src/infrastructure/axios/axios.service';

@Module({
    controllers: [MetricsController],
    providers: [
        MetricsService,
        {
            provide: "HttpClient",
            useClass: AxiosService
        }
    ]
})
export class MetricsModule {}
