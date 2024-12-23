import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
    private kafka: Kafka;
    private producer: Producer;

    constructor(private readonly configService: ConfigService) {
        this.kafka = new Kafka({
            clientId: this.configService.get('kafka.clientId'),
            brokers: this.configService.get('kafka.brokers'),
        });
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
    }

    async publish(topic: string, messages: ProducerRecord['messages']) {
        await this.producer.send({
            topic,
            messages,
        });
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }
}