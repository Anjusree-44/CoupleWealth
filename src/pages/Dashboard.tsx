import { motion } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import { useLanguage } from '@/context/LanguageContext';
import AppLayout from '@/components/AppLayout';
import HealthScoreRing from '@/components/HealthScoreRing';
import { calculateNetWorth, calculateHealthScore, compareTax, formatINR } from '@/utils/financial';
import { TrendingUp, Wallet, Shield, PiggyBank, ArrowUpRight, AlertCircle, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const COLORS = ['hsl(168,55%,32%)', 'hsl(42,85%,55%)', 'hsl(210,80%,52%)', 'hsl(145,63%,42%)'];

export default function DashboardPage() {
  const { data } = useCouple();
  const { t } = useLanguage();
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
    { name: t('expenses'), amount: totalExpenses },
    { name: t('sips'), amount: totalSIPs },
    { name: t('savings'), amount: Math.max(0, savings - totalSIPs) },
  ];

  const statCards = [
    { icon: Wallet, label: t('combinedNetWorth'), value: formatINR(netWorth), color: 'text-primary', glow: 'shadow-glow' },
    { icon: TrendingUp, label: t('monthlySavings'), value: formatINR(savings), color: 'text-success', glow: '' },
    { icon: PiggyBank, label: t('activeSIPs'), value: formatINR(totalSIPs) + t('perMonth'), color: 'text-info', glow: '' },
    { icon: Shield, label: t('taxSavings'), value: formatINR(tax1.savings + tax2.savings) + t('perYear'), color: 'text-secondary', glow: 'shadow-gold' },
  ];

  return (
    <AppLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              {t('welcome')}, {data.partner1.name || 'Partner 1'} & {data.partner2.name || 'Partner 2'} 💑
              <Sparkles className="h-5 w-5 text-secondary animate-pulse-soft" />
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{t('jointOverview')}</p>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`glass-card rounded-2xl p-5 glass-card-hover ${s.glow}`}
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/60 ${s.color} mb-3`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className="font-display text-xl font-bold text-foreground mt-1">{s.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Health Score */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 flex flex-col items-center">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">{t('moneyHealthScore')}</h3>
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
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">{t('incomeSplit')}</h3>
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
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">{t('monthlyPlan')}</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tickFormatter={v => formatINR(v)} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
                <Tooltip formatter={(val: number) => formatINR(val)} />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                  {monthlyBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Suggestions */}
        {healthScore.suggestions.length > 0 && (
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" /> {t('improvementSuggestions')}
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
