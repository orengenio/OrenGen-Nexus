import React, { useState } from 'react';
import { Bot, Code, Play, Save, Settings, MessageSquare, Terminal as TerminalIcon } from 'lucide-react';
import { generateText } from '../services/geminiService';

interface Agent {
  id: string;
  name: string;
  model: string;
  instructions: string;
  status: 'active' | 'draft';
}

const mockAgents: Agent[] = [
  { id: '1', name: 'Sales Closer V1', model: 'gemini-3-pro-preview', instructions: 'You are a high-energy sales representative...', status: 'active' },
  { id: '2', name: 'Support Triege', model: 'gemini-3-flash-preview', instructions: 'Analyze incoming tickets and categorize...', status: 'active' },
  { id: '3', name: 'Data Analyst', model: 'gemini-3-pro-preview', instructions: 'Convert natural language to SQL...', status: 'draft' },
];

export const AgentStudio: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(mockAgents[0]);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const response = await generateText(testInput, selectedAgent.model, selectedAgent.instructions);
      setTestOutput(response || 'No response');
    } catch (e) {
      setTestOutput('Error executing agent.');
    } finally {
      setIsTesting(false);
    }
  };

  const updateInstruction = (text: string) => {
    const updated = { ...selectedAgent, instructions: text };
    setSelectedAgent(updated);
    setAgents(agents.map(a => a.id === updated.id ? updated : a));
  };

  return (
    <div className="flex h-full w-full p-4 gap-4 animate-in fade-in duration-500">
      {/* Sidebar List */}
      <div className="w-64 glass-panel border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
           <h2 className="font-bold text-white flex items-center gap-2">
             <Bot className="text-orange-500" /> Agent Studio
           </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
           {agents.map(agent => (
             <button
               key={agent.id}
               onClick={() => { setSelectedAgent(agent); setTestOutput(''); setTestInput(''); }}
               className={`w-full text-left p-3 rounded-lg border transition-all ${
                 selectedAgent.id === agent.id 
                 ? 'bg-orange-500/10 border-orange-500/50 text-orange-100' 
                 : 'bg-zinc-900/30 border-transparent hover:bg-zinc-800 text-zinc-400'
               }`}
             >
                <div className="font-medium">{agent.name}</div>
                <div className="text-xs opacity-60 font-mono mt-1">{agent.model}</div>
             </button>
           ))}
        </div>
        <div className="p-2">
          <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors">
            + Create Agent
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col gap-4">
         {/* Configuration */}
         <div className="glass-panel p-6 rounded-xl border border-zinc-800 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-3">
                  <input 
                    className="bg-transparent text-xl font-bold text-white focus:outline-none border-b border-transparent focus:border-zinc-700"
                    value={selectedAgent.name}
                    onChange={(e) => setSelectedAgent({...selectedAgent, name: e.target.value})}
                  />
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                    {selectedAgent.status}
                  </span>
               </div>
               <div className="flex gap-2">
                  <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"><Settings size={18} /></button>
                  <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                     <Save size={16} /> Deploy
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase flex items-center gap-2">
                     <Code size={14} /> System Instructions
                  </label>
                  <textarea 
                    className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 focus:outline-none focus:border-orange-500 resize-none"
                    value={selectedAgent.instructions}
                    onChange={(e) => updateInstruction(e.target.value)}
                  />
               </div>
               <div className="flex flex-col gap-2">
                   <div className="bg-zinc-900 rounded-lg border border-zinc-800 flex-1 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
                         <span className="text-xs font-medium text-zinc-500 uppercase flex items-center gap-2">
                            <TerminalIcon size={14} /> Sandbox
                         </span>
                         <select 
                           value={selectedAgent.model}
                           onChange={(e) => setSelectedAgent({...selectedAgent, model: e.target.value})}
                           className="bg-zinc-900 text-xs text-zinc-400 border-none outline-none"
                         >
                            <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                            <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                         </select>
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto">
                         {testOutput ? (
                           <div className="prose prose-invert text-sm max-w-none">
                              <p className="whitespace-pre-wrap">{testOutput}</p>
                           </div>
                         ) : (
                           <div className="h-full flex flex-col items-center justify-center text-zinc-700">
                              <Bot size={32} className="mb-2" />
                              <p>Run a test to see output</p>
                           </div>
                         )}
                      </div>
                      <div className="p-2 border-t border-zinc-800 bg-zinc-950 flex gap-2">
                         <input 
                           className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-zinc-700"
                           placeholder="Test input..."
                           value={testInput}
                           onChange={(e) => setTestInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleTest()}
                         />
                         <button 
                           onClick={handleTest}
                           disabled={isTesting}
                           className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                         >
                            {isTesting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={16} />}
                         </button>
                      </div>
                   </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};