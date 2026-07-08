export interface RewardSettings {
  _id?: string;

  regularPercentage: number;

  premiumPercentage: number;

  vipPercentage: number;

  perAmount: number;

  minimumRedeem: number;

  maximumRedeem: number;

  expireDays: number;

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;

  __v?: number;
}