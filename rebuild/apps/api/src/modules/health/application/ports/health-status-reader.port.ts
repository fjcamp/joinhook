import type { HealthStatus } from '../../domain/health-status.js';

export const HEALTH_STATUS_READER = Symbol('HEALTH_STATUS_READER');

export interface HealthStatusReaderPort {
  read(): HealthStatus;
}
