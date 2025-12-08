import React from 'react';
import { SimulationConfig } from '../types';
import { Settings, DollarSign, Percent, TrendingUp, Activity } from 'lucide-react';

interface InputSectionProps {
  config: SimulationConfig;
  onChange: (newConfig: SimulationConfig) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ config, onChange }) => {
  
  const handleChange = (section: keyof SimulationConfig, field: string, value: any) => {
    if (section === 'brokerage' || section === 'performanceFee') {
      onChange({
        ...config,
        [section]: {
          ...config[section],
          [field]: value
        }
      });
    } else {
      onChange({
        ...config,
        [field]: value
      });
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 h-full overflow-y-auto p-6 w-full lg:w-96 flex-shrink-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-brand-600 rounded-lg">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Configuration</h2>
          <p className="text-xs text-slate-400">Division Parameters</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Core Assets */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <DollarSign className="w-3 h-3" /> Assets & Base Fees
          </h3>
          
          <div className="group">
            <label className="block text-sm font-medium text-slate-300 mb-1">Starting AUM ($)</label>
            <input
              type="number"
              value={config.initialAum}
              onChange={(e) => handleChange('initialAum', 'initialAum', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Annual Mgmt Fee (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={config.annualManagementFee}
                onChange={(e) => handleChange('annualManagementFee', 'annualManagementFee', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all pr-8"
              />
              <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Brokerage Config */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Settings className="w-3 h-3" /> Brokerage Costs
          </h3>
          
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-2">
            <button
              onClick={() => handleChange('brokerage', 'type', 'PERCENTAGE')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${config.brokerage.type === 'PERCENTAGE' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              % Based
            </button>
            <button
              onClick={() => handleChange('brokerage', 'type', 'FLAT_PER_TRADE')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${config.brokerage.type === 'FLAT_PER_TRADE' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Flat Rate
            </button>
          </div>

          {config.brokerage.type === 'PERCENTAGE' ? (
             <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Brokerage Fee (%)</label>
             <div className="relative">
               <input
                 type="number"
                 step="0.01"
                 value={config.brokerage.percentageFee}
                 onChange={(e) => handleChange('brokerage', 'percentageFee', Number(e.target.value))}
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all pr-8"
               />
               <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
             </div>
             <p className="text-xs text-slate-500 mt-1">Percentage of AUM paid annually</p>
           </div>
          ) : (
            <>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Cost Per Trade ($)</label>
                <input
                  type="number"
                  value={config.brokerage.flatFeePerTrade}
                  onChange={(e) => handleChange('brokerage', 'flatFeePerTrade', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Est. Trades / Month</label>
                <input
                  type="number"
                  value={config.brokerage.estimatedTradesPerMonth}
                  onChange={(e) => handleChange('brokerage', 'estimatedTradesPerMonth', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </>
          )}
        </div>

        {/* Performance Fee Config */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Performance Fees
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.performanceFee.enabled}
                onChange={(e) => handleChange('performanceFee', 'enabled', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          {config.performanceFee.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-slate-800 animate-in fade-in slide-in-from-left-2 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Perf. Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.performanceFee.performanceFeePercentage}
                  onChange={(e) => handleChange('performanceFee', 'performanceFeePercentage', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Hurdle Rate (Annual %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.performanceFee.hurdleRate}
                  onChange={(e) => handleChange('performanceFee', 'hurdleRate', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Est. Return (Annual %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.performanceFee.estimatedAnnualReturn}
                  onChange={(e) => handleChange('performanceFee', 'estimatedAnnualReturn', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSection;
