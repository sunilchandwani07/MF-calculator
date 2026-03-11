import React from 'react';
import { Home, ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { APP_CONFIG } from '../../constants';
import { motion } from 'motion/react';

interface FooterProps {
  onBack?: () => void;
  onHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onBack, onHome }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">Contact Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">{APP_CONFIG.distributorName}</p>
                  <p className="text-xs opacity-70">({APP_CONFIG.designation})</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-blue shrink-0" />
                <span>{APP_CONFIG.contactNumbers.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-blue shrink-0" />
                <span>{APP_CONFIG.email}</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-4">SEBI Disclaimer</h3>
            <p className="text-xs leading-relaxed opacity-70">
              {APP_CONFIG.sebiDisclaimer}
              <br /><br />
              The calculators provided are for illustrative purposes only and do not constitute investment advice. 
              Past performance is not indicative of future results. Please consult with a certified financial advisor 
              before making any investment decisions.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              Home
            </motion.button>
          </div>
          <p className="text-xs opacity-50">© {new Date().getFullYear()} {APP_CONFIG.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
