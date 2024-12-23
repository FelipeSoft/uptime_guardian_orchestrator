import { Observable } from "rxjs"
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

export interface MetricsServiceGRPC {
    TestProxyConnection(data: { proxy_id: number[] }): Observable<{ proxy_id: number, status: boolean }[]>
    TestHostConnection(data: { host_id: number[] }): Observable<{ host_id: number, status: boolean }[]>
    GetProxyUptime(data: { proxy_id: number, from: Timestamp, to: Timestamp }): Observable<{ proxy_id: number, uptime_percentage: number, inactivity_percentage: number }[]>
    GetHostUptime(data: { host_id: number, from: Timestamp, to: Timestamp }): Observable<{ host_id: number, uptime_percentage: number, inactivity_percentage: number }[]>
    GetProxyLatency(data: { proxy_id: number, from: Timestamp, to: Timestamp }): Observable<{ proxy_id: number, latency: number, time: number }[]>
    GetHostLatency(data: { host_id: number, from: Timestamp, to: Timestamp }): Observable<{ host_id: number, latency: number, time: number }[]>
}