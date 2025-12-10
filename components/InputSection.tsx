import React, { useRef } from 'react';
import { SimulationConfig, Scenario } from '../types';
import { Settings, DollarSign, Percent, TrendingUp, Activity, BarChart2, Download, Upload } from 'lucide-react';

interface InputSectionProps {
  config: SimulationConfig;
  activeScenario: Scenario;
  scenarios: Scenario[];
  onConfigChange: (newConfig: SimulationConfig) => void;
  onScenarioChange: (updatedScenario: Scenario) => void;
  onImport: (data: { config: SimulationConfig; scenarios: Scenario[] }) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ 
  config, 
  activeScenario, 
  scenarios,
  onConfigChange, 
  onScenarioChange,
  onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleConfigChange = (section: keyof SimulationConfig, field: string, value: any) => {
    if (section === 'brokerage' || section === 'performanceFee') {
      onConfigChange({
        ...config,
        [section]: {
          ...config[section],
          [field]: value
        }
      });
    } else {
      onConfigChange({
        ...config,
        [field]: value
      });
    }
  };

  const handleScenarioReturnChange = (value: number) => {
    onScenarioChange({
      ...activeScenario,
      estimatedAnnualReturn: value
    });
  };

  const handleExport = () => {
    const data = { config, scenarios };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "investor_pulse_model.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target?.result as string);
            onImport(json);
        } catch (error) {
            console.error("Error parsing JSON", error);
            alert("Error parsing JSON file. Please ensure it is a valid export file.");
        }
    };
    reader.readAsText(fileObj);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 h-full overflow-y-auto p-6 w-full lg:w-96 flex-shrink-0 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-brand-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Configuration</h2>
            <p className="text-xs text-slate-400">Model Parameters</p>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* Active Scenario Assumptions */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-400 flex items-center gap-2 mb-4">
              <BarChart2 className="w-3 h-3" /> {activeScenario.label} Assumptions
            </h3>
             <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Est. Annual Return (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={activeScenario.estimatedAnnualReturn}
                  onChange={(e) => handleScenarioReturnChange(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all pr-8"
                />
                <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Modifies the market performance assumption for the <strong>{activeScenario.label}</strong> scenario only.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-slate-800" />

          {/* Core Assets */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <DollarSign className="w-3 h-3" /> Global Settings (All Scenarios)
            </h3>
            
            <div className="group">
              <label className="block text-sm font-medium text-slate-300 mb-1">Starting AUM ($)</label>
              <input
                type="number"
                value={config.initialAum}
                onChange={(e) => handleConfigChange('initialAum', 'initialAum', Number(e.target.value))}
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
                  onChange={(e) => handleConfigChange('annualManagementFee', 'annualManagementFee', Number(e.target.value))}
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
                onClick={() => handleConfigChange('brokerage', 'type', 'PERCENTAGE')}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${config.brokerage.type === 'PERCENTAGE' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                % Based
              </button>
              <button
                onClick={() => handleConfigChange('brokerage', 'type', 'FLAT_PER_TRADE')}
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
                   onChange={(e) => handleConfigChange('brokerage', 'percentageFee', Number(e.target.value))}
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
                    onChange={(e) => handleConfigChange('brokerage', 'flatFeePerTrade', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Est. Trades / Month</label>
                  <input
                    type="number"
                    value={config.brokerage.estimatedTradesPerMonth}
                    onChange={(e) => handleConfigChange('brokerage', 'estimatedTradesPerMonth', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Applied as (Trades × 3) per quarter</p>
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
                  onChange={(e) => handleConfigChange('performanceFee', 'enabled', e.target.checked)}
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
                    onChange={(e) => handleConfigChange('performanceFee', 'performanceFeePercentage', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Hurdle Rate (Annual %)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.performanceFee.hurdleRate}
                    onChange={(e) => handleConfigChange('performanceFee', 'hurdleRate', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import / Export Actions */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            Data Management
        </h3>
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2.5 rounded-lg border border-slate-700 transition-all hover:shadow-lg"
            >
                <Download className="w-3.5 h-3.5" />
                Export Data
            </button>
            <button 
                onClick={handleImportClick}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2.5 rounded-lg border border-slate-700 transition-all hover:shadow-lg"
            >
                <Upload className="w-3.5 h-3.5" />
                Import Data
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleFileChange}
            />
        </div>
      </div>

    </div>
  );
};

export default InputSection;