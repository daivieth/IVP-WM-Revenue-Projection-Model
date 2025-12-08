import React, { useState, useMemo } from 'react';
import { SimulationConfig, MonthlyInput } from './types';
import { DEFAULT_CONFIG, DEFAULT_MONTHLY_INPUTS } from './constants';
import { calculateSimulation } from './utils/calculations';
import InputSection from './components/InputSection';
import ChartsSection from './components/ChartsSection';
import DataTable from './components/DataTable';
import SummaryCards from './components/SummaryCards';
import { LayoutDashboard, BarChart3, Table as TableIcon } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [monthlyInputs, setMonthlyInputs] = useState<MonthlyInput[]>(DEFAULT_MONTHLY_INPUTS);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown'>('overview');

  // Calculate the simulation data whenever config or inputs change
  const simulationData = useMemo(() => {
    return calculateSimulation(config, monthlyInputs);
  }, [config, monthlyInputs]);

  const handleInputChange = (monthIndex: number, field: keyof MonthlyInput, value: number) => {
    setMonthlyInputs(prev => {
      const newInputs = [...prev];
      newInputs[monthIndex] = {
        ...newInputs[monthIndex],
        [field]: value
      };
      return newInputs;
    });
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar / Configuration Panel */}
      <InputSection config={config} onChange={setConfig} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background Gradients for Aesthetics */}
        <div className="absolute top-0 left-0 w-full h-96 bg-brand-900/10 blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between z-10 flex-shrink-0">
            <div className="flex items-center gap-3">
                 <div className="bg-gradient-to-br from-brand-500 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-brand-500/20">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Investor Pulse</h1>
                    <p className="text-sm text-slate-400 font-medium">Wealth Management Division — Revenue Projection Model</p>
                 </div>
            </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 z-10 custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto h-full flex flex-col w-full">
                
                {/* Summary Cards - Always Visible for Context */}
                <SummaryCards data={simulationData} />

                {/* Tabs Navigation */}
                <div className="flex items-center space-x-1 border-b border-slate-800 mb-6 flex-shrink-0">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                      activeTab === 'overview' 
                        ? 'border-brand-500 text-brand-400' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('breakdown')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                      activeTab === 'breakdown' 
                        ? 'border-brand-500 text-brand-400' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <TableIcon className="w-4 h-4" />
                    Monthly Breakdown
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 min-h-0 flex flex-col">
                  {activeTab === 'overview' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <ChartsSection data={simulationData} />
                    </div>
                  ) : (
                    <div className="flex-1 min-h-0 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <DataTable 
                          inputs={monthlyInputs} 
                          calculatedData={simulationData} 
                          onInputChange={handleInputChange} 
                      />
                    </div>
                  )}
                </div>
                
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;
