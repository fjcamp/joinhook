import { Injectable } from '@nestjs/common';
import type { HealthStatus } from '../../domain/health-status.js';
import type { HealthStatusReaderPort } from '../../application/ports/health-status-reader.port.js';

@Injectable()
export class RuntimeHealthAdapter implements HealthStatusReaderPort {
  read(): HealthStatus {
    return {
      status: 'ok',
      service: 'joinhook-public-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      dependencies: {
        postgresql: 'not_checked',
      },
    };
  }
}
