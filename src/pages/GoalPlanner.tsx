import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import AppLayout from '@/components/AppLayout';
import { planGoal, formatINR } from '@/utils/financial';
import type { FinancialGoal, GoalType } from '@/types/finance';
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
            <h1 className="font-display text-2xl font-bold text-foreground">Goal Planner 🎯</h1>
            <p className="text-sm text-muted-foreground">Plan and track your financial goals together</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" /> Add Goal
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Goal Name</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Dream House" />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(GOAL_EMOJIS) as GoalType[]).map(t => (
                    <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${form.type === t ? 'border-primary bg-accent' : 'border-border hover:border-primary/30'}`}>
                      {GOAL_EMOJIS[t]} {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Target Amount (₹)</Label>
                <Input type="number" value={form.targetAmount || ''} onChange={e => setForm(p => ({ ...p, targetAmount: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Current Savings (₹)</Label>
                <Input type="number" value={form.currentSavings || ''} onChange={e => setForm(p => ({ ...p, currentSavings: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Timeline (years)</Label>
                <Input type="number" value={form.timelineYears} onChange={e => setForm(p => ({ ...p, timelineYears: Number(e.target.value) }))} />
              </div>
            </div>
            <Button onClick={handleAdd} className="bg-primary text-primary-foreground">Save Goal</Button>
          </motion.div>
        )}

        {data.combinedGoals.length === 0 && !showForm && (
          <div className="text-center py-16 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-display text-lg">No goals yet</p>
            <p className="text-sm mt-1">Add your first financial goal to get started</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {data.combinedGoals.map((goal, i) => {
            const plan = planGoal(goal, avgRisk, avgAge);
            const allocData = [
              { name: 'Equity', value: plan.equityPercent },
              { name: 'Debt', value: plan.debtPercent },
              { name: 'Gold', value: plan.goldPercent },
            ];
            const Icon = GOAL_ICONS[goal.type];
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{goal.name}</h3>
                      <p className="text-xs text-muted-foreground">{goal.timelineYears} years • {formatINR(goal.targetAmount)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeGoal(goal.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly SIP</span>
                        <span className="font-semibold text-primary">{formatINR(plan.monthlySIP)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Return</span>
                        <span className="font-semibold text-foreground">{plan.expectedReturn.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Projected Value</span>
                        <span className="font-semibold text-success">{formatINR(plan.projectedValue)}</span>
                      </div>
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
