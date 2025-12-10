import React from 'react';
import { CalculatedQuarter, QuarterlyInput } from '../types';
import { formatCurrency } from '../utils/calculations';

interface DataTableProps {
  inputs: QuarterlyInput[];
  calculatedData: CalculatedQuarter[];
  onInputChange: (quarterIndex: number, field: keyof QuarterlyInput, value: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ inputs, calculatedData, onInputChange }) => {
  
  // Calculate Totals for the final column
  const totalFlows = inputs.reduce((a, b) => a + b.changeInAum, 0);
  const totalOpex = inputs.reduce((a, b) => a + b.operatingCost, 0);
  const totalGrowth = calculatedData.reduce((a, b) => a + b.investmentGrowth, 0);
  const totalRevenue = calculatedData.reduce((a, b) => a + b.totalRevenue, 0);
  const totalBrokerage = calculatedData.reduce((a, b) => a + b.expenseBrokerage, 0);
  const totalProfit = calculatedData.reduce((a, b) => a + b.netProfit, 0);
  
  // End AUM for the 'Total' column is just the final quarter's End AUM
  const endAumTotal = calculatedData[calculatedData.length - 1].endAum;
  // Start AUM for the 'Total' column is the first quarter's Start AUM
  const startAumTotal = calculatedData[0].startAum;

  const renderCurrencyCell = (val: number, isCurrency = true) => (
    <span className="font-mono text-xs">
      {isCurrency ? formatCurrency(val) : val}
    </span>
  );

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-100">Quarterly Breakdown & Inputs (5 Years)</h3>
        <span className="text-xs text-brand-400 bg-brand-950/50 border border-brand-900 px-3 py-1 rounded-full">Quarters as Columns</span>
      </div>
      
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm border-collapse min-w-max">
          <thead className="bg-slate-950/90 sticky top-0 z-30 backdrop-blur-sm shadow-sm shadow-slate-900/50">
            <tr>
              <th className="sticky left-0 z-40 bg-slate-950 border-b border-r border-slate-800 p-4 font-semibold text-slate-300 min-w-[200px]">
                Metric
              </th>
              {calculatedData.map((row) => (
                <th key={row.quarterLabel} className="p-4 font-semibold text-slate-400 border-b border-slate-800 text-right min-w-[100px]">
                  {row.quarterLabel}
                </th>
              ))}
              <th className="p-4 font-semibold text-slate-100 border-b border-l border-slate-800 text-right min-w-[140px] bg-slate-900/50">
                Total / End
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            
            {/* Input: Net Flows */}
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="sticky left-0 z-20 bg-slate-950 border-r border-slate-800 p-4 font-medium text-brand-400">
                Net Flows (Input)
              </td>
              {inputs.map((input, idx) => (
                <td key={`flow-${idx}`} className="p-3 border-r border-slate-800/30">
                  <div className="relative rounded transition-all ring-1 ring-slate-800 focus-within:ring-brand-500">
                    <input
                      type="number"
                      value={input.changeInAum}
                      onChange={(e) => onInputChange(idx, 'changeInAum', Number(e.target.value))}
                      className="w-full bg-slate-950/30 border-none rounded px-1 py-1 text-slate-200 text-right focus:ring-0 outline-none text-[10px] font-mono"
                    />
                  </div>
                </td>
              ))}
              <td className="p-4 text-right font-mono text-brand-400 font-bold bg-slate-900/50 border-l border-slate-800">
                {formatCurrency(totalFlows)}
              </td>
            </tr>

            {/* Input: Opex */}
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="sticky left-0 z-20 bg-slate-950 border-r border-slate-800 p-4 font-medium text-brand-400">
                Operating Cost (Input)
              </td>
              {inputs.map((input, idx) => (
                <td key={`opex-${idx}`} className="p-3 border-r border-slate-800/30">
                  <div className="relative rounded transition-all ring-1 ring-slate-800 focus-within:ring-brand-500">
                    <input
                      type="number"
                      value={input.operatingCost}
                      onChange={(e) => onInputChange(idx, 'operatingCost', Number(e.target.value))}
                      className="w-full bg-slate-950/30 border-none rounded px-1 py-1 text-slate-200 text-right focus:ring-0 outline-none text-[10px] font-mono"
                    />
                  </div>
                </td>
              ))}
              <td className="p-4 text-right font-mono text-brand-400 font-bold bg-slate-900/50 border-l border-slate-800">
                {formatCurrency(totalOpex)}
              </td>
            </tr>

            {/* Separator Row */}
            <tr className="bg-slate-900/30">
              <td colSpan={calculatedData.length + 2} className="h-2"></td>
            </tr>

            {/* Calculated: Start AUM */}
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="sticky left-0 z-20 bg-slate-950 border-r border-slate-800 p-4 font-medium text-slate-400">
                Start AUM
              </td>
              {calculatedData.map((d, i) => (
                <td key={`start-${i}`} className="p-4 text-right text-slate-500 border-r border-slate-800/30">
                  {renderCurrencyCell(d.startAum)}
                </td>
              ))}
              <td className="p-4 text-right text-slate-500 border-l border-slate-800 bg-slate-900/50">
                {renderCurrencyCell(startAumTotal)}
              </td>
            </tr>

            {/* Calculated: Inv Growth */}
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="sticky left-0 z-20 bg-slate-950 border-r border-slate-800 p-4 font-medium text-slate-400">
                Investment Growth
              </td>
              {calculatedData.map((d, i) => (
                <td key={`growth-${i}`} className="p-4 text-right text-emerald-400/80 border-r border-slate-800/30">
                  +{renderCurrencyCell(d.investmentGrowth)}
                </td>
              ))}
              <td className="p-4 text-right text-emerald-400/80 font-bold border-l border-slate-800 bg-slate-900/50">
                +{renderCurrencyCell(totalGrowth)}
              </td>
            </tr>

            {/* Calculated: Revenue */}
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="sticky left-0 z-20 bg-slate-950 border-r border-slate-800 p-4 font-medium text-emerald-400">
                Revenue
              </td>
              {calculatedData.map((d, i) => (
                <td key={`rev-${i}`} className="p-4 text-right text-emerald-400 border-r border-slate-800/30">
                  {renderCurrencyCell(d.totalRevenue)}
                </td>
              ))}
              <td className="p-4 text-right text-emerald-400 font-bold border-l border-slate-800 bg-slate-900/50">
                {renderCurrencyCell(totalRevenue)}
              </td>
            </tr>

             {/* Calculated: Brokerage */}
             <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="sticky left-0 z-20 bg-slate-950 border-r border-slate-800 p-4 font-medium text-rose-400">
                Brokerage Expense
              </td>
              {calculatedData.map((d, i) => (
                <td key={`brok-${i}`} className="p-4 text-right text-rose-400 border-r border-slate-800/30">
                  {renderCurrencyCell(d.expenseBrokerage)}
                </td>
              ))}
              <td className="p-4 text-right text-rose-400 font-bold border-l border-slate-800 bg-slate-900/50">
                {renderCurrencyCell(totalBrokerage)}
              </td>
            </tr>

            {/* Calculated: Net Profit */}
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="sticky left-0 z-20 bg-slate-950 border-r border-slate-800 p-4 font-bold text-slate-200">
                Net Profit
              </td>
              {calculatedData.map((d, i) => (
                <td key={`prof-${i}`} className={`p-4 text-right font-bold border-r border-slate-800/30 ${d.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {renderCurrencyCell(d.netProfit)}
                </td>
              ))}
              <td className={`p-4 text-right font-bold border-l border-slate-800 bg-slate-900/50 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {renderCurrencyCell(totalProfit)}
              </td>
            </tr>

             {/* Calculated: End AUM */}
             <tr className="hover:bg-slate-800/20 transition-colors bg-slate-900/20">
              <td className="sticky left-0 z-20 bg-slate-950 border-r border-slate-800 p-4 font-bold text-slate-100">
                End AUM
              </td>
              {calculatedData.map((d, i) => (
                <td key={`end-${i}`} className="p-4 text-right text-slate-100 font-bold border-r border-slate-800/30">
                  {renderCurrencyCell(d.endAum)}
                </td>
              ))}
              <td className="p-4 text-right text-slate-100 font-bold border-l border-slate-800 bg-slate-900/50">
                {renderCurrencyCell(endAumTotal)}
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;