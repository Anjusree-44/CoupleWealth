import { motion } from 'framer-motion';
import { useCouple } from '@/context/CoupleContext';
import AppLayout from '@/components/AppLayout';
import { compareTax, formatINR } from '@/utils/financial';
import { Receipt, CheckCircle, ArrowRight, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export default function TaxOptimizerPage() {
  const { data } = useCouple();
  const tax1 = compareTax(data.partner1);
  const tax2 = compareTax(data.partner2);

  const partners = [
    { name: data.partner1.name || 'Partner 1', tax: tax1, income: data.partner1.monthlyIncome * 12 },
    { name: data.partner2.name || 'Partner 2', tax: tax2, income: data.partner2.monthlyIncome * 12 },
  ];

  const comparisonData = partners.map(p => ({
    name: p.name,
    'Old Regime': p.tax.oldRegimeTax,
    'New Regime': p.tax.newRegimeTax,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Tax Optimizer 🧾</h1>
          <p className="text-sm text-muted-foreground">Compare old vs new regime & maximize deductions</p>
        </div>

        {/* Combined savings banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl gradient-hero p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="h-6 w-6" />
            <h2 className="font-display text-lg font-bold">Total Tax Savings Opportunity</h2>
          </div>
          <p className="text-3xl font-display font-bold">{formatINR(tax1.savings + tax2.savings)}<span className="text-base font-normal opacity-80"> /year</span></p>
        </motion.div>

        {/* Comparison chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Old vs New Regime Comparison</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => formatINR(v)} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(val: number) => formatINR(val)} />
              <Bar dataKey="Old Regime" fill="hsl(168,55%,32%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="New Regime" fill="hsl(42,85%,55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per partner details */}
        {partners.map((p, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
              <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-accent-foreground capitalize">
                  Recommended: {p.tax.recommended} regime
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Annual Income</p>
                <p className="font-display text-lg font-bold text-foreground mt-1">{formatINR(p.income)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Old Regime Tax</p>
                <p className="font-display text-lg font-bold text-foreground mt-1">{formatINR(p.tax.oldRegimeTax)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">New Regime Tax</p>
                <p className="font-display text-lg font-bold text-foreground mt-1">{formatINR(p.tax.newRegimeTax)}</p>
              </div>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold text-foreground mb-3">Deduction Breakdown</h4>
              <div className="space-y-2">
                {p.tax.deductions.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-foreground">{d.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({d.section})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{formatINR(d.amount)}</span>
                      <span className="text-xs text-muted-foreground">/ {formatINR(d.maxAllowed)}</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-hero"
                          style={{ width: `${Math.min(100, (d.amount / d.maxAllowed) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}
