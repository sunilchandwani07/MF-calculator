export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateSIP = (monthlyInvestment: number, rate: number, years: number) => {
  const i = rate / 100 / 12;
  const n = years * 12;
  const futureValue = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const totalInvestment = monthlyInvestment * n;
  const estimatedReturns = futureValue - totalInvestment;

  return {
    futureValue: Math.round(futureValue),
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(estimatedReturns),
  };
};

export const calculateStepUpSIP = (
  monthlyInvestment: number, 
  rate: number, 
  years: number, 
  stepUpValue: number,
  stepUpType: 'percentage' | 'fixed' = 'percentage'
) => {
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  let futureValue = 0;
  let totalInvestment = 0;
  let currentMonthlyInvestment = monthlyInvestment;

  for (let m = 1; m <= months; m++) {
    totalInvestment += currentMonthlyInvestment;
    futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);

    if (m % 12 === 0) {
      if (stepUpType === 'percentage') {
        currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpValue / 100);
      } else {
        currentMonthlyInvestment = currentMonthlyInvestment + stepUpValue;
      }
    }
  }

  return {
    futureValue: Math.round(futureValue),
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(futureValue - totalInvestment),
  };
};

export const calculateHomeLoanSetOff = (
  loanAmount: number, 
  loanRate: number, 
  tenureYears: number, 
  sipRate: number,
  interestType: 'reducing' | 'fixed' = 'reducing'
) => {
  const n = tenureYears * 12;
  let emi = 0;
  let totalInterest = 0;
  let totalPayment = 0;

  if (interestType === 'reducing') {
    const monthlyLoanRate = loanRate / 100 / 12;
    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    emi = (loanAmount * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, n)) / (Math.pow(1 + monthlyLoanRate, n) - 1);
    totalPayment = emi * n;
    totalInterest = totalPayment - loanAmount;
  } else {
    // Fixed / Flat Rate
    totalInterest = loanAmount * (loanRate / 100) * tenureYears;
    totalPayment = loanAmount + totalInterest;
    emi = totalPayment / n;
  }

  // SIP required such that Returns (FV - Total Investment) = totalInterest
  const i = sipRate / 100 / 12;
  let sipRequired = 0;
  if (i > 0) {
    const annuityFactor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    // FV - (P * n) = totalInterest => P * annuityFactor - P * n = totalInterest => P = totalInterest / (annuityFactor - n)
    sipRequired = totalInterest / (annuityFactor - n);
  } else {
    sipRequired = totalInterest / n; 
  }

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    sipRequired: Math.round(sipRequired),
    totalPayment: Math.round(totalPayment)
  };
};

export const calculateCostOfDelay = (monthlyInvestment: number, rate: number, years: number, delayMonths: number) => {
  const normal = calculateSIP(monthlyInvestment, rate, years);
  
  // If delayed, we invest for (years * 12 - delayMonths) months
  // But we compare the value at the end of the original 'years' period.
  // Wait, usually cost of delay means:
  // 1. You start now and invest for 20 years.
  // 2. You start in 6 months and invest for 19.5 years.
  // We compare the final corpus at the end of 20 years.
  
  const monthlyRate = rate / 100 / 12;
  const totalMonths = years * 12;
  const activeMonths = totalMonths - delayMonths;
  
  let delayedFutureValue = 0;
  if (activeMonths > 0) {
    delayedFutureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, activeMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  }
  
  const cost = normal.futureValue - delayedFutureValue;
  
  return {
    normalValue: normal.futureValue,
    delayedValue: Math.round(delayedFutureValue),
    cost: Math.round(cost)
  };
};

export const calculateLumpsum = (investment: number, rate: number, years: number) => {
  const i = rate / 100;
  const futureValue = investment * Math.pow(1 + i, years);
  const estimatedReturns = futureValue - investment;

  return {
    futureValue: Math.round(futureValue),
    totalInvestment: Math.round(investment),
    estimatedReturns: Math.round(estimatedReturns),
  };
};

