import type { PersonProfile, CoupleData, FinancialGoal, GoalPlan, LifeEvent, LifeEventAdvice, HealthScore, TaxComparison, RiskProfile } from '@/types/finance';

// ─── SIP & Growth ───
export function calculateSIP(targetAmount: number, years: number, annualReturn: number): number {
  const r = annualReturn / 12;
  const n = years * 12;
  if (r === 0) return targetAmount / n;
  return (targetAmount * r) / (Math.pow(1 + r, n) - 1);
}

export function calculateFutureValue(monthlySIP: number, years: number, annualReturn: number): number {
  const r = annualReturn / 12;
  const n = years * 12;
  if (r === 0) return monthlySIP * n;
  return monthlySIP * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export function calculateCAGR(beginValue: number, endValue: number, years: number): number {
  if (beginValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / beginValue, 1 / years) - 1) * 100;
}

// ─── Risk-based returns ───
function getExpectedReturn(risk: RiskProfile): { equity: number; debt: number; gold: number; blended: number } {
  const map = {
    low: { equity: 0.10, debt: 0.07, gold: 0.08, blended: 0.08 },
    medium: { equity: 0.12, debt: 0.07, gold: 0.08, blended: 0.10 },
    high: { equity: 0.14, debt: 0.07, gold: 0.08, blended: 0.12 },
  };
  return map[risk];
}

function getAssetAllocation(risk: RiskProfile, age: number) {
  const equityBase = risk === 'high' ? 80 : risk === 'medium' ? 60 : 40;
  const ageFactor = Math.max(0, (age - 25) * 0.5);
  const equity = Math.max(20, Math.min(80, equityBase - ageFactor));
  const gold = 10;
  const debt = 100 - equity - gold;
  return { equity, debt, gold };
}

// ─── Goal Planning ───
export function planGoal(goal: FinancialGoal, risk: RiskProfile, age: number): GoalPlan {
  const allocation = getAssetAllocation(risk, age);
  const returns = getExpectedReturn(risk);
  const remaining = Math.max(0, goal.targetAmount - goal.currentSavings);
  const monthlySIP = calculateSIP(remaining, goal.timelineYears, returns.blended);
  const projectedValue = calculateFutureValue(monthlySIP, goal.timelineYears, returns.blended) + goal.currentSavings;

  return {
    goal,
    monthlySIP: Math.round(monthlySIP),
    equityPercent: allocation.equity,
    debtPercent: allocation.debt,
    goldPercent: allocation.gold,
    expectedReturn: returns.blended * 100,
    projectedValue: Math.round(projectedValue),
  };
}

// ─── Tax Calculation (India FY 2024-25) ───
function calcOldRegimeTax(income: number, deductions: number): number {
  const taxable = Math.max(0, income - deductions);
  let tax = 0;
  if (taxable > 1000000) tax += (taxable - 1000000) * 0.30;
  if (taxable > 500000) tax += Math.min(taxable - 500000, 500000) * 0.20;
  if (taxable > 250000) tax += Math.min(taxable - 250000, 250000) * 0.05;
  tax += tax * 0.04; // cess
  return Math.round(tax);
}

function calcNewRegimeTax(income: number): number {
  const std = 75000;
  const taxable = Math.max(0, income - std);
  let tax = 0;
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 400000, rate: 0.05 },
    { limit: 400000, rate: 0.10 },
    { limit: 400000, rate: 0.15 },
    { limit: 400000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];
  let remaining = taxable;
  for (const slab of slabs) {
    const amt = Math.min(remaining, slab.limit);
    tax += amt * slab.rate;
    remaining -= amt;
    if (remaining <= 0) break;
  }
  tax += tax * 0.04;
  return Math.round(tax);
}

export function compareTax(person: PersonProfile): TaxComparison {
  const annualIncome = person.monthlyIncome * 12;
  const totalDeductions80C = Math.min(person.section80C, 150000);
  const totalDeductions80D = Math.min(person.section80D, 75000);
  const nps = Math.min(person.npsContribution, 50000);
  const hra = Math.min(person.hra, person.rentPaid > 0 ? person.rentPaid - 0.1 * annualIncome : 0);
  const hli = Math.min(person.homeLoanInterest, 200000);
  const stdDeduction = 50000;

  const totalOldDeductions = totalDeductions80C + totalDeductions80D + nps + Math.max(0, hra) + hli + stdDeduction;
  
  const deductions = [
    { label: 'Section 80C (ELSS, PPF, LIC)', amount: totalDeductions80C, maxAllowed: 150000, section: '80C' },
    { label: 'Section 80D (Health Insurance)', amount: totalDeductions80D, maxAllowed: 75000, section: '80D' },
    { label: 'NPS (80CCD)', amount: nps, maxAllowed: 50000, section: '80CCD(1B)' },
    { label: 'HRA Exemption', amount: Math.max(0, hra), maxAllowed: Math.max(0, hra), section: '10(13A)' },
    { label: 'Home Loan Interest', amount: hli, maxAllowed: 200000, section: '24(b)' },
    { label: 'Standard Deduction', amount: stdDeduction, maxAllowed: 50000, section: '16(ia)' },
  ];

  const oldTax = calcOldRegimeTax(annualIncome, totalOldDeductions);
  const newTax = calcNewRegimeTax(annualIncome);

  return {
    oldRegimeTax: oldTax,
    newRegimeTax: newTax,
    recommended: oldTax < newTax ? 'old' : 'new',
    savings: Math.abs(oldTax - newTax),
    deductions,
  };
}

