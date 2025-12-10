import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { CalculatedQuarter } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ScenarioResult {
  id: string;
  label: string;
  color: string;
  data: CalculatedQuarter[];
}

interface ChartsSectionProps {
  allScenariosData: ScenarioResult[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg shadow-xl">
        <p className="text-slate-200 font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.stroke }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }}></span>
            <span>{entry.name}:</span>
            <span className="font-mono font-medium">{formatCurrency(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ allScenariosData }) => {
  
  const comparisonData = useMemo(() => {
    if (!allScenariosData.length) return [];
    const baseData = allScenariosData[0].data;
    
    return baseData.map((_, index) => {
      const row: any = {
        quarterLabel: baseData[index].quarterLabel,
      };
      allScenariosData.forEach(s => {
        row[s.id] = s.data[index].netProfit;
      });
      return row;
    });
  }, [allScenariosData]);

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Area Chart: Net Profit Comparison */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Net Profit Growth Trend (Scenario Comparison)</h3>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">5 Year Forecast</span>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={comparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPessimistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="quarterLabel" 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={1}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {allScenariosData.map((scenario) => (
                <Area 
                  key={scenario.id}
                  type="monotone" 
                  dataKey={scenario.id} 
                  name={scenario.label} 
                  stroke={scenario.color} 
                  fillOpacity={1} 
                  fill={`url(#color${scenario.label})`} 
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;