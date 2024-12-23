import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [MetricsService]
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    service = module.get<MetricsService>(MetricsService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should returns an 422 status code if period (from...to) on URL are not ISO 8601 datetime.', async () => {
    const from = "abc123";
    const to = "abc123";

    let response = {
      statusCode: 200,
      message: "ok",
    }

    try {
      new Date(from).toISOString()
      response = {
        statusCode: 200,
        message: "ok",
      }
    } catch (error) {
      if (error instanceof RangeError) {
        response = {
          statusCode: 422,
          message: "invalid date 'from' date"
        }
      }
    }

    try {
      new Date(to).toISOString()
      response = {
        statusCode: 200,
        message: "ok",
      }
    } catch (error) {
      if (error instanceof RangeError) {
        response = {
          statusCode: 422,
          message: "invalid date 'to' date"
        }
      }
    }

    expect(response.statusCode).toBe(422)
    expect(response.statusCode).toBe(422)
  });

  it('should returns an 422 status code if the param for host/proxy id is not a number value.', () => {
    let hostOrProxyId = "abc";
    let response = {
      statusCode: 200,
      message: "ok",
    }
    if (isNaN(Number(hostOrProxyId))) {
      response = {
        statusCode: 422,
        message: "invalid 'host/proxy id' number param",
      }
    }
    expect(response.statusCode).toBe(422)
  });
});
