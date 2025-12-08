# IVP Wealth Management Revenue Projection Model

A React-based application for projecting revenue scenarios in wealth management. Built with TypeScript and Vite.

## Features

- Interactive input sections for financial parameters
- Real-time revenue projections
- Visual charts displaying key metrics
- Summary cards highlighting important figures
- Responsive data tables

## Installation


1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Project Structure

```
├── components/
│   ├── ChartsSection.tsx    # Data visualization components
│   ├── DataTable.tsx        # Tabular data presentation
│   ├── InputSection.tsx     # User input controls
│   └── SummaryCards.tsx     # Key metric summaries
├── utils/
│   └── calculations.ts      # Core financial calculations
├── App.tsx                  # Main application component
├── constants.ts             # Application constants
├── types.ts                 # TypeScript type definitions
└── vite.config.ts           # Vite configuration
```

## Technologies Used

- React 18
- TypeScript 5
- Vite 4
- Chart.js (if applicable)
- Tailwind CSS (if applicable)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)