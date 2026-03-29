export type RiskProfile = 'low' | 'medium' | 'high';
export type TaxRegime = 'old' | 'new';

export interface PersonProfile {
  name: string;
  age: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingInvestments: number;
  existingSIPs: number;
  hra: number;
  rentPaid: number;
  section80C: number;
  section80D: number;
  npsContribution: number;
  homeLoanInterest: number;
  taxRegime: TaxRegime;
  riskProfile: RiskProfile;
  hasLifeInsurance: boolean;
  lifeInsuranceCover: number;
  hasHealthInsurance: boolean;
  healthInsuranceCover: number;
}

export interface CoupleData {
  partner1: PersonProfile;
  partner2: PersonProfile;
  combinedGoals: FinancialGoal[];
  emergencyFundTarget: number;
  currentEmergencyFund: number;
}

export type GoalType = 'house' | 'retirement' | 'travel' | 'education' | 'wedding' | 'car' | 'other';

export interface FinancialGoal {
  id: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  currentSavings: number;
  timelineYears: number;
  priority: 'high' | 'medium' | 'low';
}

export interface GoalPlan {
  goal: FinancialGoal;
  monthlySIP: number;
  equityPercent: number;
  debtPercent: number;
  goldPercent: number;
  expectedReturn: number;
  projectedValue: number;
}

export type LifeEventType = 'bonus' | 'marriage' | 'baby' | 'inheritance' | 'job_change' | 'home_purchase';

export interface LifeEvent {
  type: LifeEventType;
  amount: number;
  description: string;
}

export interface LifeEventAdvice {
  allocation: { save: number; invest: number; spend: number };
  taxStrategies: string[];
  portfolioAdjustments: string[];
  emergencyFundUpdate: string;
  riskRecommendations: string[];
}

export interface HealthScore {
  total: number;
  breakdown: {
    emergencyFund: number;
    insurance: number;
    debtHealth: number;
    diversification: number;
    taxEfficiency: number;
    retirementReadiness: number;
  };
  suggestions: string[];
}

export interface TaxComparison {
  oldRegimeTax: number;
  newRegimeTax: number;
  recommended: TaxRegime;
  savings: number;
  deductions: {
    label: string;
    amount: number;
    maxAllowed: number;
    section: string;
  }[];
}
