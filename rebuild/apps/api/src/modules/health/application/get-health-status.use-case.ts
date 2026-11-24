import { Inject, Injectable } from '@nestjs/common';
import type { HealthStatus } from '../domain/health-status.js';
import {
  HEALTH_STATUS_READER,
  type HealthStatusReaderPort,
} from './ports/health-status-reader.port.js';

@Injectable()
export class GetHealthStatusUseCase {
  constructor(
    @Inject(HEALTH_STATUS_READER)
    private readonly healthStatusReader: HealthStatusReaderPort,
  ) {}

  execute(): HealthStatus {
    return this.healthStatusReader.read();
  }
}