// ─── Health Score ───
export function calculateHealthScore(data: CoupleData): HealthScore {
  const suggestions: string[] = [];
  const monthlyExpenses = data.partner1.monthlyExpenses + data.partner2.monthlyExpenses;
  const emergencyTarget = monthlyExpenses * 6;

  // Emergency fund (0-20)
  const efRatio = Math.min(1, data.currentEmergencyFund / emergencyTarget);
  const emergencyFund = Math.round(efRatio * 20);
  if (efRatio < 1) suggestions.push(`Build emergency fund to ₹${emergencyTarget.toLocaleString('en-IN')} (6 months expenses)`);

  // Insurance (0-20)
  let insuranceScore = 0;
  const totalIncome = (data.partner1.monthlyIncome + data.partner2.monthlyIncome) * 12;
  for (const p of [data.partner1, data.partner2]) {
    if (p.hasLifeInsurance && p.lifeInsuranceCover >= p.monthlyIncome * 12 * 10) insuranceScore += 5;
    else if (p.hasLifeInsurance) insuranceScore += 3;
    if (p.hasHealthInsurance && p.healthInsuranceCover >= 500000) insuranceScore += 5;
    else if (p.hasHealthInsurance) insuranceScore += 3;
  }
  if (insuranceScore < 20) suggestions.push('Increase life insurance to 10x annual income and health cover to ₹5L+ each');

  // Debt health (0-15) — simplified: expense ratio
  const expenseRatio = monthlyExpenses / (data.partner1.monthlyIncome + data.partner2.monthlyIncome);
  const debtHealth = Math.round(Math.max(0, (1 - expenseRatio) * 15));
  if (expenseRatio > 0.5) suggestions.push('Reduce monthly expenses below 50% of combined income');

  // Diversification (0-15)
  const totalInvestments = data.partner1.existingInvestments + data.partner2.existingInvestments;
  const divScore = totalInvestments > totalIncome * 0.5 ? 15 : Math.round((totalInvestments / (totalIncome * 0.5)) * 15);
  if (divScore < 15) suggestions.push('Increase investment portfolio — aim for at least 50% of annual income');

  // Tax efficiency (0-15)
  const tax1 = compareTax(data.partner1);
  const tax2 = compareTax(data.partner2);
  const maxSavings = (data.partner1.monthlyIncome + data.partner2.monthlyIncome) * 12 * 0.05;
  const actualSavings = tax1.savings + tax2.savings;
  const taxEfficiency = Math.min(15, Math.round((1 - actualSavings / Math.max(1, maxSavings)) * 15));
  if (tax1.recommended !== data.partner1.taxRegime || tax2.recommended !== data.partner2.taxRegime)
    suggestions.push('Switch to the recommended tax regime to maximize savings');

  // Retirement readiness (0-15)
  const avgAge = (data.partner1.age + data.partner2.age) / 2;
  const yearsToRetirement = Math.max(0, 60 - avgAge);
  const retirementTarget = totalIncome * 20;
  const projectedRetirement = calculateFutureValue(
    (data.partner1.existingSIPs + data.partner2.existingSIPs),
    yearsToRetirement,
    0.10
  ) + totalInvestments;
  const retirementRatio = Math.min(1, projectedRetirement / retirementTarget);
  const retirementReadiness = Math.round(retirementRatio * 15);
  if (retirementRatio < 0.5) suggestions.push('Increase SIP contributions for retirement — you may fall short of your target');

  const total = emergencyFund + insuranceScore + debtHealth + divScore + taxEfficiency + retirementReadiness;

  return {
    total: Math.min(100, total),
    breakdown: {
      emergencyFund,
      insurance: insuranceScore,
      debtHealth,
      diversification: divScore,
      taxEfficiency,
      retirementReadiness,
    },
    suggestions,
  };
}

