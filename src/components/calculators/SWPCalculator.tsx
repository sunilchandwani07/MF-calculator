import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { calculateSWP, calculateMaxSWP, formatCurrency } from '../../utils/calculations';
import { Download, Info, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';
import { motion } from 'motion/react';
import { ProposalModal } from '../modals/ProposalModal';
import { ProposalTemplate } from './ProposalTemplate';

export const SWPCalculator: React.FC = () => {
  const [lumpsum, setLumpsum] = useState(1000000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [results, setResults] = useState(calculateSWP(1000000, 10000, 12, 10, 6));
  const [stressResults, setStressResults] = useState(calculateSWP(1000000, 10000, 12, 10, 6, true));
  const [maxWithdrawal, setMaxWithdrawal] = useState(calculateMaxSWP(1000000, 12, 10, 6));
  const [stressMaxWithdrawal, setStressMaxWithdrawal] = useState(calculateMaxSWP(1000000, 12, 10, 6, true));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investorData, setInvestorData] = useState({ name: 'Investor', age: 35, whatsapp: '' });

  // Effective values for calculation
  const effectiveLumpsum = Math.max(10000, Math.min(100000000, lumpsum));
  const effectiveWithdrawal = Math.max(500, Math.min(effectiveLumpsum / 2, withdrawal));
  const effectiveRate = Math.max(1, Math.min(30, rate));
  const effectiveYears = Math.max(1, Math.min(50, years));
  const effectiveInflation = Math.max(0, Math.min(20, inflation));

  useEffect(() => {
    setResults(calculateSWP(effectiveLumpsum, effectiveWithdrawal, effectiveRate, effectiveYears, effectiveInflation));
    setStressResults(calculateSWP(effectiveLumpsum, effectiveWithdrawal, effectiveRate, effectiveYears, effectiveInflation, true));
    setMaxWithdrawal(calculateMaxSWP(effectiveLumpsum, effectiveRate, effectiveYears, effectiveInflation));
    setStressMaxWithdrawal(calculateMaxSWP(effectiveLumpsum, effectiveRate, effectiveYears, effectiveInflation, true));
  }, [effectiveLumpsum, effectiveWithdrawal, effectiveRate, effectiveYears, effectiveInflation]);

  const handleDownload = (data: { name: string; age: number; whatsapp?: string }) => {
    setInvestorData({ name: data.name, age: data.age, whatsapp: data.whatsapp || '' });
    setIsModalOpen(false);
    
    // Generate PDF
    setTimeout(() => {
      generatePDF('swp-proposal-template', `SWP_Proposal_${data.name}`);
    }, 100);

    // Send WhatsApp message if number is provided
    if (data.whatsapp) {
      const message = encodeURIComponent(`Hi from Invest & Insure! I've generated your SWP (Retirement) proposal. Please find it attached.`);
      const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const chartData = [
    { name: 'Normal Final Balance', value: results.finalBalance },
    { name: 'Stress Final Balance', value: stressResults.finalBalance },
  ];

  const COLORS = ['#2563eb', '#ef4444'];

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="input-label">Total Lumpsum Investment</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm">₹</span>
                <input 
                  type="number"
                  min="10000"
                  max="100000000"
                  value={lumpsum}
                  onChange={(e) => setLumpsum(Number(e.target.value))}
                  className="w-32 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="10000000" 
              step="10000"
              value={lumpsum}
              onChange={(e) => setLumpsum(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="input-label">Initial Monthly Withdrawal</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm">₹</span>
                <input 
                  type="number"
                  min="500"
                  max={lumpsum / 2}
                  value={withdrawal}
                  onChange={(e) => setWithdrawal(Number(e.target.value))}
                  className="w-24 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min="500" 
              max={Math.min(lumpsum / 12, 100000)} 
              step="500"
              value={withdrawal}
              onChange={(e) => setWithdrawal(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="input-label">Expected Return (p.a)</label>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    min="1"
                    max="30"
                    value={rate}
                    step="0.5"
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-12 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none"
                  />
                  <span className="text-brand-blue font-bold">%</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="input-label">Annual Inflation (%)</label>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    min="0"
                    max="20"
                    value={inflation}
                    step="0.5"
                    onChange={(e) => setInflation(Number(e.target.value))}
                    className="w-12 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none"
                  />
                  <span className="text-brand-blue font-bold">%</span>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.5"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="input-label">Time Period (Years)</label>
              <div className="flex items-center gap-1">
                <input 
                  type="number"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-12 text-right font-bold text-brand-blue border-b border-slate-200 focus:border-brand-blue outline-none"
                />
                <span className="text-brand-blue font-bold">Yr</span>
              </div>
            </div>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
            />
          </div>

          <motion.div layout className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-blue" />
              Scenario Comparison
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold mb-1">Normal Scenario</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Final Balance</p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{formatCurrency(results.finalBalance)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total Withdrawn: {formatCurrency(results.totalWithdrawn)}</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30"
              >
                <p className="text-xs text-red-600 dark:text-red-400 uppercase font-bold mb-1">Stress Scenario</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Final Balance</p>
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">{formatCurrency(stressResults.finalBalance)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total Withdrawn: {formatCurrency(stressResults.totalWithdrawn)}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[300px] border-l border-slate-50 pl-8">
          <div className="w-full mb-6">
            <p className="text-center text-xs text-slate-500 font-semibold mb-4 uppercase tracking-widest">Final Balance Comparison</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full space-y-4">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold uppercase tracking-wider">Max Withdrawal Suggestions</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase text-center">Normal Market</p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Safety (90% Cap)</p>
                  <p className="text-md font-bold text-slate-700 dark:text-slate-200">{formatCurrency(maxWithdrawal.maxWithdrawalCase1)}<span className="text-[10px] font-normal ml-1">/mo</span></p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Zero Balance</p>
                  <p className="text-md font-bold text-slate-700 dark:text-slate-200">{formatCurrency(maxWithdrawal.maxWithdrawalCase2)}<span className="text-[10px] font-normal ml-1">/mo</span></p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase text-center">Stress Scenario</p>
                <div className="p-3 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                  <p className="text-[10px] text-red-600 dark:text-red-400 uppercase font-bold">Safety (90% Cap)</p>
                  <p className="text-md font-bold text-red-700 dark:text-red-400">{formatCurrency(stressMaxWithdrawal.maxWithdrawalCase1)}<span className="text-[10px] font-normal ml-1">/mo</span></p>
                </div>
                <div className="p-3 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                  <p className="text-[10px] text-red-600 dark:text-red-400 uppercase font-bold">Zero Balance</p>
                  <p className="text-md font-bold text-red-700 dark:text-red-400">{formatCurrency(stressMaxWithdrawal.maxWithdrawalCase2)}<span className="text-[10px] font-normal ml-1">/mo</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex items-center gap-2 btn-primary w-full justify-center"
          >
            <Download className="w-5 h-5" />
            Download Comparative Proposal
          </motion.button>
        </div>
      </div>

      <ProposalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleDownload} 
      />

      <ProposalTemplate 
        id="swp-proposal-template"
        calculatorName="Systematic Withdrawal Plan (Comparative)"
        investorName={investorData.name}
        investorAge={investorData.age}
        investorWhatsapp={investorData.whatsapp}
        results={{
          futureValue: results.finalBalance,
          totalInvestment: effectiveLumpsum,
          estimatedReturns: results.estimatedReturns,
          totalWithdrawn: results.totalWithdrawn,
          stressFinalBalance: stressResults.finalBalance,
          stressTotalWithdrawn: stressResults.totalWithdrawn
        }}
        inputs={[
          { label: 'Lumpsum Investment', value: formatCurrency(effectiveLumpsum) },
          { label: 'Initial Monthly Withdrawal', value: formatCurrency(effectiveWithdrawal) },
          { label: 'Investment Duration', value: `${effectiveYears} Years` },
          { label: 'Expected Return (Normal)', value: `${effectiveRate}%` },
          { label: 'Expected Return (Stress)', value: `${effectiveRate}% (Bull) / -10% Correction` },
          { label: 'Initial Stress (SPAN)', value: '65% Correction / 35% Growth (First 3 Months)' },
          { label: 'Annual Inflation', value: `${effectiveInflation}%` },
          { label: 'Max Withdrawal (Normal - Safety)', value: formatCurrency(maxWithdrawal.maxWithdrawalCase1) },
          { label: 'Max Withdrawal (Stress - Safety)', value: formatCurrency(stressMaxWithdrawal.maxWithdrawalCase1) },
        ]}
      />
    </div>
  );
};
