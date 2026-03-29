import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import type { RiskProfile, TaxRegime } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LanguageToggle from '@/components/LanguageToggle';
import { Heart, ArrowRight, ArrowLeft, User, Shield, Sparkles } from 'lucide-react';

function NumberInput({ label, value, onChange, prefix = '₹' }: { label: string; value: number; onChange: (v: number) => void; prefix?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input
          type="number"
          value={value || ''}
          onChange={e => onChange(Number(e.target.value))}
          className={prefix ? 'pl-8' : ''}
          placeholder="0"
        />
      </div>
    </div>
  );
}

function RiskSelect({ value, onChange }: { value: RiskProfile; onChange: (v: RiskProfile) => void }) {
  const { t } = useLanguage();
  const options: { val: RiskProfile; label: string; desc: string; color: string }[] = [
    { val: 'low', label: t('conservative'), desc: t('preferStability'), color: 'bg-success/10 text-success border-success/30' },
    { val: 'medium', label: t('moderate'), desc: t('balancedApproach'), color: 'bg-warning/10 text-warning border-warning/30' },
    { val: 'high', label: t('aggressive'), desc: t('maximizeReturns'), color: 'bg-destructive/10 text-destructive border-destructive/30' },
  ];
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{t('riskProfile')}</Label>
      <div className="grid grid-cols-3 gap-2">
        {options.map(o => (
          <button
            key={o.val}
            onClick={() => onChange(o.val)}
            className={`rounded-xl border p-3 text-center transition-all ${
              value === o.val ? o.color + ' border-2 shadow-card' : 'border-border hover:border-primary/30 glass-card-hover'
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
  const { t } = useLanguage();
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{t('taxRegime')}</Label>
      <div className="grid grid-cols-2 gap-2">
        {(['old', 'new'] as TaxRegime[]).map(r => (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={`rounded-xl border p-3 text-center transition-all ${
              value === r ? 'border-primary bg-accent text-accent-foreground border-2 shadow-card' : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="text-sm font-semibold">{r === 'old' ? t('oldRegime') : t('newRegime')}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { data, updatePartner1, updatePartner2, setData, setIsOnboarded } = useCouple();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const stepLabels = [t('partner1Basics'), t('partner1Finances'), t('partner2Basics'), t('partner2Finances'), t('jointSetup')];
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
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
      {/* Decorative orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-0 -left-48 w-80 h-80 rounded-full bg-secondary/5 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero shadow-glow mb-4">
            <Heart className="h-8 w-8 text-primary-foreground" />
            <Sparkles className="absolute -top-1.5 -right-1.5 h-4 w-4 text-secondary animate-pulse-soft" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t('appName')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('appTagline')}</p>
          <div className="mt-3 flex justify-center">
            <LanguageToggle />
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {stepLabels.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'gradient-hero shadow-glow' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            {step < 2 ? <User className="h-5 w-5 text-primary" /> : step < 4 ? <User className="h-5 w-5 text-secondary" /> : <Shield className="h-5 w-5 text-primary" />}
            <h2 className="font-display text-lg font-semibold text-foreground">{stepLabels[step]}</h2>
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
                    <Label className="text-sm font-medium text-foreground">{t('name')}</Label>
                    <Input value={partner.name} onChange={e => updatePartner({ name: e.target.value })} placeholder={t('enterName')} />
                  </div>
                  <NumberInput label={t('age')} value={partner.age} onChange={v => updatePartner({ age: v })} prefix="" />
                  <NumberInput label={t('monthlyIncome')} value={partner.monthlyIncome} onChange={v => updatePartner({ monthlyIncome: v })} />
                  <NumberInput label={t('monthlyExpenses')} value={partner.monthlyExpenses} onChange={v => updatePartner({ monthlyExpenses: v })} />
                  <RiskSelect value={partner.riskProfile} onChange={v => updatePartner({ riskProfile: v })} />
                  <TaxRegimeSelect value={partner.taxRegime} onChange={v => updatePartner({ taxRegime: v })} />
                </>
              )}

              {(step === 1 || step === 3) && partner && (
                <>
                  <NumberInput label={t('existingInvestments')} value={partner.existingInvestments} onChange={v => updatePartner({ existingInvestments: v })} />
                  <NumberInput label={t('currentSIPs')} value={partner.existingSIPs} onChange={v => updatePartner({ existingSIPs: v })} />
                  <NumberInput label={t('section80C')} value={partner.section80C} onChange={v => updatePartner({ section80C: v })} />
                  <NumberInput label={t('section80D')} value={partner.section80D} onChange={v => updatePartner({ section80D: v })} />
                  <NumberInput label={t('npsContribution')} value={partner.npsContribution} onChange={v => updatePartner({ npsContribution: v })} />
                  <NumberInput label={t('hraReceived')} value={partner.hra} onChange={v => updatePartner({ hra: v })} />
                  <NumberInput label={t('rentPaid')} value={partner.rentPaid} onChange={v => updatePartner({ rentPaid: v })} />
                  <NumberInput label={t('homeLoanInterest')} value={partner.homeLoanInterest} onChange={v => updatePartner({ homeLoanInterest: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">{t('lifeInsurance')}</Label>
                      <div className="flex gap-2">
                        {[true, false].map(v => (
                          <button
                            key={String(v)}
                            onClick={() => updatePartner({ hasLifeInsurance: v })}
                            className={`flex-1 rounded-xl border p-2 text-sm transition-all ${
                              partner.hasLifeInsurance === v ? 'border-primary bg-accent shadow-card' : 'border-border'
                            }`}
                          >
                            {v ? t('yes') : t('no')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <NumberInput label={t('coverAmount')} value={partner.lifeInsuranceCover} onChange={v => updatePartner({ lifeInsuranceCover: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">{t('healthInsurance')}</Label>
                      <div className="flex gap-2">
                        {[true, false].map(v => (
                          <button
                            key={String(v)}
                            onClick={() => updatePartner({ hasHealthInsurance: v })}
                            className={`flex-1 rounded-xl border p-2 text-sm transition-all ${
                              partner.hasHealthInsurance === v ? 'border-primary bg-accent shadow-card' : 'border-border'
                            }`}
                          >
                            {v ? t('yes') : t('no')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <NumberInput label={t('coverAmount')} value={partner.healthInsuranceCover} onChange={v => updatePartner({ healthInsuranceCover: v })} />
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <NumberInput label={t('currentEmergencyFund')} value={data.currentEmergencyFund} onChange={v => setData(prev => ({ ...prev, currentEmergencyFund: v }))} />
                  <div className="rounded-xl glass-card p-4">
                    <p className="text-sm text-accent-foreground">
                      <strong>{t('recommended')}:</strong> ₹{((data.partner1.monthlyExpenses + data.partner2.monthlyExpenses) * 6).toLocaleString('en-IN')} {t('monthsCombinedExpenses')}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={back} disabled={step === 0} className="gap-2 rounded-xl">
              <ArrowLeft className="h-4 w-4" /> {t('back')}
            </Button>
            <Button onClick={next} className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
              {step === 4 ? t('startPlanning') : t('next')} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
