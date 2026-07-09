export interface RewardSettings {


  _id?: string;



  // CUSTOMER LEVEL

  premiumAmount: number;

  vipAmount: number;



  // REWARD %

  regularPercentage: number;

  premiumPercentage: number;

  vipPercentage: number;



  // RULE

  perAmount: number;

  minimumRedeem: number;

  maximumRedeem: number;

  expireDays: number;



  isActive: boolean;



  createdAt?: string;

  updatedAt?: string;

  __v?: number;

}