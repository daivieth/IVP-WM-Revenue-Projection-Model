import { QuarterlyInput, Scenario, SimulationConfig } from "./types";

export const QUARTER_LABELS = Array.from({ length: 32 }, (_, i) => {
  const year = Math.floor(i / 4) + 1;
  const quarter = (i % 4) + 1;
  return `Y${year} Q${quarter}`;
});

export const DEFAULT_CONFIG: SimulationConfig = {
  initialAum: 8000000, // $8M
  annualManagementFee: 1.5, // 1.5%
  brokerage: {
    type: 'PERCENTAGE',
    percentageFee: 0.05, // 0.05%
    flatFeePerTrade: 10, // $10
    estimatedTradesPerMonth: 100,
  },
  performanceFee: {
    enabled: false,
    performanceFeePercentage: 0,
    hurdleRate: 0,
  }
};

const createInputs = (flow: number, opex: number): QuarterlyInput[] => 
  Array.from({ length: 32 }, (_, i) => ({
    quarterIndex: i,
    changeInAum: flow,
    operatingCost: opex,
  }));

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'pessimistic',
    label: 'Pessimistic',
    color: '#f43f5e', // Rose
    estimatedAnnualReturn: 15,
    inputs: createInputs(0, 0), 
  },
  {
    id: 'median',
    label: 'Median',
    color: '#6366f1', // Indigo/Brand
    estimatedAnnualReturn: 15,
    inputs: createInputs(0, 0),
  },
  {
    id: 'optimistic',
    label: 'Optimistic',
    color: '#10b981', // Emerald
    estimatedAnnualReturn: 15,
    inputs: createInputs(0, 0),
  }
];