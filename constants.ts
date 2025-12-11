import { QuarterlyInput, Scenario, SimulationConfig } from "./types";

export const QUARTER_LABELS = Array.from({ length: 32 }, (_, i) => {
  const year = Math.floor(i / 4) + 1;
  const quarter = (i % 4) + 1;
  return `Y${year} Q${quarter}`;
});

export const DEFAULT_CONFIG: SimulationConfig = {
  initialAum: 8000000,
  annualManagementFee: 1.5,
  brokerage: {
    type: 'PERCENTAGE',
    percentageFee: 0.05,
    flatFeePerTrade: 10,
    estimatedTradesPerMonth: 100,
  },
  performanceFee: {
    enabled: false,
    performanceFeePercentage: 0,
    hurdleRate: 0,
  }
};

// Helper to expand yearly data into 4 quarterly inputs
const expandYearlyInputs = (yearlyData: { flow: number; cost: number }[]): QuarterlyInput[] => {
  return yearlyData.flatMap((year, yearIndex) => 
    Array.from({ length: 4 }, (_, qIndex) => ({
      quarterIndex: yearIndex * 4 + qIndex,
      changeInAum: year.flow,
      operatingCost: year.cost
    }))
  );
};

const pessimisticData = [
  { flow: 3000000, cost: 24750 },   // Y1
  { flow: 6000000, cost: 61500 },   // Y2
  { flow: 9000000, cost: 132000 },  // Y3
  { flow: 12000000, cost: 182250 }, // Y4
  { flow: 18000000, cost: 245250 }, // Y5
  { flow: 21000000, cost: 339750 }, // Y6
  { flow: 24000000, cost: 380250 }, // Y7
  { flow: 27000000, cost: 420750 }, // Y8
];

const medianData = [
  { flow: 6000000, cost: 30750 },   // Y1
  { flow: 12000000, cost: 85500 },  // Y2
  { flow: 18000000, cost: 245250 }, // Y3
  { flow: 22500000, cost: 390000 }, // Y4
  { flow: 24150000, cost: 509700 }, // Y5
  { flow: 27000000, cost: 561000 }, // Y6
  { flow: 28500000, cost: 588000 }, // Y7
  { flow: 30000000, cost: 615000 }, // Y8
];

const optimisticData = [
  { flow: 9000000, cost: 36750 },   // Y1
  { flow: 18000000, cost: 163500 }, // Y2
  { flow: 27000000, cost: 339750 }, // Y3
  { flow: 36000000, cost: 723000 }, // Y4
  { flow: 45000000, cost: 885000 }, // Y5
  { flow: 48000000, cost: 939000 }, // Y6
  { flow: 51000000, cost: 1241250 },// Y7
  { flow: 54000000, cost: 1308750 },// Y8
];

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'pessimistic',
    label: 'Pessimistic',
    color: '#f43f5e', // Rose
    estimatedAnnualReturn: 0,
    inputs: expandYearlyInputs(pessimisticData), 
  },
  {
    id: 'median',
    label: 'Median',
    color: '#6366f1', // Indigo/Brand
    estimatedAnnualReturn: 0,
    inputs: expandYearlyInputs(medianData),
  },
  {
    id: 'optimistic',
    label: 'Optimistic',
    color: '#10b981', // Emerald
    estimatedAnnualReturn: 0,
    inputs: expandYearlyInputs(optimisticData),
  }
];