export const calculateGoal = (targetAmount: number, rate: number, years: number) => {
  const i = rate / 100 / 12;
  const n = years * 12;
  const monthlyInvestment = targetAmount / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));

  return {
    futureValue: Math.round(targetAmount),
    monthlyInvestment: Math.round(monthlyInvestment),
    totalInvestment: Math.round(monthlyInvestment * n),
    estimatedReturns: Math.round(targetAmount - (monthlyInvestment * n)),
  };
};

export const calculateSWP = (lumpsum: number, monthlyWithdrawal: number, rate: number, years: number, inflation: number = 0, isStress: boolean = false) => {
  let balance = lumpsum;
  const normalMonthlyRate = rate / 100 / 12;
  const stressMonthlyRate = rate / 100 / 12; // Bull phase uses normal expected return
  const months = years * 12;
  let totalWithdrawn = 0;
  let currentMonthlyWithdrawal = monthlyWithdrawal;

  for (let m = 1; m <= months; m++) {
    // Withdraw at the beginning of the month
    const withdrawal = Math.min(balance, currentMonthlyWithdrawal);
    balance -= withdrawal;
    totalWithdrawn += withdrawal;

    // Add interest for the month
    let currentMonthlyRate = isStress ? stressMonthlyRate : normalMonthlyRate;
    
    // SPAN correction in first 3 months: 65% correction and 35% growth spread over 3 months
    // Interpretation: Month 1 & 2: -21.66% each, Month 3: +11.66%
    if (isStress && m <= 3) {
      if (m <= 2) {
        // -21.66% correction per month for first 2 months (total ~43.3% drop)
        balance = balance * (1 - 0.2166);
      } else {
        // +11.66% growth in 3rd month
        balance = balance * (1 + 0.1166);
      }
    } else {
      balance = balance * (1 + currentMonthlyRate);
    }

    // Stress correction: 10% every 4 years (at the end of month 48, 96, etc.)
    if (isStress && m > 3 && m % 48 === 0) {
      balance = balance * 0.90;
    }

    // Increase withdrawal amount annually
    if (m % 12 === 0 && inflation > 0) {
      currentMonthlyWithdrawal = currentMonthlyWithdrawal * (1 + (inflation / 100));
    }

    if (balance <= 0) {
      balance = 0;
      break;
    }
  }

  return {
    finalBalance: Math.round(balance),
    totalWithdrawn: Math.round(totalWithdrawn),
    estimatedReturns: Math.round(Math.max(0, balance + totalWithdrawn - lumpsum)),
  };
};

export const calculateMaxSWP = (lumpsum: number, rate: number, years: number, inflation: number = 0, isStress: boolean = false) => {
  const normalMonthlyRate = rate / 100 / 12;
  const stressMonthlyRate = rate / 100 / 12;
  const months = years * 12;

  const findInitialWithdrawal = (targetFinalBalance: number) => {
    let low = 0;
    let high = lumpsum; 
    let result = 0;

    for (let i = 0; i < 25; i++) {
      let mid = (low + high) / 2;
      let balance = lumpsum;
      let currentWithdrawal = mid;
      
      for (let m = 1; m <= months; m++) {
        balance -= currentWithdrawal;
        
        if (isStress && m <= 3) {
          if (m <= 2) {
            balance = balance * (1 - 0.2166);
          } else {
            balance = balance * (1 + 0.1166);
          }
        } else {
          const currentMonthlyRate = isStress ? stressMonthlyRate : normalMonthlyRate;
          balance *= (1 + currentMonthlyRate);
        }
        
        if (isStress && m > 3 && m % 48 === 0) {
          balance *= 0.90;
        }

        if (m % 12 === 0 && inflation > 0) {
          currentWithdrawal *= (1 + inflation / 100);
        }
        
        if (balance < -1e12) break; 
      }

      if (balance >= targetFinalBalance) {
        result = mid;
        low = mid;
      } else {
        high = mid;
      }
    }
    return result;
  };

  const maxWithdrawalCase2 = findInitialWithdrawal(0);
  const maxWithdrawalCase1 = findInitialWithdrawal(lumpsum * 0.9);

  return {
    maxWithdrawalCase1: Math.round(maxWithdrawalCase1),
    maxWithdrawalCase2: Math.round(maxWithdrawalCase2)
  };
};
