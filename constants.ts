import { MonthlyInput, SimulationConfig } from "./types";

export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const DEFAULT_CONFIG: SimulationConfig = {
  initialAum: 7500000, // $7.5M
  annualManagementFee: 1.5, // 1.5%
  brokerage: {
    type: 'PERCENTAGE',
    percentageFee: 0.3, // 0.3%
    flatFeePerTrade: 25,
    estimatedTradesPerMonth: 100,
  },
  performanceFee: {
    enabled: true,
    performanceFeePercentage: 20,
    hurdleRate: 6,
    estimatedAnnualReturn: 10,
  }
};

export const DEFAULT_MONTHLY_INPUTS: MonthlyInput[] = Array.from({ length: 12 }, (_, i) => ({
  monthIndex: i,
  changeInAum: 100000, // Default $100k inflow
  operatingCost: 25000, // Default $25k opex
}));