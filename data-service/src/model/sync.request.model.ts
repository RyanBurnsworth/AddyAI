export interface SyncRequest {
  userId: number;

  customerId: string;

  refreshToken: string;

  loginCustomerId?: string;
}
