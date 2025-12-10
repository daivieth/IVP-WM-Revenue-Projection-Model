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
  // estimatedAnnualReturn moved to Scenario
}

export interface SimulationConfig {
  initialAum: number;
  annualManagementFee: number; // %
  brokerage: BrokerageConfig;
  performanceFee: PerformanceFeeConfig;
}

export interface QuarterlyInput {
  quarterIndex: number; // 0-19
  changeInAum: number; // Net Flows (Deposits - Withdrawals) per quarter
  operatingCost: number; // Fixed quarterly opex
}

export type ScenarioType = 'pessimistic' | 'median' | 'optimistic';

export interface Scenario {
  id: ScenarioType;
  label: string;
  color: string;
  estimatedAnnualReturn: number; // Specific to this scenario
  inputs: QuarterlyInput[];
}

export interface CalculatedQuarter {
  quarterLabel: string;
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