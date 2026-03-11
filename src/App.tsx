import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SIPCalculator } from './components/calculators/SIPCalculator';
import { LumpsumCalculator } from './components/calculators/LumpsumCalculator';
import { GoalCalculator } from './components/calculators/GoalCalculator';
import { SWPCalculator } from './components/calculators/SWPCalculator';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, PieChart, Target, ChevronRight, RefreshCw } from 'lucide-react';

type CalculatorType = 'HOME' | 'SIP' | 'LUMPSUM' | 'GOAL' | 'SWP';

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorType>('HOME');
  const [fontSize, setFontSize] = useState(16);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Update font size on root
  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-size', `${fontSize}px`);
  }, [fontSize]);

  // Dark mode support
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const calculators = [
    {
      id: 'SIP',
      name: 'SIP Calculator',
      description: 'Calculate how much wealth you can create by investing small amounts monthly.',
      icon: <Calculator className="w-8 h-8 text-brand-blue" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'LUMPSUM',
      name: 'Lumpsum Calculator',
      description: 'Estimate the future value of your one-time investment.',
      icon: <PieChart className="w-8 h-8 text-brand-purple" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      id: 'GOAL',
      name: 'Goal Calculator',
      description: 'Find out how much you need to save monthly to reach your financial goal.',
      icon: <Target className="w-8 h-8 text-emerald-600" />,
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      id: 'SWP',
      name: 'SWP Calculator',
      description: 'Plan your retirement income with Systematic Withdrawal Plan and inflation adjustment.',
      icon: <RefreshCw className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  const getCalculatorName = () => {
    switch (activeTab) {
      case 'SIP': return 'SIP Calculator';
      case 'LUMPSUM': return 'Lumpsum Calculator';
      case 'GOAL': return 'Goal Planner';
      case 'SWP': return 'SWP Calculator';
      default: return 'Invest & Insure Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header 
        calculatorName={getCalculatorName()} 
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onNavigate={setActiveTab}
        activeTab={activeTab}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full py-8 px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'HOME' ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {calculators.map((calc) => (
                <motion.button
                  key={calc.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveTab(calc.id as CalculatorType)}
                  className="calculator-card p-8 text-left group hover:border-brand-blue transition-all"
                >
                  <div className={`${calc.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {calc.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{calc.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    {calc.description}
                  </p>
                  <div className="flex items-center text-brand-blue font-semibold text-sm">
                    Open Calculator
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="calculator-card"
            >
              {activeTab === 'SIP' && <SIPCalculator />}
              {activeTab === 'LUMPSUM' && <LumpsumCalculator />}
              {activeTab === 'GOAL' && <GoalCalculator />}
              {activeTab === 'SWP' && <SWPCalculator />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer 
        onHome={() => setActiveTab('HOME')}
        onBack={() => setActiveTab('HOME')}
      />
    </div>
  );
}
