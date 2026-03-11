import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/calculations';
import { APP_CONFIG } from '../../constants';

interface ProposalTemplateProps {
  id: string;
  calculatorName: string;
  investorName: string;
  investorAge: number;
  investorWhatsapp?: string;
  results: {
    totalInvestment: number;
    estimatedReturns: number;
    futureValue: number;
    monthlyInvestment?: number;
    totalWithdrawn?: number;
    stressFinalBalance?: number;
    stressTotalWithdrawn?: number;
    monthsSustained?: number;
    monthsAbove90?: number;
    stressMonthsSustained?: number;
    stressMonthsAbove90?: number;
    durationYears?: number;
  };
  inputs: {
    label: string;
    value: string;
  }[];
}

export const ProposalTemplate: React.FC<ProposalTemplateProps> = ({
  id,
  calculatorName,
  investorName,
  investorAge,
  investorWhatsapp,
  results,
  inputs,
}) => {
  return (
    <div 
      id={id} 
      className="bg-white w-[210mm] flex flex-col text-slate-800 font-serif"
      style={{ position: 'absolute', left: '-9999px', top: '-9999px', fontSize: '14px' }}
    >
      {/* Header Section */}
      <div className="p-10 pb-6 flex justify-between items-start border-b-2 border-brand-blue-medium">
        <div className="flex items-center gap-4">
          <img 
            src={APP_CONFIG.logoBase64 || "/logo.png"} 
            alt={APP_CONFIG.companyName} 
            className="h-16 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-brand-dark">{APP_CONFIG.companyName}</h1>
          <p className="text-sm font-sans text-slate-600">{calculatorName} Proposal</p>
          <p className="text-sm font-sans text-slate-500 mt-1">Date: {format(new Date(), 'd/M/yyyy')}</p>
        </div>
      </div>

      {/* Letter Body */}
      <div className="px-16 py-10 flex-grow space-y-6 leading-relaxed text-sm">
        <p className="font-bold">Dear {investorName},</p>
        
        <p>
          Thank you for placing your trust in {APP_CONFIG.companyName}. It is a privilege to assist you in shaping a 
          financially secure and confident future. Our investment strategies are guided by disciplined 
          research, structured asset allocation, and over three decades of experience navigating 
          multiple market cycles.
        </p>

        <p>
          We remain committed to helping you stay focused, patient, and strategically aligned with 
          your long-term financial goals.
        </p>

        <p>
          The following illustration demonstrates how disciplined investing through a {calculatorName} 
          can help build long-term wealth through the power of compounding.
        </p>

        {/* Investor Details */}
        <div className="pt-4">
          <h3 className="font-bold mb-3 border-b border-slate-200 pb-2">Investor Details</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex justify-between border-b border-slate-50 py-1">
              <span className="text-slate-600">Investor Age</span>
              <span className="font-bold">{investorAge} Years</span>
            </div>
            {investorWhatsapp && (
              <div className="flex justify-between border-b border-slate-50 py-1">
                <span className="text-slate-600">WhatsApp Number</span>
                <span className="font-bold">{investorWhatsapp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Investment Summary Table */}
        <div className="py-4">
          <h3 className="font-bold mb-4 border-b border-slate-200 pb-2">Investment Summary</h3>
          <table className="w-full border-collapse">
            <tbody>
              {inputs.map((input, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-3 text-slate-600">{input.label}</td>
                  <td className="py-3 text-right font-bold">{input.value}</td>
                </tr>
              ))}
              <tr className="border-b border-slate-100">
                <td className="py-3 text-slate-600">Total Amount Invested</td>
                <td className="py-3 text-right font-bold">{formatCurrency(results.totalInvestment)}</td>
              </tr>
              {results.totalWithdrawn !== undefined && (
                <tr className="border-b border-slate-100">
                  <td className="py-3 text-slate-600">Total Amount Withdrawn (Normal)</td>
                  <td className="py-3 text-right font-bold">{formatCurrency(results.totalWithdrawn)}</td>
                </tr>
              )}
              {results.stressTotalWithdrawn !== undefined && (
                <tr className="border-b border-slate-100">
                  <td className="py-3 text-slate-600">Total Amount Withdrawn (Stress)</td>
                  <td className="py-3 text-right font-bold">{formatCurrency(results.stressTotalWithdrawn)}</td>
                </tr>
              )}
              <tr className="bg-slate-50">
                <td className="py-3 px-2 text-brand-blue font-bold">
                  {calculatorName.includes('Withdrawal') ? 'Final Balance (Normal)' : 'Projected Corpus'}
                </td>
                <td className="py-3 px-2 text-right text-brand-blue font-bold">
                  {formatCurrency(results.futureValue)}
                  {results.durationYears && results.monthsAbove90 !== undefined && results.monthsAbove90 < results.durationYears * 12 && (
                    <div className="text-[10px] text-amber-600 font-normal mt-1">
                      90% Capital sustained upto {Math.floor(results.monthsAbove90 / 12)} years only
                    </div>
                  )}
                  {results.durationYears && results.monthsSustained !== undefined && results.monthsSustained < results.durationYears * 12 && (
                    <div className="text-[10px] text-red-600 font-normal mt-1">
                      Withdrawal can be sustained upto {Math.floor(results.monthsSustained / 12)} years only
                    </div>
                  )}
                </td>
              </tr>
              {results.stressFinalBalance !== undefined && (
                <tr className="bg-red-50">
                  <td className="py-3 px-2 text-red-600 font-bold">
                    Final Balance (Stress Scenario)
                  </td>
                  <td className="py-3 px-2 text-right text-red-600 font-bold">
                    {formatCurrency(results.stressFinalBalance)}
                    {results.durationYears && results.stressMonthsAbove90 !== undefined && results.stressMonthsAbove90 < results.durationYears * 12 && (
                      <div className="text-[10px] text-amber-600 font-normal mt-1">
                        90% Capital sustained upto {Math.floor(results.stressMonthsAbove90 / 12)} years only
                      </div>
                    )}
                    {results.durationYears && results.stressMonthsSustained !== undefined && results.stressMonthsSustained < results.durationYears * 12 && (
                      <div className="text-[10px] text-red-600 font-normal mt-1">
                        Withdrawal can be sustained upto {Math.floor(results.stressMonthsSustained / 12)} years only
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p>
          Consistent investing combined with disciplined portfolio monitoring and periodic rebalancing 
          can significantly improve the probability of achieving long-term financial goals.
        </p>

        <p className="italic font-medium text-brand-dark">
          We look forward to walking this journey with you — sowing wisely today and reaping confidently 
          tomorrow.
        </p>

        {/* Punchline */}
        <div className="py-8 text-center">
          <p className="text-xl font-bold text-brand-blue">
            Mutual Funds Sahi hai & Advisor Jaroori Hai
          </p>
        </div>

        {/* Sign-off */}
        <div className="pt-8">
          <p>With Warm Regards,</p>
          <p className="font-bold mt-1">{APP_CONFIG.distributorName}</p>
          <p className="text-sm text-slate-600">{APP_CONFIG.designation}</p>
          <p className="text-sm text-slate-600">{APP_CONFIG.companyName}</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm font-bold text-brand-dark">Contact Details:</p>
            <p className="text-sm text-slate-600">Phone: {APP_CONFIG.contactNumbers.join(', ')}</p>
            <p className="text-sm text-slate-600">Email: {APP_CONFIG.email}</p>
          </div>
        </div>

        {/* Disclaimer inside content area */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 leading-tight text-justify italic">
            <span className="font-bold not-italic">SEBI Disclaimer:</span> {APP_CONFIG.sebiDisclaimer}
            <br /><br />
            Calculation shown here is for illustration purpose only. Actual returns may vary based on market conditions.
            Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
          </p>
        </div>
      </div>
    </div>
  );
};
