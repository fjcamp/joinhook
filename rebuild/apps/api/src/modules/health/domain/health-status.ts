export interface HealthStatus {
  readonly status: 'ok';
  readonly service: 'joinhook-public-api';
  readonly timestamp: string;
  readonly uptimeSeconds: number;
  readonly dependencies: {
    readonly postgresql: 'not_checked';
  };
}
