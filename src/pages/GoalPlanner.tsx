import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import { useLanguage } from '@/context/LanguageContext';
import AppLayout from '@/components/AppLayout';
import { planGoal, formatINR } from '@/utils/financial';
import type { GoalType } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Home, Plane, GraduationCap, Car, Heart, Plus, Trash2, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const GOAL_ICONS: Record<GoalType, React.ElementType> = {
  house: Home, retirement: TrendingUp, travel: Plane, education: GraduationCap, wedding: Heart, car: Car, other: Target,
};
const GOAL_EMOJIS: Record<GoalType, string> = {
  house: '🏠', retirement: '🧓', travel: '✈️', education: '🎓', wedding: '💍', car: '🚗', other: '🎯',
};
const COLORS = ['hsl(168,55%,32%)', 'hsl(42,85%,55%)', 'hsl(210,80%,52%)'];

export default function GoalPlannerPage() {
  const { data, addGoal, removeGoal } = useCouple();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'house' as GoalType, targetAmount: 0, currentSavings: 0, timelineYears: 5, priority: 'medium' as 'high' | 'medium' | 'low' });

  const avgAge = Math.round((data.partner1.age + data.partner2.age) / 2);
  const avgRisk = data.partner1.riskProfile === data.partner2.riskProfile ? data.partner1.riskProfile : 'medium';

  const handleAdd = () => {
    if (!form.name || form.targetAmount <= 0) return;
    addGoal({ ...form, id: crypto.randomUUID() });
    setForm({ name: '', type: 'house', targetAmount: 0, currentSavings: 0, timelineYears: 5, priority: 'medium' });
    setShowForm(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{t('goalPlanner')} 🎯</h1>
            <p className="text-sm text-muted-foreground">{t('planTrackGoals')}</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" /> {t('addGoal')}
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{t('goalName')}</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Dream House" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('type')}</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(GOAL_EMOJIS) as GoalType[]).map(tp => (
                    <button key={tp} onClick={() => setForm(p => ({ ...p, type: tp }))}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${form.type === tp ? 'border-primary bg-accent shadow-card' : 'border-border hover:border-primary/30'}`}>
                      {GOAL_EMOJIS[tp]} {tp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>{t('targetAmount')} (₹)</Label>
                <Input type="number" value={form.targetAmount || ''} onChange={e => setForm(p => ({ ...p, targetAmount: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('currentSavings')} (₹)</Label>
                <Input type="number" value={form.currentSavings || ''} onChange={e => setForm(p => ({ ...p, currentSavings: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('timeline')}</Label>
                <Input type="number" value={form.timelineYears} onChange={e => setForm(p => ({ ...p, timelineYears: Number(e.target.value) }))} />
              </div>
            </div>
            <Button onClick={handleAdd} className="bg-primary text-primary-foreground rounded-xl">{t('saveGoal')}</Button>
          </motion.div>
        )}

        {data.combinedGoals.length === 0 && !showForm && (
          <div className="text-center py-16 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-display text-lg">{t('noGoalsYet')}</p>
            <p className="text-sm mt-1">{t('addFirstGoal')}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {data.combinedGoals.map((goal, i) => {
            const plan = planGoal(goal, avgRisk, avgAge);
            const allocData = [
              { name: t('equity'), value: plan.equityPercent },
              { name: t('debt'), value: plan.debtPercent },
              { name: t('gold'), value: plan.goldPercent },
            ];
            const Icon = GOAL_ICONS[goal.type];
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className="glass-card rounded-2xl p-5 glass-card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/60 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{goal.name}</h3>
                      <p className="text-xs text-muted-foreground">{goal.timelineYears} {t('years')} • {formatINR(goal.targetAmount)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeGoal(goal.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('monthlySIP')}</span>
                      <span className="font-semibold text-primary">{formatINR(plan.monthlySIP)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('expectedReturn')}</span>
                      <span className="font-semibold text-foreground">{plan.expectedReturn.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('projectedValue')}</span>
                      <span className="font-semibold text-success">{formatINR(plan.projectedValue)}</span>
                    </div>
                  </div>
                  <div>
                    <ResponsiveContainer width="100%" height={100}>
                      <PieChart>
                        <Pie data={allocData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={3}>
                          {allocData.map((_, j) => <Cell key={j} fill={COLORS[j]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-3 text-[10px] text-muted-foreground">
                      {allocData.map((d, j) => (
                        <span key={j} className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[j] }} /> {d.name} {d.value}%
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
