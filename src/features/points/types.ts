// =====================================================
// PCMS - Points feature types
// =====================================================

export interface PointTransaction {
  id: string;
  date: string;
  desc: string;
  delta: number;
  type: 'earn' | 'use' | 'bonus';
}

export interface PointReward {
  id: string;
  title: string;
  cost: number;
  desc: string;
}

export interface PointsAccount {
  balance: number;
  tier: string;
  tierProgress: {
    current: number;
    target: number;
    nextTier: string;
  };
  earned: number;
  used: number;
}

export interface PointsResponse {
  account: PointsAccount;
  transactions: PointTransaction[];
  rewards: PointReward[];
}

export interface RedeemRequest {
  rewardId: string;
}
