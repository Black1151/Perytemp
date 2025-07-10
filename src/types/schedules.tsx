export type ScheduleType = 'email'

// Shared fields
export interface BaseSchedule {
  custSchedId: number
  name: string;
  scheduleId: number;
  customerId: number;
  toolId: number;
  isActive: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek: number[]; // e.g., [1] = Monday
  daysOfMonth: number[]; // e.g., [1, 15, 30]
  lastDayOfMonth: boolean;
  sendTime: string; // e.g., "15:30:00"
  subscriptionType: "paid" | "free"
}

// Specific schedule types
export interface EmailSchedule extends BaseSchedule {
  type: 'email';
  userDistGroupNames: string[];
}

// Union type for all supported schedules
export type QuickSchedule = EmailSchedule

// List type
export type QuickScheduleList = QuickSchedule[];
