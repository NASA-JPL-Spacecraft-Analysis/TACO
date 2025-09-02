/**
 * Used to hold the settings for our testbeds.
 */
export interface TestbedSettings {
  id: number;
  testbedId: number;
  emailNotificationsList: string;
  recentlyChangedIndicatorEnabled: boolean;
  recentlyChangedIndicatorDays: number;
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number;
  testbedEditGroup: string;
}
