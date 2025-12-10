import React, { useState, useMemo } from 'react';
import { SimulationConfig, QuarterlyInput, Scenario, ScenarioType } from './types';
import { DEFAULT_CONFIG, DEFAULT_SCENARIOS } from './constants';
import { calculateSimulation } from './utils/calculations';
import InputSection from './components/InputSection';
import ChartsSection from './components/ChartsSection';
import DataTable from './components/DataTable';
import SummaryCards from './components/SummaryCards';
import { LayoutDashboard, BarChart3, Table as TableIcon, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioType>('median');
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown'>('overview');

  const activeScenario = useMemo(() => 
    scenarios.find(s => s.id === activeScenarioId)!, 
  [scenarios, activeScenarioId]);

  // Calculate the simulation data for the ACTIVE Scenario
  const simulationData = useMemo(() => {
    return calculateSimulation(config, activeScenario);
  }, [config, activeScenario]);

  // Calculate data for ALL scenarios for comparison charts
  const allScenariosData = useMemo(() => {
    return scenarios.map(s => ({
      id: s.id,
      label: s.label,
      color: s.color,
      data: calculateSimulation(config, s)
    }));
  }, [config, scenarios]);

  const handleScenarioChange = (updatedScenario: Scenario) => {
    setScenarios(prev => prev.map(s => s.id === updatedScenario.id ? updatedScenario : s));
  };

  const handleImportData = (data: { config: SimulationConfig; scenarios: Scenario[] }) => {
    if (data.config && Array.isArray(data.scenarios)) {
      setConfig(data.config);
      setScenarios(data.scenarios);
    } else {
      alert('Invalid data format');
    }
  };

  const handleInputChange = (quarterIndex: number, field: keyof QuarterlyInput, value: number) => {
    const updatedInputs = [...activeScenario.inputs];
    updatedInputs[quarterIndex] = {
      ...updatedInputs[quarterIndex],
      [field]: value
    };
    
    handleScenarioChange({
      ...activeScenario,
      inputs: updatedInputs
    });
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar / Configuration Panel */}
      <InputSection 
        config={config} 
        activeScenario={activeScenario}
        scenarios={scenarios}
        onConfigChange={setConfig} 
        onScenarioChange={handleScenarioChange}
        onImport={handleImportData}
      />

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
            <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-500">Scenario</p>
                    <p className="text-sm font-mono font-bold text-brand-400 uppercase">{activeScenarioId}</p>
                 </div>
                 <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-brand-400">
                    WM
                 </div>
            </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 z-10 custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto h-full flex flex-col w-full">
                
                {/* Scenario Tabs */}
                <div className="mb-6 flex space-x-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800 w-fit backdrop-blur-md">
                  {scenarios.map((scenario) => {
                    const isActive = activeScenarioId === scenario.id;
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => setActiveScenarioId(scenario.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <Layers className={`w-4 h-4 ${isActive ? 'text-white' : scenario.id === 'pessimistic' ? 'text-rose-400' : scenario.id === 'median' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                        {scenario.label}
                      </button>
                    )
                  })}
                </div>

                {/* Summary Cards - Always Visible for Context */}
                <SummaryCards data={simulationData} />

                {/* View Tabs Navigation */}
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
                    Quarterly Breakdown
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 min-h-0 flex flex-col">
                  {activeTab === 'overview' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <ChartsSection 
                        allScenariosData={allScenariosData}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-h-0 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <DataTable 
                          inputs={activeScenario.inputs} 
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