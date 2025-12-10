import { QuarterlyInput, Scenario, SimulationConfig } from "./types";

export const QUARTER_LABELS = Array.from({ length: 20 }, (_, i) => {
  const year = Math.floor(i / 4) + 1;
  const quarter = (i % 4) + 1;
  return `Y${year} Q${quarter}`;
});

export const DEFAULT_CONFIG: SimulationConfig = {
  initialAum: 7500000, // $7.5M
  annualManagementFee: 1.5, // 1.5%
  brokerage: {
    type: 'PERCENTAGE',
    percentageFee: 0.03, // 0.03%
    flatFeePerTrade: 10, // $10 per trade
    estimatedTradesPerMonth: 100,
  },
  performanceFee: {
    enabled: true,
    performanceFeePercentage: 20,
    hurdleRate: 0, // 0%
  }
};

const createInputs = (flow: number, opex: number): QuarterlyInput[] => 
  Array.from({ length: 20 }, (_, i) => ({
    quarterIndex: i,
    changeInAum: flow,
    operatingCost: opex,
  }));

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'pessimistic',
    label: 'Pessimistic',
    color: '#f43f5e', // Rose
    estimatedAnnualReturn: 0,
    inputs: createInputs(0, 75000), // 0 Net Flows, 75k Opex
  },
  {
    id: 'median',
    label: 'Median',
    color: '#6366f1', // Indigo/Brand
    estimatedAnnualReturn: 0,
    inputs: createInputs(1000000, 75000), // 1M Inflows, 75k Opex
  },
  {
    id: 'optimistic',
    label: 'Optimistic',
    color: '#10b981', // Emerald
    estimatedAnnualReturn: 0,
    inputs: createInputs(3000000, 75000), // 3M Inflows, 75k Opex
  }
];