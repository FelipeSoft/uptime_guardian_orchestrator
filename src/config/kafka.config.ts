import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
    clientId: process.env.KAFKA_CLIENT_ID || 'my-app',
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    groupId: process.env.KAFKA_GROUP_ID || 'my-group',
}));