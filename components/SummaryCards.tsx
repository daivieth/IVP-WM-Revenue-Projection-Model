import React from 'react';
import { CalculatedQuarter } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, Wallet, Target, PieChart, DollarSign } from 'lucide-react';

interface SummaryCardsProps {
    data: CalculatedQuarter[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    const totalProfit = data.reduce((acc, curr) => acc + curr.netProfit, 0);
    const endAum = data[data.length - 1].endAum;
    // const totalFlows = data.reduce((acc, curr) => acc + curr.netFlows, 0); // Not used in top tiles anymore

    const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 text-sm font-medium">Projected End AUM</p>
                    <div className="p-2 bg-brand-500/10 rounded-lg">
                        <Wallet className="w-5 h-5 text-brand-400" />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(endAum)}</h3>
                    <p className="text-emerald-400 text-xs mt-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        After 8 Years
                    </p>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 text-sm font-medium">Total Revenue (8 Years)</p>
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</h3>
                    <p className="text-slate-500 text-xs mt-1">Gross Fees Collected</p>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 text-sm font-medium">Net Profit (8 Years)</p>
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Target className="w-5 h-5 text-indigo-400" />
                    </div>
                </div>
                <div>
                    <h3 className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-white' : 'text-rose-400'}`}>{formatCurrency(totalProfit)}</h3>
                    <p className="text-slate-500 text-xs mt-1">Total Earnings</p>
                </div>
            </div>

             <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 text-sm font-medium">Overall Profit Margin</p>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <PieChart className="w-5 h-5 text-blue-400" />
                    </div>
                </div>
                <div>
                    <h3 className={`text-2xl font-bold ${margin >= 0 ? 'text-white' : 'text-rose-400'}`}>
                        {margin.toFixed(1)}%
                    </h3>
                    <p className={`text-xs mt-1 ${margin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Avg. Margin
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SummaryCards;