// ─── Life Event Coach ───
export function adviseLifeEvent(event: LifeEvent, data: CoupleData): LifeEventAdvice {
  const monthlyExpenses = data.partner1.monthlyExpenses + data.partner2.monthlyExpenses;
  const emergencyGap = Math.max(0, monthlyExpenses * 6 - data.currentEmergencyFund);

  const base: LifeEventAdvice = {
    allocation: { save: 30, invest: 50, spend: 20 },
    taxStrategies: [],
    portfolioAdjustments: [],
    emergencyFundUpdate: '',
    riskRecommendations: [],
  };

  switch (event.type) {
    case 'bonus':
      base.allocation = { save: 20, invest: 60, spend: 20 };
      base.taxStrategies = [
        'Invest up to ₹1.5L in ELSS for 80C deduction',
        'Top up NPS by ₹50,000 for additional 80CCD(1B) benefit',
        'Prepay home loan to save on interest (Section 24)',
      ];
      base.portfolioAdjustments = ['Rebalance to target allocation', 'Consider lump sum in index fund'];
      if (emergencyGap > 0) base.emergencyFundUpdate = `Allocate ₹${Math.min(event.amount * 0.2, emergencyGap).toLocaleString('en-IN')} to emergency fund`;
      else base.emergencyFundUpdate = 'Emergency fund is adequate ✅';
      base.riskRecommendations = ['Good time to take slightly higher equity exposure if timeline > 5 years'];
      break;
    case 'marriage':
      base.allocation = { save: 15, invest: 25, spend: 60 };
      base.taxStrategies = ['Claim Section 80C for joint home loan', 'Restructure health insurance as a family floater (80D)'];
      base.portfolioAdjustments = ['Consolidate duplicate investments', 'Align risk profiles as a couple'];
      base.emergencyFundUpdate = `Increase emergency fund to cover joint expenses: ₹${(monthlyExpenses * 6).toLocaleString('en-IN')}`;
      base.riskRecommendations = ['Moderate risk — balance near-term wedding expenses with long-term goals'];
      break;
    case 'baby':
      base.allocation = { save: 30, invest: 40, spend: 30 };
      base.taxStrategies = ['Start Sukanya Samriddhi if girl child (80C)', 'Increase health insurance cover (80D)'];
      base.portfolioAdjustments = ['Start child education SIP', 'Shift 10% to debt for near-term needs'];
      base.emergencyFundUpdate = `Increase emergency fund by 2 months to ₹${(monthlyExpenses * 8).toLocaleString('en-IN')}`;
      base.riskRecommendations = ['Reduce high-risk allocation by 10%', 'Get term insurance if not already covered'];
      break;
    case 'inheritance':
      base.allocation = { save: 20, invest: 70, spend: 10 };
      base.taxStrategies = ['Inheritance is tax-free in India', 'Income from inherited assets is taxable — plan accordingly'];
      base.portfolioAdjustments = ['Diversify across asset classes', 'Consider real estate vs financial assets ratio'];
      base.emergencyFundUpdate = emergencyGap > 0 ? `Fill emergency fund gap of ₹${emergencyGap.toLocaleString('en-IN')}` : 'Emergency fund is adequate ✅';
      base.riskRecommendations = ['Invest based on your risk profile, not the windfall size'];
      break;
    case 'job_change':
      base.allocation = { save: 40, invest: 40, spend: 20 };
      base.taxStrategies = ['Transfer EPF to new employer', 'Review Form 16 for partial-year tax planning'];
      base.portfolioAdjustments = ['Review and update SIP amounts based on new salary'];
      base.emergencyFundUpdate = 'Ensure 6 months runway during transition';
      base.riskRecommendations = ['Hold off on aggressive investments until settled in new role'];
      break;
    case 'home_purchase':
      base.allocation = { save: 10, invest: 20, spend: 70 };
      base.taxStrategies = [
        'Home loan principal: 80C (up to ₹1.5L)',
        'Home loan interest: Section 24(b) (up to ₹2L)',
        'First-time buyer: Additional ₹1.5L under 80EEA',
      ];
      base.portfolioAdjustments = ['Reduce equity exposure temporarily', 'Maintain minimum SIPs'];
      base.emergencyFundUpdate = 'Keep at least 3 months EMI as buffer';
      base.riskRecommendations = ['Don\'t over-leverage — EMI should be < 40% of income'];
      break;
  }

  return base;
}

// ─── Combined Net Worth ───
export function calculateNetWorth(data: CoupleData): number {
  return (
    data.partner1.existingInvestments +
    data.partner2.existingInvestments +
    data.currentEmergencyFund
  );
}

// ─── Format currency ───
export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
