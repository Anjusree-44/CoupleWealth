import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import AppLayout from '@/components/AppLayout';
import { adviseLifeEvent, formatINR } from '@/utils/financial';
import type { LifeEventType, LifeEvent } from '@/types/finance';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Zap, Gift, Heart, Baby, Building, Briefcase, Home, PiggyBank, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const events: { type: LifeEventType; label: string; emoji: string; icon: React.ElementType }[] = [
  { type: 'bonus', label: 'Bonus', emoji: '💰', icon: Gift },
  { type: 'marriage', label: 'Marriage', emoji: '💍', icon: Heart },
  { type: 'baby', label: 'New Baby', emoji: '👶', icon: Baby },
  { type: 'inheritance', label: 'Inheritance', emoji: '🏦', icon: Building },
  { type: 'job_change', label: 'Job Change', emoji: '💼', icon: Briefcase },
  { type: 'home_purchase', label: 'Home Purchase', emoji: '🏠', icon: Home },
];

const ALLOC_COLORS = ['hsl(168,55%,32%)', 'hsl(42,85%,55%)', 'hsl(210,80%,52%)'];

export default function LifeEventsPage() {
  const { data } = useCouple();
  const [selected, setSelected] = useState<LifeEventType | null>(null);
  const [amount, setAmount] = useState(0);

  const event: LifeEvent | null = selected ? { type: selected, amount, description: '' } : null;
  const advice = event ? adviseLifeEvent(event, data) : null;

  const allocData = advice ? [
    { name: 'Save', value: advice.allocation.save },
    { name: 'Invest', value: advice.allocation.invest },
    { name: 'Spend', value: advice.allocation.spend },
  ] : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Life Event Coach ⚡</h1>
          <p className="text-sm text-muted-foreground">Get AI-powered advice for major life events</p>
        </div>

        {/* Event selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {events.map(e => (
            <button key={e.type} onClick={() => setSelected(e.type)}
              className={`rounded-xl border p-4 text-left transition-all ${
                selected === e.type ? 'border-primary bg-accent shadow-card' : 'border-border bg-card hover:border-primary/30'
              }`}>
              <div className="text-2xl mb-2">{e.emoji}</div>
              <div className="font-display text-sm font-semibold text-foreground">{e.label}</div>
            </button>
          ))}
        </div>

        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-2">
            <Label>Amount involved (₹)</Label>
            <Input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} placeholder="e.g., 500000" />
          </motion.div>
        )}

        {advice && amount > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Allocation */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" /> Recommended Allocation of {formatINR(amount)}
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
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
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

            {/* Tax Strategies */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" /> Tax Strategies
              </h3>
              <ul className="space-y-2">
                {advice.taxStrategies.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-secondary mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Portfolio + Emergency + Risk */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h4 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Portfolio
                </h4>
                <ul className="space-y-1.5">
                  {advice.portfolioAdjustments.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h4 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-success" /> Emergency Fund
                </h4>
                <p className="text-xs text-muted-foreground">{advice.emergencyFundUpdate}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h4 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" /> Risk Advisory
                </h4>
                <ul className="space-y-1.5">
                  {advice.riskRecommendations.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
