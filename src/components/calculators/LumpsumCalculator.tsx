import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { calculateLumpsum, formatCurrency } from '../../utils/calculations';
import { Download } from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';
import { motion } from 'motion/react';
import { ProposalModal } from '../modals/ProposalModal';
import { ProposalTemplate } from './ProposalTemplate';

export const LumpsumCalculator: React.FC = () => {
  const [investment, setInvestment] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [results, setResults] = useState(calculateLumpsum(100000, 12, 10));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investorData, setInvestorData] = useState({ name: 'Investor', age: 35 });

  // Effective values for calculation
  const effectiveInvestment = Math.max(5000, Math.min(10000000, investment));
  const effectiveRate = Math.max(1, Math.min(30, rate));
  const effectiveYears = Math.max(1, Math.min(50, years));

  useEffect(() => {
    setResults(calculateLumpsum(effectiveInvestment, effectiveRate, effectiveYears));
  }, [effectiveInvestment, effectiveRate, effectiveYears]);

  const handleInvestmentChange = (val: number) => {
    setInvestment(val);
  };

  const handleRateChange = (val: number) => {
    setRate(val);
  };

  const handleYearsChange = (val: number) => {
    setYears(val);
  };

  const handleDownload = (data: { name: string; age: number }) => {
    setInvestorData(data);
    setIsModalOpen(false);
    setTimeout(() => {
      generatePDF('lumpsum-proposal-template', `Lumpsum_Proposal_${data.name}`);
    }, 100);
  };

  const chartData = [
    { name: 'Invested Amount', value: results.totalInvestment },
    { name: 'Est. Returns', value: results.estimatedReturns },
  ];

  const COLORS = ['#2563eb', '#7c3aed'];

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-2xl">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="input-label">Total Investment</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">₹</span>
                <input 
                  type="number"
                  min="5000"
                  max="10000000"
                  value={investment}
                  onChange={(e) => handleInvestmentChange(Number(e.target.value))}
                  className="w-32 text-right font-bold text-brand-blue border-b border-slate-200 focus:border-brand-blue outline-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min="5000" 
              max="10000000" 
              step="5000"
              value={investment}
              onChange={(e) => handleInvestmentChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="input-label">Expected Return Rate (p.a)</label>
              <div className="flex items-center gap-1">
                <input 
                  type="number"
                  min="1"
                  max="30"
                  value={rate}
                  step="0.5"
                  onChange={(e) => handleRateChange(Number(e.target.value))}
                  className="w-12 text-right font-bold text-brand-blue border-b border-slate-200 focus:border-brand-blue outline-none"
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
              onChange={(e) => handleRateChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
            />
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
                  onChange={(e) => handleYearsChange(Number(e.target.value))}
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
              onChange={(e) => handleYearsChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
            />
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Invested</p>
              <p className="text-lg font-bold text-slate-800">{formatCurrency(results.totalInvestment)}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Returns</p>
              <p className="text-lg font-bold text-brand-purple">{formatCurrency(results.estimatedReturns)}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-blue-50 rounded-xl border border-blue-100"
            >
              <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Total Value</p>
              <p className="text-lg font-bold text-brand-blue">{formatCurrency(results.futureValue)}</p>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
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
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex items-center gap-2 btn-primary"
          >
            <Download className="w-5 h-5" />
            Download Proposal PDF
          </motion.button>
        </div>
      </div>

      <ProposalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleDownload} 
      />

      <ProposalTemplate 
        id="lumpsum-proposal-template"
        calculatorName="Lumpsum Investment"
        investorName={investorData.name}
        investorAge={investorData.age}
        results={results}
        inputs={[
          { label: 'One-time Investment', value: formatCurrency(effectiveInvestment) },
          { label: 'Investment Duration', value: `${effectiveYears} Years` },
          { label: 'Expected Annual Return', value: `${effectiveRate}%` },
        ]}
      />
    </div>
  );
};
