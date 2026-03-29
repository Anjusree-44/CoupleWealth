import { motion } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import AppLayout from '@/components/AppLayout';
import HealthScoreRing from '@/components/HealthScoreRing';
import { calculateNetWorth, calculateHealthScore, compareTax, formatINR } from '@/utils/financial';
import { TrendingUp, Wallet, Shield, PiggyBank, ArrowUpRight, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const COLORS = ['hsl(168,55%,32%)', 'hsl(42,85%,55%)', 'hsl(210,80%,52%)', 'hsl(145,63%,42%)'];

export default function DashboardPage() {
  const { data } = useCouple();
  const netWorth = calculateNetWorth(data);
  const healthScore = calculateHealthScore(data);
  const tax1 = compareTax(data.partner1);
  const tax2 = compareTax(data.partner2);

  const totalIncome = data.partner1.monthlyIncome + data.partner2.monthlyIncome;
  const totalExpenses = data.partner1.monthlyExpenses + data.partner2.monthlyExpenses;
  const totalSIPs = data.partner1.existingSIPs + data.partner2.existingSIPs;
  const savings = totalIncome - totalExpenses;

  const incomeData = [
    { name: data.partner1.name || 'Partner 1', value: data.partner1.monthlyIncome },
    { name: data.partner2.name || 'Partner 2', value: data.partner2.monthlyIncome },
  ];

  const monthlyBreakdown = [
    { name: 'Expenses', amount: totalExpenses },
    { name: 'SIPs', amount: totalSIPs },
    { name: 'Savings', amount: Math.max(0, savings - totalSIPs) },
  ];

  const statCards = [
    { icon: Wallet, label: 'Combined Net Worth', value: formatINR(netWorth), color: 'text-primary' },
    { icon: TrendingUp, label: 'Monthly Savings', value: formatINR(savings), color: 'text-success' },
    { icon: PiggyBank, label: 'Active SIPs', value: formatINR(totalSIPs) + '/mo', color: 'text-info' },
    { icon: Shield, label: 'Tax Savings', value: formatINR(tax1.savings + tax2.savings) + '/yr', color: 'text-secondary' },
  ];

  return (
    <AppLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome, {data.partner1.name || 'Partner 1'} & {data.partner2.name || 'Partner 2'} 💑
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Your joint financial overview</p>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-display text-lg font-bold text-foreground mt-1">{s.value}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Health Score */}
          <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card p-6 shadow-card flex flex-col items-center">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Money Health Score</h3>
            <HealthScoreRing score={healthScore.total} />
            <div className="mt-4 w-full space-y-2">
              {Object.entries(healthScore.breakdown).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-semibold text-foreground">{val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Income Split */}
          <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Income Split</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={incomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {incomeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(val: number) => formatINR(val)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {incomeData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Breakdown */}
          <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Monthly Plan</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tickFormatter={v => formatINR(v)} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
                <Tooltip formatter={(val: number) => formatINR(val)} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {monthlyBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Suggestions */}
        {healthScore.suggestions.length > 0 && (
          <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" /> Improvement Suggestions
            </h3>
            <ul className="space-y-2">
              {healthScore.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
}
