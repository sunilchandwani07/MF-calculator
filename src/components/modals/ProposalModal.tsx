import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Calendar, MessageCircle } from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; age: number; whatsapp?: string }) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('Investor');
  const [age, setAge] = useState(35);
  const [whatsapp, setWhatsapp] = useState('91');

  const quickAges = [25, 30, 35, 40, 45, 50, 60];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-brand-blue to-brand-purple text-white">
              <h3 className="text-xl font-bold">Proposal Details</h3>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="input-label flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-brand-blue" />
                  Investor Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="Enter investor name"
                  className="input-field py-2.5 text-base"
                />
              </div>

              <div>
                <label className="input-label flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                  Age
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    onFocus={(e) => e.target.select()}
                    placeholder="Enter age"
                    className="input-field py-2.5 text-base"
                  />
                  <div className="flex flex-wrap gap-2">
                    {quickAges.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAge(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          age === a 
                            ? 'bg-brand-blue text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="input-field py-2.5 text-base"
                />
                <p className="text-[10px] text-slate-400 mt-1 italic">Include country code without + or spaces</p>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onConfirm({ 
                    name: name || 'Investor', 
                    age: age || 35,
                    whatsapp: whatsapp.trim()
                  })}
                  className="w-full btn-primary py-3.5 text-lg shadow-xl"
                >
                  Generate & Send Proposal
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
