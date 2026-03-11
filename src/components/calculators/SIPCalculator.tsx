import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { calculateSIP, calculateStepUpSIP, calculateCostOfDelay, calculateHomeLoanSetOff, formatCurrency } from '../../utils/calculations';
import { Download, Clock, Home, TrendingUp } from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';
import { motion, AnimatePresence } from 'motion/react';
import { ProposalModal } from '../modals/ProposalModal';
import { ProposalTemplate } from './ProposalTemplate';

export const SIPCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'standard' | 'stepup' | 'homeloan'>('standard');
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(10);
  const [stepUpType, setStepUpType] = useState<'percentage' | 'fixed'>('percentage');
  
  // Home Loan inputs
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [loanInterestType, setLoanInterestType] = useState<'reducing' | 'fixed'>('reducing');

  const [results, setResults] = useState(calculateSIP(5000, 12, 10));
  const [delayResults, setDelayResults] = useState({
    delay6: calculateCostOfDelay(5000, 12, 10, 6),
    delay12: calculateCostOfDelay(5000, 12, 10, 12)
  });
  const [homeLoanResults, setHomeLoanResults] = useState(calculateHomeLoanSetOff(5000000, 8.5, 20, 12));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investorData, setInvestorData] = useState({ name: 'Investor', age: 35, whatsapp: '' });

  // Effective values for calculation
  const effectiveMonthly = Math.max(500, Math.min(1000000, monthlyInvestment));
  const effectiveRate = Math.max(1, Math.min(30, rate));
  const effectiveYears = Math.max(1, Math.min(50, years));
  const effectiveStepUp = stepUpType === 'percentage' 
    ? Math.max(0, Math.min(100, stepUp))
    : Math.max(0, Math.min(100000, stepUp));

  useEffect(() => {
    if (activeTab === 'stepup') {
      setResults(calculateStepUpSIP(effectiveMonthly, effectiveRate, effectiveYears, effectiveStepUp, stepUpType));
    } else {
      setResults(calculateSIP(effectiveMonthly, effectiveRate, effectiveYears));
    }
    
    setDelayResults({
      delay6: calculateCostOfDelay(effectiveMonthly, effectiveRate, effectiveYears, 6),
      delay12: calculateCostOfDelay(effectiveMonthly, effectiveRate, effectiveYears, 12)
    });
  }, [effectiveMonthly, effectiveRate, effectiveYears, effectiveStepUp, stepUpType, activeTab]);

  useEffect(() => {
    setHomeLoanResults(calculateHomeLoanSetOff(loanAmount, loanRate, loanTenure, effectiveRate, loanInterestType));
  }, [loanAmount, loanRate, loanTenure, effectiveRate, loanInterestType]);

  const handleDownload = (data: { name: string; age: number; whatsapp?: string }) => {
    setInvestorData({ name: data.name, age: data.age, whatsapp: data.whatsapp || '' });
    setIsModalOpen(false);
    
    // Generate PDF
    setTimeout(() => {
      generatePDF('sip-proposal-template', `SIP_Proposal_${data.name}`);
    }, 100);

    // Send WhatsApp message if number is provided
    if (data.whatsapp) {
      const message = encodeURIComponent(`Hi from Invest & Insure! I've generated your ${activeTab === 'homeloan' ? 'Home Loan Set-off' : 'SIP'} proposal. Please find it attached.`);
      const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${message}`;
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
      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {(['standard', 'stepup', 'homeloan'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">
              {tab === 'standard' ? 'Standard SIP' : tab === 'stepup' ? 'Step-up SIP' : 'Home Loan Set-off'}
            </span>
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'homeloan' ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                      <label className="input-label">Interest Calculation Type</label>
                      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                        {(['reducing', 'fixed'] as const).map((type) => (
                          <button 
                            key={type}
                            onClick={() => setLoanInterestType(type)}
                            className={`relative px-3 py-1 rounded-md text-xs font-bold transition-all ${loanInterestType === type ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-400'}`}
                          >
                            {loanInterestType === type && (
                              <motion.div 
                                layoutId="loanInterestType"
                                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <span className="relative z-10">
                              {type === 'reducing' ? 'Reducing Balance' : 'Fixed Rate'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="input-label">Loan Amount</label>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">₹</span>
                        <input 
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-32 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <input 
                      type="range" min="100000" max="20000000" step="100000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="input-label">Loan Interest Rate (p.a)</label>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" value={loanRate} step="0.1"
                          onChange={(e) => setLoanRate(Number(e.target.value))}
                          className="w-16 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none transition-colors"
                        />
                        <span className="text-brand-blue font-bold">%</span>
                      </div>
                    </div>
                    <input 
                      type="range" min="5" max="15" step="0.1"
                      value={loanRate}
                      onChange={(e) => setLoanRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="input-label">Loan Tenure (Years)</label>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" value={loanTenure}
                          onChange={(e) => setLoanTenure(Number(e.target.value))}
                          className="w-12 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none transition-colors"
                        />
                        <span className="text-brand-blue font-bold">Yr</span>
                      </div>
                    </div>
                    <input 
                      type="range" min="1" max="30"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="input-label">Monthly Investment</label>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">₹</span>
                        <input 
                          type="number"
                          min="500"
                          max="1000000"
                          value={monthlyInvestment}
                          onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                          className="w-24 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="500" 
                      max="100000" 
                      step="500"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                  </div>

                  {activeTab === 'stepup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                        <label className="input-label">Annual Step-up</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                          {(['percentage', 'fixed'] as const).map((type) => (
                            <button 
                              key={type}
                              onClick={() => {
                                setStepUpType(type);
                                if (type === 'percentage' && stepUp > 100) setStepUp(10);
                                if (type === 'fixed' && stepUp <= 100) setStepUp(1000);
                              }}
                              className={`relative px-3 py-1 rounded-md text-xs font-bold transition-all ${stepUpType === type ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-400'}`}
                            >
                              {stepUpType === type && (
                                <motion.div 
                                  layoutId="stepUpType"
                                  className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm"
                                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                              <span className="relative z-10">
                                {type === 'percentage' ? 'Percentage (%)' : 'Fixed (₹)'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Amount to increase every year</span>
                        <div className="flex items-center gap-1">
                          {stepUpType === 'fixed' && <span className="text-brand-blue font-bold">₹</span>}
                          <input 
                            type="number"
                            min="0"
                            max={stepUpType === 'percentage' ? 100 : 1000000}
                            value={stepUp}
                            onChange={(e) => setStepUp(Number(e.target.value))}
                            className="w-20 text-right font-bold text-brand-blue bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-brand-blue outline-none transition-colors"
                          />
                          {stepUpType === 'percentage' && <span className="text-brand-blue font-bold">%</span>}
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max={stepUpType === 'percentage' ? 50 : 50000} 
                        step={stepUpType === 'percentage' ? 1 : 500}
                        value={stepUp}
                        onChange={(e) => setStepUp(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                      />
                    </motion.div>
                  )}

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
                          onChange={(e) => setRate(Number(e.target.value))}
                          className="w-12 text-right font-bold text-brand-blue border-b border-slate-200 focus:border-brand-blue outline-none transition-colors"
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
                          onChange={(e) => setYears(Number(e.target.value))}
                          className="w-12 text-right font-bold text-brand-blue border-b border-slate-200 focus:border-brand-blue outline-none transition-colors"
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
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div layout className="pt-6">
            {activeTab !== 'homeloan' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Invested</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatCurrency(results.totalInvestment)}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Returns</p>
                  <p className="text-lg font-bold text-brand-purple dark:text-purple-400">{formatCurrency(results.estimatedReturns)}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30"
                >
                  <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold mb-1">Total Value</p>
                  <p className="text-lg font-bold text-brand-blue dark:text-blue-400">{formatCurrency(results.futureValue)}</p>
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Monthly EMI</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(homeLoanResults.emi)}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-red-50 rounded-xl border border-red-100"
                >
                  <p className="text-xs text-red-600 uppercase font-semibold mb-1">Total Interest Payable</p>
                  <p className="text-lg font-bold text-red-700">{formatCurrency(homeLoanResults.totalInterest)}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30 sm:col-span-2"
                >
                  <p className="text-xs text-green-600 dark:text-green-400 uppercase font-semibold mb-1">Required Monthly SIP</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(homeLoanResults.sipRequired)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">To recover interest in {loanTenure} years @ {rate}%</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[300px] border-l border-slate-50 pl-8">
          <AnimatePresence mode="wait">
            {activeTab !== 'homeloan' ? (
              <motion.div 
                key="sip-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center"
              >
                <ResponsiveContainer width="100%" height={250}>
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
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Cost of Delay</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
                      <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold">6 Months Delay</p>
                      <p className="text-sm font-bold text-orange-700 dark:text-orange-400">{formatCurrency(delayResults.delay6.cost)}</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                      <p className="text-xs text-red-600 dark:text-red-400 uppercase font-bold">12 Months Delay</p>
                      <p className="text-sm font-bold text-red-700 dark:text-red-400">{formatCurrency(delayResults.delay12.cost)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="homeloan-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-6"
              >
                <motion.div 
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <Home className="w-10 h-10 text-brand-blue" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Interest Recovery Strategy</h3>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                    By starting a SIP of <span className="font-bold text-brand-blue">{formatCurrency(homeLoanResults.sipRequired)}</span> alongside your home loan, you can effectively recover the entire interest amount of <span className="font-bold text-brand-blue">{formatCurrency(homeLoanResults.totalInterest)}</span> over the same tenure.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 inline-block">
                  <div className="flex items-center gap-2 justify-center text-brand-purple mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Smart Investing</span>
                  </div>
                  <p className="text-sm text-slate-600">Total Loan Payment: <span className="font-bold">{formatCurrency(homeLoanResults.totalPayment)}</span></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex items-center gap-2 btn-primary w-full justify-center"
          >
            <Download className="w-5 h-5" />
            Download Proposal PDF
          </motion.button>
        </div>
      </motion.div>

      <ProposalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleDownload} 
      />

      <ProposalTemplate 
        id="sip-proposal-template"
        calculatorName={activeTab === 'homeloan' ? 'Home Loan Set-off Strategy' : activeTab === 'stepup' ? 'Step-up SIP Plan' : 'Systematic Investment Plan'}
        investorName={investorData.name}
        investorAge={investorData.age}
        investorWhatsapp={investorData.whatsapp}
        results={activeTab === 'homeloan' ? {
          futureValue: (homeLoanResults.sipRequired * loanTenure * 12) + homeLoanResults.totalInterest,
          totalInvestment: homeLoanResults.sipRequired * loanTenure * 12,
          estimatedReturns: homeLoanResults.totalInterest
        } : results}
        inputs={activeTab === 'homeloan' ? [
          { label: 'Loan Amount', value: formatCurrency(loanAmount) },
          { label: 'Loan Tenure', value: `${loanTenure} Years` },
          { label: 'Interest Type', value: loanInterestType === 'reducing' ? 'Reducing Balance' : 'Fixed Rate' },
          { label: 'Loan Interest Rate', value: `${loanRate}%` },
          { label: 'Monthly EMI', value: formatCurrency(homeLoanResults.emi) },
          { label: 'Recovery SIP Rate', value: `${effectiveRate}%` },
          { label: 'Required Monthly SIP', value: formatCurrency(homeLoanResults.sipRequired) },
        ] : [
          { label: 'Monthly SIP Investment', value: formatCurrency(effectiveMonthly) },
          { label: 'Investment Duration', value: `${effectiveYears} Years` },
          { label: 'Expected Annual Return', value: `${effectiveRate}%` },
          ...(activeTab === 'stepup' ? [{ 
            label: 'Annual Step-up', 
            value: stepUpType === 'percentage' ? `${effectiveStepUp}%` : formatCurrency(effectiveStepUp) 
          }] : []),
        ]}
      />
    </div>
  );
};
