import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import { useNavigate } from 'react-router-dom';
import type { PersonProfile, RiskProfile, TaxRegime } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, ArrowRight, ArrowLeft, User, Shield, TrendingUp } from 'lucide-react';

const steps = ['Partner 1 Basics', 'Partner 1 Finances', 'Partner 2 Basics', 'Partner 2 Finances', 'Joint Setup'];

function NumberInput({ label, value, onChange, prefix = '₹' }: { label: string; value: number; onChange: (v: number) => void; prefix?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>
        <Input
          type="number"
          value={value || ''}
          onChange={e => onChange(Number(e.target.value))}
          className="pl-8"
          placeholder="0"
        />
      </div>
    </div>
  );
}

function RiskSelect({ value, onChange }: { value: RiskProfile; onChange: (v: RiskProfile) => void }) {
  const options: { val: RiskProfile; label: string; desc: string; color: string }[] = [
    { val: 'low', label: 'Conservative', desc: 'Prefer stability', color: 'bg-success/10 text-success border-success/30' },
    { val: 'medium', label: 'Moderate', desc: 'Balanced approach', color: 'bg-warning/10 text-warning border-warning/30' },
    { val: 'high', label: 'Aggressive', desc: 'Maximize returns', color: 'bg-destructive/10 text-destructive border-destructive/30' },
  ];
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">Risk Profile</Label>
      <div className="grid grid-cols-3 gap-2">
        {options.map(o => (
          <button
            key={o.val}
            onClick={() => onChange(o.val)}
            className={`rounded-lg border p-3 text-center transition-all ${
              value === o.val ? o.color + ' border-2' : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="text-sm font-semibold">{o.label}</div>
            <div className="text-xs opacity-70">{o.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TaxRegimeSelect({ value, onChange }: { value: TaxRegime; onChange: (v: TaxRegime) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">Tax Regime</Label>
      <div className="grid grid-cols-2 gap-2">
        {(['old', 'new'] as TaxRegime[]).map(r => (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={`rounded-lg border p-3 text-center transition-all ${
              value === r ? 'border-primary bg-accent text-accent-foreground border-2' : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="text-sm font-semibold capitalize">{r} Regime</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { data, updatePartner1, updatePartner2, setData, setIsOnboarded } = useCouple();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const partner = step < 2 ? data.partner1 : step < 4 ? data.partner2 : null;
  const updatePartner = step < 2 ? updatePartner1 : updatePartner2;

  const next = () => { if (step < 4) setStep(step + 1); else finish(); };
  const back = () => { if (step > 0) setStep(step - 1); };

  const finish = () => {
    const exp = data.partner1.monthlyExpenses + data.partner2.monthlyExpenses;
    setData(prev => ({ ...prev, emergencyFundTarget: exp * 6 }));
    setIsOnboarded(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero mb-4">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">CoupleWealth</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered Financial Planning for Indian Couples</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'gradient-hero' : 'bg-muted'}`} />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            {step < 2 ? <User className="h-5 w-5 text-primary" /> : step < 4 ? <User className="h-5 w-5 text-secondary" /> : <Shield className="h-5 w-5 text-primary" />}
            <h2 className="font-display text-lg font-semibold text-foreground">{steps[step]}</h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {(step === 0 || step === 2) && partner && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">Name</Label>
                    <Input value={partner.name} onChange={e => updatePartner({ name: e.target.value })} placeholder="Enter name" />
                  </div>
                  <NumberInput label="Age" value={partner.age} onChange={v => updatePartner({ age: v })} prefix="" />
                  <NumberInput label="Monthly Income" value={partner.monthlyIncome} onChange={v => updatePartner({ monthlyIncome: v })} />
                  <NumberInput label="Monthly Expenses" value={partner.monthlyExpenses} onChange={v => updatePartner({ monthlyExpenses: v })} />
                  <RiskSelect value={partner.riskProfile} onChange={v => updatePartner({ riskProfile: v })} />
                  <TaxRegimeSelect value={partner.taxRegime} onChange={v => updatePartner({ taxRegime: v })} />
                </>
              )}

              {(step === 1 || step === 3) && partner && (
                <>
                  <NumberInput label="Existing Investments" value={partner.existingInvestments} onChange={v => updatePartner({ existingInvestments: v })} />
                  <NumberInput label="Current SIPs (monthly)" value={partner.existingSIPs} onChange={v => updatePartner({ existingSIPs: v })} />
                  <NumberInput label="Section 80C (annual)" value={partner.section80C} onChange={v => updatePartner({ section80C: v })} />
                  <NumberInput label="Section 80D - Health Insurance Premium" value={partner.section80D} onChange={v => updatePartner({ section80D: v })} />
                  <NumberInput label="NPS Contribution (annual)" value={partner.npsContribution} onChange={v => updatePartner({ npsContribution: v })} />
                  <NumberInput label="HRA Received (annual)" value={partner.hra} onChange={v => updatePartner({ hra: v })} />
                  <NumberInput label="Rent Paid (annual)" value={partner.rentPaid} onChange={v => updatePartner({ rentPaid: v })} />
                  <NumberInput label="Home Loan Interest (annual)" value={partner.homeLoanInterest} onChange={v => updatePartner({ homeLoanInterest: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">Life Insurance</Label>
                      <div className="flex gap-2">
                        {[true, false].map(v => (
                          <button
                            key={String(v)}
                            onClick={() => updatePartner({ hasLifeInsurance: v })}
                            className={`flex-1 rounded-lg border p-2 text-sm transition-all ${
                              partner.hasLifeInsurance === v ? 'border-primary bg-accent' : 'border-border'
                            }`}
                          >
                            {v ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <NumberInput label="Cover Amount" value={partner.lifeInsuranceCover} onChange={v => updatePartner({ lifeInsuranceCover: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">Health Insurance</Label>
                      <div className="flex gap-2">
                        {[true, false].map(v => (
                          <button
                            key={String(v)}
                            onClick={() => updatePartner({ hasHealthInsurance: v })}
                            className={`flex-1 rounded-lg border p-2 text-sm transition-all ${
                              partner.hasHealthInsurance === v ? 'border-primary bg-accent' : 'border-border'
                            }`}
                          >
                            {v ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <NumberInput label="Cover Amount" value={partner.healthInsuranceCover} onChange={v => updatePartner({ healthInsuranceCover: v })} />
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <NumberInput label="Current Emergency Fund" value={data.currentEmergencyFund} onChange={v => setData(prev => ({ ...prev, currentEmergencyFund: v }))} />
                  <div className="rounded-lg bg-accent/50 p-4">
                    <p className="text-sm text-accent-foreground">
                      <strong>Recommended:</strong> ₹{((data.partner1.monthlyExpenses + data.partner2.monthlyExpenses) * 6).toLocaleString('en-IN')} (6 months of combined expenses)
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={back} disabled={step === 0} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={next} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {step === 4 ? 'Start Planning' : 'Next'} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
