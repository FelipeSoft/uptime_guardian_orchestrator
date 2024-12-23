import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MetricsModule } from './application/metrics/metrics.module';
import kafkaConfig from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [kafkaConfig],
    }),
    MetricsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
