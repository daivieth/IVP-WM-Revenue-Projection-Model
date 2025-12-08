import { CalculatedMonth, MonthlyInput, SimulationConfig } from "../types";
import { MONTH_NAMES } from "../constants";

export const calculateSimulation = (
  config: SimulationConfig,
  monthlyInputs: MonthlyInput[]
): CalculatedMonth[] => {
  let currentAum = config.initialAum;
  const results: CalculatedMonth[] = [];

  monthlyInputs.forEach((input) => {
    const startAum = currentAum;
    
    // 1. Calculate Investment Growth (Accrued monthly based on estimated annual return)
    // Formula: AUM * (AnnualReturn / 12)
    const monthlyReturnRate = (config.performanceFee.estimatedAnnualReturn / 100) / 12;
    const investmentGrowth = startAum * monthlyReturnRate;

    // 2. Calculate Management Revenue
    // Formula: StartAUM * (AnnualFee / 12)
    const mgmtFee = startAum * ((config.annualManagementFee / 100) / 12);

    // 3. Calculate Performance Fee Revenue
    let perfFee = 0;
    if (config.performanceFee.enabled) {
      const hurdleMonthly = startAum * ((config.performanceFee.hurdleRate / 100) / 12);
      const excessReturn = investmentGrowth - hurdleMonthly;
      if (excessReturn > 0) {
        perfFee = excessReturn * (config.performanceFee.performanceFeePercentage / 100);
      }
    }

    const totalRevenue = mgmtFee + perfFee;

    // 4. Calculate Brokerage Expense
    let brokerageExpense = 0;
    if (config.brokerage.type === 'PERCENTAGE') {
      brokerageExpense = startAum * ((config.brokerage.percentageFee / 100) / 12);
    } else {
      brokerageExpense = config.brokerage.flatFeePerTrade * config.brokerage.estimatedTradesPerMonth;
    }

    // 5. Operating Expense (User Input)
    const operatingExpense = input.operatingCost;

    const totalExpenses = brokerageExpense + operatingExpense;
    const netProfit = totalRevenue - totalExpenses;

    // 6. Update AUM for next month
    // End AUM = Start + NetFlows + InvestmentGrowth - ManagementFee - Brokerage
    // (Note: Perf fees are usually deducted from client account, so they reduce AUM too. 
    // Opex is firm cost, not client cost, so it doesn't reduce AUM directly).
    // Let's assume fees reduce AUM.
    
    const feesDeductedFromAum = mgmtFee + perfFee + brokerageExpense; 
    // Note: Assuming brokerage is paid by client (typical in some models) or firm?
    // "Brokerage fees WE pay" implies firm cost. If firm pays, it doesn't come out of client AUM directly
    // unless it's a wrap fee program. Let's assume for this P&L model, the firm pays brokerage from its own pocket 
    // if it's an expense line item, BUT usually in wealth management, custody fees come from client.
    // However, the prompt asks for "Net Profit of OUR Division".
    // So Revenue = Fees from Client. Expenses = Brokerage + Opex.
    // So End AUM should only decrease by the Fees collected from Client.
    
    const endAum = startAum + input.changeInAum + investmentGrowth - (mgmtFee + perfFee);

    results.push({
      monthLabel: MONTH_NAMES[input.monthIndex],
      startAum,
      endAum,
      revenueManagementFee: mgmtFee,
      revenuePerformanceFee: perfFee,
      totalRevenue,
      expenseBrokerage: brokerageExpense,
      expenseOperating: operatingExpense,
      totalExpenses,
      netProfit,
      netFlows: input.changeInAum,
      investmentGrowth
    });

    currentAum = endAum;
  });

  return results;
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatPercentage = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(val / 100);
};