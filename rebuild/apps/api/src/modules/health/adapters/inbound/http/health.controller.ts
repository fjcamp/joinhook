import { Controller, Get } from '@nestjs/common';
import { GetHealthStatusUseCase } from '../../../application/get-health-status.use-case.js';

@Controller('health')
export class HealthController {
  constructor(
    private readonly getHealthStatus: GetHealthStatusUseCase,
  ) {}

  @Get()
  read() {
    return this.getHealthStatus.execute();
  }
}
