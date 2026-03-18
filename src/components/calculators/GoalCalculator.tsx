import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { calculateGoal, formatCurrency } from '../../utils/calculations';
import { Download, Target, Info } from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';
import { motion } from 'motion/react';
import { ProposalModal } from '../modals/ProposalModal';
import { ProposalTemplate } from './ProposalTemplate';
import { Slider } from '../ui/Slider';
import { generateWhatsAppMessage } from '../../utils/whatsappFormatter';

export const GoalCalculator: React.FC = () => {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investorData, setInvestorData] = useState({ name: 'Investor', age: 35, whatsapp: '' });
  
  // Effective values for calculation
  const effectiveTarget = Math.max(100000, Math.min(100000000, targetAmount));
  const effectiveRate = Math.max(1, Math.min(30, rate));
  const effectiveYears = Math.max(1, Math.min(50, years));
  const effectiveInflation = Math.max(0, Math.min(20, inflation));

  // Calculate inflation adjusted target
  const adjustedTarget = effectiveTarget * Math.pow(1 + effectiveInflation / 100, effectiveYears);
  
  const [results, setResults] = useState(calculateGoal(adjustedTarget, effectiveRate, effectiveYears));

  useEffect(() => {
    setResults(calculateGoal(adjustedTarget, effectiveRate, effectiveYears));
  }, [adjustedTarget, effectiveRate, effectiveYears]);

  const handleTargetChange = (val: number) => {
    setTargetAmount(val);
  };

  const handleRateChange = (val: number) => {
    setRate(val);
  };

  const handleYearsChange = (val: number) => {
    setYears(val);
  };

  const handleInflationChange = (val: number) => {
    setInflation(val);
  };

  const handleDownload = (data: { name: string; age: number; whatsapp?: string }) => {
    setInvestorData({ name: data.name, age: data.age, whatsapp: data.whatsapp || '' });
    setIsModalOpen(false);
    
    // Generate PDF
    setTimeout(() => {
      generatePDF('goal-proposal-template', `Goal_Proposal_${data.name}`);
    }, 100);

    // Send WhatsApp message if number is provided (more than just the default '91' prefix)
    if (data.whatsapp && data.whatsapp.length > 2) {
      const message = generateWhatsAppMessage({
        investorName: data.name,
        investorAge: data.age,
        calculatorName: "Goal Calculator",
        inputs: [
          { label: 'Target Goal (Today)', value: formatCurrency(effectiveTarget) },
          { label: 'Time Period', value: `${effectiveYears} Years` },
          { label: 'Expected Return', value: `${effectiveRate}%` },
          { label: 'Inflation Rate', value: `${effectiveInflation}%` }
        ],
        results: [
          { label: 'Inflation Adjusted Goal', value: formatCurrency(adjustedTarget) },
          { label: 'Monthly SIP Required', value: formatCurrency(results.monthlyInvestment) },
          { label: 'Total Investment', value: formatCurrency(results.totalInvestment) },
          { label: 'Est. Returns', value: formatCurrency(results.estimatedReturns) }
        ]
      });
      const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const chartData = [
    { name: 'Invested Amount', value: results.totalInvestment },
    { name: 'Est. Returns', value: results.estimatedReturns },
  ];

  const COLORS = ['#2563eb', '#7c3aed'];

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="input-label">Target Goal (Today's Value)</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm">₹</span>
                <input 
                  type="number"
                  min="100000"
                  max="100000000"
                  value={targetAmount}
                  onChange={(e) => handleTargetChange(Number(e.target.value))}
                  className="w-32 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none"
                />
              </div>
            </div>
            <Slider 
              min={100000} 
              max={100000000} 
              step={100000}
              value={targetAmount}
              onChange={handleTargetChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    onChange={(e) => handleRateChange(Number(e.target.value))}
                    className="w-12 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none"
                  />
                  <span className="text-brand-blue font-bold">%</span>
                </div>
              </div>
              <Slider 
                min={1} 
                max={30} 
                step={0.5}
                value={rate}
                onChange={handleRateChange}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="input-label">Inflation Rate (p.a)</label>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    min="0"
                    max="20"
                    value={inflation}
                    step="0.5"
                    onChange={(e) => handleInflationChange(Number(e.target.value))}
                    className="w-12 text-right font-bold text-brand-purple bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-purple outline-none"
                  />
                  <span className="text-brand-purple font-bold">%</span>
                </div>
              </div>
              <Slider 
                min={0} 
                max={15} 
                step={0.5}
                value={inflation}
                onChange={handleInflationChange}
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
                  onChange={(e) => handleYearsChange(Number(e.target.value))}
                  className="w-12 text-right font-bold text-brand-blue border-b border-slate-200 focus:border-brand-blue outline-none"
                />
                <span className="text-brand-blue font-bold">Yr</span>
              </div>
            </div>
            <Slider 
              min={1} 
              max={50} 
              value={years}
              onChange={handleYearsChange}
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-blue mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              To maintain the same lifestyle in {effectiveYears} years, your target of {formatCurrency(effectiveTarget)} 
              will need to be <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(adjustedTarget)}</span> due to {effectiveInflation}% inflation.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-between"
          >
            <div>
              <p className="text-sm opacity-80 font-medium mb-1">Required Monthly SIP</p>
              <p className="text-3xl font-bold">{formatCurrency(results.monthlyInvestment)}</p>
            </div>
            <Target className="w-12 h-12 opacity-30" />
          </motion.div>

          <motion.div layout className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Total Invested</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatCurrency(results.totalInvestment)}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Est. Returns</p>
              <p className="text-lg font-bold text-brand-purple dark:text-purple-400">{formatCurrency(results.estimatedReturns)}</p>
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
        id="goal-proposal-template"
        calculatorName="Goal Planning"
        investorName={investorData.name}
        investorAge={investorData.age}
        investorWhatsapp={investorData.whatsapp}
        results={results}
        inputs={[
          { label: 'Target Goal (Today\'s Value)', value: formatCurrency(effectiveTarget) },
          { label: 'Inflation Rate', value: `${effectiveInflation}%` },
          { label: 'Inflation Adjusted Goal', value: formatCurrency(adjustedTarget) },
          { label: 'Investment Duration', value: `${effectiveYears} Years` },
          { label: 'Expected Annual Return', value: `${effectiveRate}%` },
          { label: 'Required Monthly SIP', value: formatCurrency(results.monthlyInvestment) },
        ]}
      />
    </div>
  );
};
