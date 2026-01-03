import React, { useState } from 'react';
import { 
  LayoutGrid, Database, Calendar, Book, TrendingUp, Plus, PenTool, 
  Users, Globe, FileInput, Command, GraduationCap, Lock, Server, 
  Settings, Key, FolderOpen, Code, Menu, ChevronLeft, Terminal as TerminalIcon
} from 'lucide-react';
import { FossRegistry } from './components/FossRegistry';
import { TerminalComponent } from './components/TerminalComponent';
import { TerminalPage } from './components/TerminalPage';
import { NexusAgent } from './components/NexusAgent';
import { CRMDatabase } from './components/CRMDatabase'; 
import { MarketingStudio } from './components/MarketingStudio';
import { ControlRoom } from './components/ControlRoom';
import { AgentStudio } from './components/AgentStudio';
import { KnowledgeWiki } from './components/KnowledgeWiki';
import { SystemSuite } from './components/SystemSuite';
import { GrowthSuite } from './components/GrowthSuite';
import { ServiceItem, ViewState } from './types';

// Sidebar Navigation Data
const navItems = [
  { section: 'ORENGEN NEXUS', items: [
    { label: 'Control Room', icon: LayoutGrid },
    { label: 'CRM Database', icon: Database },
    { label: 'Universal Calendar', icon: Calendar },
    { label: 'Knowledge Wiki', icon: Book },
  ]},
  { section: 'growth', items: [
    { label: 'New Project', icon: Plus },
    { label: 'Brand & Press', icon: PenTool },
    { label: 'UGC / Creator', icon: Users },
    { label: 'Web & Funnel', icon: Globe },
    { label: 'Form Generator', icon: FileInput },
    { label: 'Omni-Channel Ops', icon: Command },
    { label: 'Community & Courses', icon: GraduationCap },
  ]},
  { section: 'federal', items: [
    { label: 'infrastructure', icon: Server }, 
    { label: 'Integrations Hub', icon: FolderOpen },
  ]},
  { section: 'system', items: [
    { label: 'Terminal', icon: TerminalIcon },
    { label: 'FOSS Registry', icon: Server },
    { label: 'Vault (Secrets)', icon: Lock },
    { label: 'Automation (n8n)', icon: Settings },
    { label: 'Data & Sheets', icon: Database },
    { label: 'Agent Studio', icon: Code },
    { label: 'API & Developers', icon: Key },
    { label: 'Settings', icon: Settings },
  ]}
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('Control Room');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalService, setTerminalService] = useState<ServiceItem | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleOpenTerminal = (service: ServiceItem) => {
    setTerminalService(service);
    setTerminalOpen(true);
  };

  const handleGlobalTerminal = () => {
    setTerminalService(undefined);
    setTerminalOpen(true);
  };

  const renderContent = () => {
    // Exact Match Routing
    switch(activeView) {
      case 'Control Room': return <ControlRoom />;
      case 'CRM Database': return <CRMDatabase />;
      case 'Knowledge Wiki': return <KnowledgeWiki />;
      case 'Agent Studio': return <AgentStudio />;
      case 'Terminal': return <TerminalPage />;
      
      case 'FOSS Registry':
      case 'infrastructure':
        return <FossRegistry onDeploy={() => {}} onOpenTerminal={handleOpenTerminal} />;
      
      case 'Brand & Press':
      case 'UGC / Creator':
        return <MarketingStudio />;
    }

    // Pattern Matching for Suites
    if (['Vault', 'Automation', 'Data', 'API', 'Settings', 'Integrations'].some(k => activeView.includes(k))) {
      return <SystemSuite view={activeView} />;
    }

    if (['Calendar', 'Project', 'Web', 'Form', 'Omni', 'Community'].some(k => activeView.includes(k) || activeView === 'New Project')) {
       return <GrowthSuite view={activeView} />;
    }

    // Fallback
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 animate-in fade-in zoom-in-95">
        <Database size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-medium text-zinc-400">{activeView}</h2>
        <p className="text-sm mt-2">Module initializing...</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 border-r border-zinc-800 bg-[#0c0c0e] flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-zinc-800 h-16">
          {sidebarOpen && (
            <h1 className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
              NEXUS
            </h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-zinc-800 rounded">
            {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-6">
          {navItems.map((group, idx) => (
            <div key={idx}>
              {sidebarOpen && (
                <h3 className="text-[10px] uppercase font-bold text-zinc-600 mb-2 px-2 tracking-widest">
                  {group.section}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveView(item.label)}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-all ${
                      activeView === item.label 
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <item.icon size={18} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* User Profile Stub */}
        <div className="p-4 border-t border-zinc-800">
           <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center font-bold text-xs">
                SA
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">SUPER ADMIN</p>
                  <p className="text-xs text-zinc-500">nexus@orengen.io</p>
                </div>
              )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        {/* Top Bar */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 text-zinc-400">
            <button className="text-sm font-medium hover:text-white transition-colors">Back</button>
            <span className="text-zinc-700">/</span>
            <div className="relative group">
               <Command className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
               <input 
                 type="text" 
                 placeholder="Command Nexus..." 
                 className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-orange-500/50 w-64 transition-all focus:w-80"
               />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button onClick={handleGlobalTerminal} className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-zinc-800 rounded-lg transition-colors">
                <Code size={20} />
             </button>
             <div className="h-4 w-px bg-zinc-800" />
             <span className="text-xs font-mono text-zinc-500">v2.5.0-rc1</span>
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto relative p-2">
           {renderContent()}
        </div>

        {/* Terminal Modal */}
        <TerminalComponent 
          isOpen={terminalOpen} 
          onClose={() => setTerminalOpen(false)} 
          title={terminalService ? `${terminalService.name} Console` : 'System Root'}
        />
      </main>

      {/* AI Sidebar (Always Visible) */}
      <div className="w-80 border-l border-zinc-800 bg-[#0c0c0e]">
        <NexusAgent />
      </div>

    </div>
  );
};

export default App;