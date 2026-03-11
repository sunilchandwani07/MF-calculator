import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { APP_CONFIG } from '../../constants';
import { motion } from 'motion/react';

interface HeaderProps {
  calculatorName: string;
}

export const Header: React.FC<HeaderProps> = ({ calculatorName }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-brand-dark to-brand-blue text-white p-4 md:p-6 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-1 rounded-lg shadow-inner overflow-hidden flex items-center justify-center w-16 h-16 md:w-20 md:h-20"
          >
            <img 
              src={APP_CONFIG.logoBase64 || "/logo.png"} 
              alt={`${APP_CONFIG.companyName} Logo`} 
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback if logo is missing
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `<div class="text-brand-blue font-bold text-[10px] text-center leading-tight">${APP_CONFIG.companyName}</div>`;
              }}
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">{APP_CONFIG.companyName}</h1>
            <p className="text-xs text-blue-100 uppercase tracking-widest font-semibold">Nurturing your family's future</p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center md:text-right"
        >
          <h2 className="text-lg font-semibold text-blue-50 italic">{calculatorName}</h2>
          <div className="flex items-center justify-center md:justify-end gap-2 text-sm text-blue-200 mt-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(), 'dd MMMM yyyy')}</span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};
