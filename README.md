# IVP-WM Revenue Projection Model

A React-based application for revenue forecasting and financial analysis using TypeScript, Vite, and Chart.js.

## Features
- Interactive input controls for financial parameters
- Dynamic revenue projection charts
- Tabular data representation
- Summary metrics cards
- Real-time calculations

## Project Structure
```
├── components/
│   ├── ChartsSection.tsx    # Interactive revenue charts
│   ├── DataTable.tsx        # Tabular data display
│   ├── InputSection.tsx     # User input controls
│   └── SummaryCards.tsx     # Key metric summaries
├── utils/
│   └── calculations.ts      # Core financial formulas
├── App.tsx                  # Main application component
├── index.tsx                # Entry point
├── types.ts                 # Type definitions
├── constants.ts             # Configuration constants
└── vite.config.ts           # Build configuration
```

## Installation
```bash
npm install
npm run dev
```

## Configuration
Edit `constants.ts` to adjust:
- Default financial parameters
- Chart display options
- Table formatting settings

## Development Scripts
```bash
npm run build  # Create production build
npm run lint   # Run ESLint checks
npm run preview  # Preview production build
```

## Key Dependencies
- React 18
- TypeScript 5
- Chart.js 4
- Vite 4