import { CalculatedQuarter, Scenario, SimulationConfig } from "../types";
import { QUARTER_LABELS } from "../constants";

export const calculateSimulation = (
  config: SimulationConfig,
  scenario: Scenario
): CalculatedQuarter[] => {
  let currentAum = config.initialAum;
  const results: CalculatedQuarter[] = [];

  scenario.inputs.forEach((input) => {
    const startAum = currentAum;
    
    // 1. Calculate Investment Growth
    // Formula: AUM * (AnnualReturn / 4)
    // Use the Scenario's specific return rate
    const quarterlyReturnRate = (scenario.estimatedAnnualReturn / 100) / 4;
    const investmentGrowth = startAum * quarterlyReturnRate;

    // 2. Calculate Management Revenue
    const mgmtFee = startAum * ((config.annualManagementFee / 100) / 4);

    // 3. Calculate Performance Fee Revenue
    let perfFee = 0;
    if (config.performanceFee.enabled) {
      const hurdleQuarterly = startAum * ((config.performanceFee.hurdleRate / 100) / 4);
      const excessReturn = investmentGrowth - hurdleQuarterly;
      if (excessReturn > 0) {
        perfFee = excessReturn * (config.performanceFee.performanceFeePercentage / 100);
      }
    }

    const totalRevenue = mgmtFee + perfFee;

    // 4. Calculate Brokerage Expense
    let brokerageExpense = 0;
    if (config.brokerage.type === 'PERCENTAGE') {
      brokerageExpense = startAum * ((config.brokerage.percentageFee / 100) / 4);
    } else {
      const tradesPerQuarter = config.brokerage.estimatedTradesPerMonth * 3;
      brokerageExpense = config.brokerage.flatFeePerTrade * tradesPerQuarter;
    }

    // 5. Operating Expense
    const operatingExpense = input.operatingCost;

    const totalExpenses = brokerageExpense + operatingExpense;
    const netProfit = totalRevenue - totalExpenses;

    // 6. Update AUM for next quarter
    const endAum = startAum + input.changeInAum + investmentGrowth - (mgmtFee + perfFee);

    results.push({
      quarterLabel: QUARTER_LABELS[input.quarterIndex],
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