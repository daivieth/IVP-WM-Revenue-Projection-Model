export interface BrokerageConfig {
  type: 'PERCENTAGE' | 'FLAT_PER_TRADE';
  percentageFee: number; // Annual %
  flatFeePerTrade: number; // $ per trade
  estimatedTradesPerMonth: number;
}

export interface PerformanceFeeConfig {
  enabled: boolean;
  performanceFeePercentage: number; // e.g., 20%
  hurdleRate: number; // e.g., 5% return needed before fees kick in
  estimatedAnnualReturn: number; // Expected portfolio growth %
}

export interface SimulationConfig {
  initialAum: number;
  annualManagementFee: number; // %
  brokerage: BrokerageConfig;
  performanceFee: PerformanceFeeConfig;
}

export interface MonthlyInput {
  monthIndex: number; // 0-11
  changeInAum: number; // Net Flows (Deposits - Withdrawals)
  operatingCost: number; // Fixed monthly opex
}

export interface CalculatedMonth {
  monthLabel: string;
  startAum: number;
  endAum: number;
  revenueManagementFee: number;
  revenuePerformanceFee: number;
  totalRevenue: number;
  expenseBrokerage: number;
  expenseOperating: number;
  totalExpenses: number;
  netProfit: number;
  netFlows: number;
  investmentGrowth: number;
}
