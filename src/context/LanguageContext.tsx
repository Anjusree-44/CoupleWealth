import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'en' | 'hi';

const translations = {
  en: {
    // App
    appName: 'CoupleWealth',
    appTagline: 'AI-Powered Financial Planning for Indian Couples',
    
    // Nav
    dashboard: 'Dashboard',
    goals: 'Goals',
    lifeEvents: 'Life Events',
    taxOptimizer: 'Tax Optimizer',
    
    // Onboarding
    partner1Basics: 'Partner 1 Basics',
    partner1Finances: 'Partner 1 Finances',
    partner2Basics: 'Partner 2 Basics',
    partner2Finances: 'Partner 2 Finances',
    jointSetup: 'Joint Setup',
    name: 'Name',
    enterName: 'Enter name',
    age: 'Age',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    riskProfile: 'Risk Profile',
    conservative: 'Conservative',
    preferStability: 'Prefer stability',
    moderate: 'Moderate',
    balancedApproach: 'Balanced approach',
    aggressive: 'Aggressive',
    maximizeReturns: 'Maximize returns',
    taxRegime: 'Tax Regime',
    oldRegime: 'Old Regime',
    newRegime: 'New Regime',
    existingInvestments: 'Existing Investments',
    currentSIPs: 'Current SIPs (monthly)',
    section80C: 'Section 80C (annual)',
    section80D: 'Section 80D - Health Insurance',
    npsContribution: 'NPS Contribution (annual)',
    hraReceived: 'HRA Received (annual)',
    rentPaid: 'Rent Paid (annual)',
    homeLoanInterest: 'Home Loan Interest (annual)',
    lifeInsurance: 'Life Insurance',
    healthInsurance: 'Health Insurance',
    coverAmount: 'Cover Amount',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    next: 'Next',
    startPlanning: 'Start Planning',
    currentEmergencyFund: 'Current Emergency Fund',
    recommended: 'Recommended',
    monthsCombinedExpenses: '(6 months of combined expenses)',
    
    // Dashboard
    welcome: 'Welcome',
    jointOverview: 'Your joint financial overview',
    combinedNetWorth: 'Combined Net Worth',
    monthlySavings: 'Monthly Savings',
    activeSIPs: 'Active SIPs',
    taxSavings: 'Tax Savings',
    perMonth: '/mo',
    perYear: '/yr',
    moneyHealthScore: 'Money Health Score',
    incomeSplit: 'Income Split',
    monthlyPlan: 'Monthly Plan',
    expenses: 'Expenses',
    sips: 'SIPs',
    savings: 'Savings',
    improvementSuggestions: 'Improvement Suggestions',
    
    // Goals
    goalPlanner: 'Goal Planner',
    planTrackGoals: 'Plan and track your financial goals together',
    addGoal: 'Add Goal',
    goalName: 'Goal Name',
    type: 'Type',
    targetAmount: 'Target Amount',
    currentSavings: 'Current Savings',
    timeline: 'Timeline (years)',
    saveGoal: 'Save Goal',
    noGoalsYet: 'No goals yet',
    addFirstGoal: 'Add your first financial goal to get started',
    monthlySIP: 'Monthly SIP',
    expectedReturn: 'Expected Return',
    projectedValue: 'Projected Value',
    years: 'years',
    equity: 'Equity',
    debt: 'Debt',
    gold: 'Gold',
    
    // Life Events
    lifeEventCoach: 'Life Event Coach',
    aiPoweredAdvice: 'Get AI-powered advice for major life events',
    bonus: 'Bonus',
    marriage: 'Marriage',
    newBaby: 'New Baby',
    inheritance: 'Inheritance',
    jobChange: 'Job Change',
    homePurchase: 'Home Purchase',
    amountInvolved: 'Amount involved',
    recommendedAllocation: 'Recommended Allocation of',
    save: 'Save',
    invest: 'Invest',
    spend: 'Spend',
    taxStrategies: 'Tax Strategies',
    portfolio: 'Portfolio',
    emergencyFund: 'Emergency Fund',
    riskAdvisory: 'Risk Advisory',
    
    // Tax
    taxOptimizerTitle: 'Tax Optimizer',
    compareRegimes: 'Compare old vs new regime & maximize deductions',
    totalTaxSavings: 'Total Tax Savings Opportunity',
    oldVsNew: 'Old vs New Regime Comparison',
    annualIncome: 'Annual Income',
    oldRegimeTax: 'Old Regime Tax',
    newRegimeTax: 'New Regime Tax',
    deductionBreakdown: 'Deduction Breakdown',
    
    // Language
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',
  },
  hi: {
    // App
    appName: 'CoupleWealth',
    appTagline: 'भारतीय जोड़ों के लिए AI-संचालित वित्तीय योजना',
    
    // Nav
    dashboard: 'डैशबोर्ड',
    goals: 'लक्ष्य',
    lifeEvents: 'जीवन घटनाएँ',
    taxOptimizer: 'कर अनुकूलक',
    
    // Onboarding
    partner1Basics: 'साथी 1 मूल जानकारी',
    partner1Finances: 'साथी 1 वित्त',
    partner2Basics: 'साथी 2 मूल जानकारी',
    partner2Finances: 'साथी 2 वित्त',
    jointSetup: 'संयुक्त सेटअप',
    name: 'नाम',
    enterName: 'नाम दर्ज करें',
    age: 'उम्र',
    monthlyIncome: 'मासिक आय',
    monthlyExpenses: 'मासिक खर्च',
    riskProfile: 'जोखिम प्रोफ़ाइल',
    conservative: 'रूढ़िवादी',
    preferStability: 'स्थिरता पसंद',
    moderate: 'मध्यम',
    balancedApproach: 'संतुलित दृष्टिकोण',
    aggressive: 'आक्रामक',
    maximizeReturns: 'अधिकतम रिटर्न',
    taxRegime: 'कर व्यवस्था',
    oldRegime: 'पुरानी व्यवस्था',
    newRegime: 'नई व्यवस्था',
    existingInvestments: 'मौजूदा निवेश',
    currentSIPs: 'वर्तमान SIP (मासिक)',
    section80C: 'धारा 80C (वार्षिक)',
    section80D: 'धारा 80D - स्वास्थ्य बीमा',
    npsContribution: 'NPS योगदान (वार्षिक)',
    hraReceived: 'HRA प्राप्त (वार्षिक)',
    rentPaid: 'किराया भुगतान (वार्षिक)',
    homeLoanInterest: 'गृह ऋण ब्याज (वार्षिक)',
    lifeInsurance: 'जीवन बीमा',
    healthInsurance: 'स्वास्थ्य बीमा',
    coverAmount: 'कवर राशि',
    yes: 'हाँ',
    no: 'नहीं',
    back: 'पीछे',
    next: 'आगे',
    startPlanning: 'योजना शुरू करें',
    currentEmergencyFund: 'वर्तमान आपातकालीन निधि',
    recommended: 'अनुशंसित',
    monthsCombinedExpenses: '(संयुक्त खर्चों के 6 महीने)',
    
    // Dashboard
    welcome: 'स्वागत है',
    jointOverview: 'आपका संयुक्त वित्तीय अवलोकन',
    combinedNetWorth: 'संयुक्त कुल संपत्ति',
    monthlySavings: 'मासिक बचत',
    activeSIPs: 'सक्रिय SIP',
    taxSavings: 'कर बचत',
    perMonth: '/माह',
    perYear: '/वर्ष',
    moneyHealthScore: 'मनी हेल्थ स्कोर',
    incomeSplit: 'आय विभाजन',
    monthlyPlan: 'मासिक योजना',
    expenses: 'खर्चे',
    sips: 'SIP',
    savings: 'बचत',
    improvementSuggestions: 'सुधार सुझाव',
    
    // Goals
    goalPlanner: 'लक्ष्य योजनाकार',
    planTrackGoals: 'अपने वित्तीय लक्ष्यों की योजना बनाएं और ट्रैक करें',
    addGoal: 'लक्ष्य जोड़ें',
    goalName: 'लक्ष्य का नाम',
    type: 'प्रकार',
    targetAmount: 'लक्ष्य राशि',
    currentSavings: 'वर्तमान बचत',
    timeline: 'समय-सीमा (वर्ष)',
    saveGoal: 'लक्ष्य सहेजें',
    noGoalsYet: 'अभी कोई लक्ष्य नहीं',
    addFirstGoal: 'शुरू करने के लिए अपना पहला वित्तीय लक्ष्य जोड़ें',
    monthlySIP: 'मासिक SIP',
    expectedReturn: 'अपेक्षित रिटर्न',
    projectedValue: 'अनुमानित मूल्य',
    years: 'वर्ष',
    equity: 'इक्विटी',
    debt: 'डेट',
    gold: 'सोना',
    
    // Life Events
    lifeEventCoach: 'जीवन घटना कोच',
    aiPoweredAdvice: 'प्रमुख जीवन घटनाओं के लिए AI-संचालित सलाह प्राप्त करें',
    bonus: 'बोनस',
    marriage: 'विवाह',
    newBaby: 'नवजात',
    inheritance: 'विरासत',
    jobChange: 'नौकरी बदलाव',
    homePurchase: 'घर खरीदना',
    amountInvolved: 'शामिल राशि',
    recommendedAllocation: 'की अनुशंसित आवंटन',
    save: 'बचाएं',
    invest: 'निवेश',
    spend: 'खर्च',
    taxStrategies: 'कर रणनीतियाँ',
    portfolio: 'पोर्टफोलियो',
    emergencyFund: 'आपातकालीन निधि',
    riskAdvisory: 'जोखिम सलाह',
    
    // Tax
    taxOptimizerTitle: 'कर अनुकूलक',
    compareRegimes: 'पुरानी बनाम नई व्यवस्था की तुलना करें और कटौती अधिकतम करें',
    totalTaxSavings: 'कुल कर बचत अवसर',
    oldVsNew: 'पुरानी बनाम नई व्यवस्था तुलना',
    annualIncome: 'वार्षिक आय',
    oldRegimeTax: 'पुरानी व्यवस्था कर',
    newRegimeTax: 'नई व्यवस्था कर',
    deductionBreakdown: 'कटौती विवरण',
    
    // Language
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: TranslationKey) => translations[language][key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be within LanguageProvider');
  return ctx;
}
