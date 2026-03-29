import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { CoupleData, PersonProfile, FinancialGoal } from '@/types/finance';

const defaultPerson: PersonProfile = {
  name: '',
  age: 30,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  existingInvestments: 0,
  existingSIPs: 0,
  hra: 0,
  rentPaid: 0,
  section80C: 0,
  section80D: 0,
  npsContribution: 0,
  homeLoanInterest: 0,
  taxRegime: 'new',
  riskProfile: 'medium',
  hasLifeInsurance: false,
  lifeInsuranceCover: 0,
  hasHealthInsurance: false,
  healthInsuranceCover: 0,
};

const defaultData: CoupleData = {
  partner1: { ...defaultPerson, name: 'Partner 1' },
  partner2: { ...defaultPerson, name: 'Partner 2' },
  combinedGoals: [],
  emergencyFundTarget: 0,
  currentEmergencyFund: 0,
};

interface CoupleContextType {
  data: CoupleData;
  setData: React.Dispatch<React.SetStateAction<CoupleData>>;
  updatePartner1: (updates: Partial<PersonProfile>) => void;
  updatePartner2: (updates: Partial<PersonProfile>) => void;
  addGoal: (goal: FinancialGoal) => void;
  removeGoal: (id: string) => void;
  isOnboarded: boolean;
  setIsOnboarded: (v: boolean) => void;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export function CoupleProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CoupleData>(defaultData);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const updatePartner1 = (updates: Partial<PersonProfile>) =>
    setData(prev => ({ ...prev, partner1: { ...prev.partner1, ...updates } }));
  const updatePartner2 = (updates: Partial<PersonProfile>) =>
    setData(prev => ({ ...prev, partner2: { ...prev.partner2, ...updates } }));
  const addGoal = (goal: FinancialGoal) =>
    setData(prev => ({ ...prev, combinedGoals: [...prev.combinedGoals, goal] }));
  const removeGoal = (id: string) =>
    setData(prev => ({ ...prev, combinedGoals: prev.combinedGoals.filter(g => g.id !== id) }));

  return (
    <CoupleContext.Provider value={{ data, setData, updatePartner1, updatePartner2, addGoal, removeGoal, isOnboarded, setIsOnboarded }}>
      {children}
    </CoupleContext.Provider>
  );
}

export function useCouple() {
  const ctx = useContext(CoupleContext);
  if (!ctx) throw new Error('useCouple must be within CoupleProvider');
  return ctx;
}
