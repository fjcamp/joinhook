import { Module } from '@nestjs/common';
import { GetHealthStatusUseCase } from './application/get-health-status.use-case.js';
import { HEALTH_STATUS_READER } from './application/ports/health-status-reader.port.js';
import { HealthController } from './adapters/inbound/http/health.controller.js';
import { RuntimeHealthAdapter } from './adapters/outbound/runtime-health.adapter.js';

@Module({
  controllers: [HealthController],
  providers: [
    GetHealthStatusUseCase,
    RuntimeHealthAdapter,
    {
      provide: HEALTH_STATUS_READER,
      useExisting: RuntimeHealthAdapter,
    },
  ],
})
export class HealthModule {}
