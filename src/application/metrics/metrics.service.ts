import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MetricsServiceGRPC } from 'src/domain/metrics-service-grpc';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

@Injectable()
export class MetricsService implements OnModuleInit {
    private metricsService: MetricsServiceGRPC;

    constructor(@Inject('METRICS_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.metricsService = this.client.getService<MetricsServiceGRPC>('MetricsService');
    }

    private toTimestamp(dateString: string): Timestamp {
        const date = new Date(dateString);
        const timestamp = new Timestamp();
        timestamp.setSeconds(Math.floor(date.getTime() / 1000));
        timestamp.setNanos((date.getTime() % 1000) * 1e6);
        return timestamp;
    }

    public getMetricsForUptimeHost(from: string, to: string, host_id: number): Observable<any> {
        const fromTimestamp = this.toTimestamp(from);
        const toTimestamp = this.toTimestamp(to);
        return this.metricsService.GetHostUptime({ from: fromTimestamp, to: toTimestamp, host_id });
    }

    public getMetricsForUptimeProxy(from: string, to: string, proxy_id: number): Observable<any> {
        const fromTimestamp = this.toTimestamp(from);
        const toTimestamp = this.toTimestamp(to);
        return this.metricsService.GetProxyUptime({ from: fromTimestamp, to: toTimestamp, proxy_id });
    }
}