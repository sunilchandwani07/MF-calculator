import React, { useState } from 'react';
import { Calendar, Type, Menu, X, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { APP_CONFIG } from '../../constants';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  calculatorName: string;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onNavigate: (tab: any) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  calculatorName, 
  fontSize, 
  onFontSizeChange,
  onNavigate,
  activeTab
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'HOME', name: 'Dashboard' },
    { id: 'SIP', name: 'SIP' },
    { id: 'LUMPSUM', name: 'Lumpsum' },
    { id: 'GOAL', name: 'Goal' },
    { id: 'SWP', name: 'SWP' },
  ];

  const handleFontSizeToggle = () => {
    const nextSize = fontSize >= 19 ? 16 : fontSize + 1;
    onFontSizeChange(nextSize);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-brand-dark to-brand-blue text-white p-4 md:p-6 shadow-lg sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => onNavigate('HOME')}
              className="bg-white p-1 rounded-lg shadow-inner overflow-hidden flex items-center justify-center w-12 h-12 md:w-16 md:h-16 cursor-pointer"
            >
              <img 
                src={APP_CONFIG.logoBase64 || "/logo.png"} 
                alt={`${APP_CONFIG.companyName} Logo`} 
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<div class="text-brand-blue font-bold text-[8px] text-center leading-tight">${APP_CONFIG.companyName}</div>`;
                }}
              />
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:block"
            >
              <h1 className="text-lg md:text-2xl font-bold tracking-tight">{APP_CONFIG.companyName}</h1>
              <p className="text-[10px] text-blue-100 uppercase tracking-widest font-semibold">Nurturing your family's future</p>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Font Size Toggle */}
            <button 
              onClick={handleFontSizeToggle}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
              title="Adjust Font Size"
            >
              <Type className="w-5 h-5" />
              <span className="text-xs font-bold">+{fontSize - 16}</span>
            </button>

            {/* Quick Nav Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1"
              >
                <Menu className="w-5 h-5" />
                <span className="hidden md:inline text-xs font-bold">Menu</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsMenuOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-20"
                    >
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            setIsMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === item.id 
                              ? 'bg-brand-blue text-white' 
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-row justify-between items-end border-t border-white/10 pt-2"
        >
          <h2 className="text-sm md:text-lg font-semibold text-blue-50 italic">{calculatorName}</h2>
          <div className="flex items-center gap-2 text-[10px] md:text-sm text-blue-200">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span>{format(new Date(), 'dd MMM yyyy')}</span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};
