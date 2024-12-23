import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'METRICS_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'metrics',
                    protoPath: './src/application/metrics/metrics.proto',
                    url: process.env.METRICS_SERVICE_URL
                },
            },
        ]),
    ],
    controllers: [MetricsController],
    providers: [
        MetricsService
    ]
})
export class MetricsModule { }
