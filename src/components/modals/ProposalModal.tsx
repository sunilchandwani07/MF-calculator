import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Calendar } from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; age: number }) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('Investor');
  const [age, setAge] = useState(35);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-brand-blue to-brand-purple text-white">
              <h3 className="text-xl font-bold">Generate Proposal</h3>
              <button 
                onClick={onClose} 
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="input-label flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-blue" />
                  Investor Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value || 'Investor')}
                  placeholder="Enter investor name"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value) || 35)}
                  placeholder="Enter age"
                  className="input-field"
                />
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onConfirm({ name, age })}
                  className="w-full btn-primary py-3 text-lg"
                >
                  Download PDF Proposal
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
