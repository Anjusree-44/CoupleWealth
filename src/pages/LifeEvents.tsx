import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import { useLanguage } from '@/context/LanguageContext';
import AppLayout from '@/components/AppLayout';
import { adviseLifeEvent, formatINR } from '@/utils/financial';
import type { LifeEventType, LifeEvent } from '@/types/finance';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Heart, Baby, Building, Briefcase, Home, PiggyBank, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ALLOC_COLORS = ['hsl(168,55%,32%)', 'hsl(42,85%,55%)', 'hsl(210,80%,52%)'];

export default function LifeEventsPage() {
  const { data } = useCouple();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<LifeEventType | null>(null);
  const [amount, setAmount] = useState(0);

  const events: { type: LifeEventType; label: string; emoji: string; icon: React.ElementType }[] = [
    { type: 'bonus', label: t('bonus'), emoji: '💰', icon: Gift },
    { type: 'marriage', label: t('marriage'), emoji: '💍', icon: Heart },
    { type: 'baby', label: t('newBaby'), emoji: '👶', icon: Baby },
    { type: 'inheritance', label: t('inheritance'), emoji: '🏦', icon: Building },
    { type: 'job_change', label: t('jobChange'), emoji: '💼', icon: Briefcase },
    { type: 'home_purchase', label: t('homePurchase'), emoji: '🏠', icon: Home },
  ];

  const event: LifeEvent | null = selected ? { type: selected, amount, description: '' } : null;
  const advice = event ? adviseLifeEvent(event, data) : null;

  const allocData = advice ? [
    { name: t('save'), value: advice.allocation.save },
    { name: t('invest'), value: advice.allocation.invest },
    { name: t('spend'), value: advice.allocation.spend },
  ] : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t('lifeEventCoach')} ⚡</h1>
          <p className="text-sm text-muted-foreground">{t('aiPoweredAdvice')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {events.map(e => (
            <motion.button
              key={e.type}
              onClick={() => setSelected(e.type)}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`glass-card rounded-2xl p-5 text-left transition-all glass-card-hover ${
                selected === e.type ? 'border-primary/50 shadow-glow' : ''
              }`}
            >
              <div className="text-3xl mb-3">{e.emoji}</div>
              <div className="font-display text-sm font-semibold text-foreground">{e.label}</div>
            </motion.button>
          ))}
        </div>

        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-2">
            <Label>{t('amountInvolved')} (₹)</Label>
            <Input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} placeholder="e.g., 500000" />
          </motion.div>
        )}

        {advice && amount > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" /> {t('recommendedAllocation')} {formatINR(amount)}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={allocData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                      {allocData.map((_, i) => <Cell key={i} fill={ALLOC_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {allocData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-accent/30 p-3">
                      <span className="flex items-center gap-2 text-sm">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: ALLOC_COLORS[i] }} />
                        {d.name}
                      </span>
                      <div className="text-right">
                        <span className="font-semibold text-foreground">{d.value}%</span>
                        <span className="text-xs text-muted-foreground ml-2">({formatINR(amount * d.value / 100)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" /> {t('taxStrategies')}
              </h3>
              <ul className="space-y-2">
                {advice.taxStrategies.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-secondary mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -2 }} className="glass-card rounded-2xl p-5 glass-card-hover">
                <h4 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> {t('portfolio')}
                </h4>
                <ul className="space-y-1.5">
                  {advice.portfolioAdjustments.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}
                </ul>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="glass-card rounded-2xl p-5 glass-card-hover">
                <h4 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-success" /> {t('emergencyFund')}
                </h4>
                <p className="text-xs text-muted-foreground">{advice.emergencyFundUpdate}</p>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="glass-card rounded-2xl p-5 glass-card-hover">
                <h4 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" /> {t('riskAdvisory')}
                </h4>
                <ul className="space-y-1.5">
                  {advice.riskRecommendations.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
