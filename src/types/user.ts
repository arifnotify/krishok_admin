export interface User {
  _id: string;

  phone: string;

  isBlocked: boolean;

  blockReason?: string;

  createdAt: string;
}