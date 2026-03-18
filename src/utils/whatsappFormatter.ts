import { formatCurrency } from './calculations';

interface ProposalData {
  investorName: string;
  investorAge: number;
  calculatorName: string;
  inputs: { label: string; value: string | number }[];
  results: { label: string; value: string | number }[];
}

export const generateWhatsAppMessage = (data: ProposalData) => {
  const welcome = `*Hi ${data.investorName}, Welcome to Invest & Insure!* 🚀\n\n` +
    `We guide you to build Wealth. Remember: _"Mutual Funds Sahi hai & Advisor Jaroori Hai."_\n\n` +
    `*------------------------------------------*\n` +
    `*INVESTMENT PROPOSAL: ${data.calculatorName.toUpperCase()}*\n` +
    `*------------------------------------------*\n\n`;

  const investorSummary = `*👤 INVESTOR SUMMARY*\n` +
    `• Name: ${data.investorName}\n` +
    `• Age: ${data.investorAge}\n\n`;

  let investmentSummary = `*💰 INVESTMENT INPUTS*\n`;
  data.inputs.forEach(input => {
    investmentSummary += `• ${input.label}: ${input.value}\n`;
  });
  investmentSummary += `\n`;

  let proposalResults = `*📊 PROPOSAL PROJECTIONS*\n`;
  data.results.forEach(result => {
    proposalResults += `• ${result.label}: ${result.value}\n`;
  });
  proposalResults += `\n`;

  const closing = `*------------------------------------------*\n` +
    `✨ *Start your wealth creation journey today!* Every small step counts towards a bigger future. Let's make your money work for you!\n\n` +
    `🔗 *To know more, visit:* http://p.njw.bz/29794\n` +
    `🚀 *To start your journey with us:* http://p.njw.bz/29794\n\n` +
    `_Invest & Insure - Your Partner in Financial Growth_`;

  return welcome + investorSummary + investmentSummary + proposalResults + closing;
};
