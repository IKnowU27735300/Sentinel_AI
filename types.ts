export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface MaintenanceWindow {
  days: DayOfWeek[];
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
}

export type ServiceType = 'docker' | 'systemd' | 'kubernetes' | 'static';

export interface ServiceConfig {
  id: string;
  name: string;
  type: ServiceType;
  details: string; // e.g. container name, or host:port
}

export interface NotificationConfig {
  channel: 'slack' | 'email' | 'pagerduty';
  destination: string;
  notifyOnWarning: boolean;
}

export interface AutoRemediationConfig {
  restartService: boolean;
  triggerBackup: boolean;
  applyPatches: boolean;
  scaleInstances: boolean;
}

export interface AgentConfiguration {
  maintenanceWindow: MaintenanceWindow;
  services: ServiceConfig[];
  notifications: NotificationConfig;
  autoRemediation: AutoRemediationConfig;
  sshKeyPath: string; // Simulated secure input
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}