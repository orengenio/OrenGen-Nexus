import React, { useState, useEffect } from 'react';
import { 
  Users, Building, Mail, Clock, MoreHorizontal, Sparkles, 
  ArrowRight, FileText, CheckCircle, AlertTriangle, RefreshCw, Send,
  Filter, Trophy
} from 'lucide-react';
import { Contact } from '../types';
import { generateText, generateJSON } from '../services/geminiService';
import { Type } from "@google/genai";

// Enhanced Mocks with Lead Scores
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Chen',
    role: 'CTO',
    company: 'TechNova Systems',
    email: 'alice@technova.io',
    status: 'Active',
    value: '$12k/mo',
    lastInteraction: '2 days ago',
    leadScore: 92,
    history: [
      { date: '2023-10-24', type: 'Call', note: 'Discussed API rate limits and scaling needs for Q4.' },
      { date: '2023-10-10', type: 'Email', note: 'Sent proposal for Enterprise tier upgrade.' },
      { date: '2023-09-15', type: 'Support', note: 'Resolved latency issue on US-East cluster.' }
    ]
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    role: 'Director of Eng',
    company: 'Vanta Dynamics',
    email: 'm.thorne@vanta.com',
    status: 'Lead',
    value: '$5k/mo (Est)',
    lastInteraction: '1 week ago',
    leadScore: 65,
    history: [
      { date: '2023-10-20', type: 'Demo', note: 'Product demo with engineering team. Positive feedback on UI.' },
      { date: '2023-10-12', type: 'Inbound', note: 'Filled out contact form regarding security compliance.' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Miller',
    role: 'Founder',
    company: 'Bloom Retail',
    email: 'sarah@bloom.co',
    status: 'Risk',
    value: '$800/mo',
    lastInteraction: '3 weeks ago',
    leadScore: 35,
    history: [
      { date: '2023-10-01', type: 'Email', note: 'Asked about downgrading plan due to budget cuts.' },
      { date: '2023-09-20', type: 'Usage', note: 'Login frequency dropped by 40%.' }
    ]
  }
];

export const CRMDatabase: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [selectedContact, setSelectedContact] = useState<Contact>(mockContacts[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai'>('overview');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredContacts = contacts.filter(c => {
    if (scoreFilter === 'all') return true;
    if (scoreFilter === 'high') return (c.leadScore || 0) >= 70;
    if (scoreFilter === 'medium') return (c.leadScore || 0) >= 40 && (c.leadScore || 0) < 70;
    if (scoreFilter === 'low') return (c.leadScore || 0) < 40;
    return true;
  });

  const getScoreColor = (score?: number) => {
    if (score === undefined) return 'text-zinc-500 border-zinc-700';
    if (score >= 70) return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10';
    if (score >= 40) return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
    return 'text-red-500 border-red-500/50 bg-red-500/10';
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiInsight(null);
    setActiveTab('ai');

    const prompt = `
      Analyze the following CRM contact profile and history:
      ${JSON.stringify(selectedContact, null, 2)}

      Please provide a structured response in Markdown format with the following sections:
      1. **Sentiment & Risk Analysis**: Briefly assess the relationship health.
      2. **Recommended Actions**: 3 specific, actionable steps to take next.
      3. **Draft Email**: Write a personalized, professional email draft to the contact based on the context.
    `;

    try {
      const result = await generateText(prompt, 'gemini-3-pro-preview', 'You are an expert Sales & CRM AI Assistant. Be concise, strategic, and professional.');
      setAiInsight(result || "Could not generate insights.");
    } catch (e) {
      setAiInsight("Error generating analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCalculateScore = async () => {
    setIsAnalyzing(true);
    const prompt = `
      Evaluate the lead score (0-100) for this contact based on their history and profile.
      Return JSON: { "score": number, "reason": string }
      Profile: ${JSON.stringify(selectedContact)}
    `;

    try {
      const result = await generateJSON(prompt, {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER },
          reason: { type: Type.STRING }
        },
        required: ["score", "reason"]
      }, 'gemini-3-flash-preview');

      if (result && typeof result.score === 'number') {
        const updatedContacts = contacts.map(c => 
          c.id === selectedContact.id ? { ...c, leadScore: result.score } : c
        );
        setContacts(updatedContacts);
        setSelectedContact({ ...selectedContact, leadScore: result.score });
        setAiInsight(`**Score Updated: ${result.score}**\n\nReasoning: ${result.reason}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-full w-full gap-4 p-4 animate-in fade-in duration-500">
      {/* List Column */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-orange-500" /> Contacts
          </h2>
          <div className="flex gap-2">
             <div className="relative group">
                <button className="p-1 hover:bg-zinc-800 rounded text-zinc-400">
                   <Filter size={16} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-20">
                   {['all', 'high', 'medium', 'low'].map(f => (
                     <button 
                       key={f} 
                       onClick={() => setScoreFilter(f as any)}
                       className={`w-full text-left px-3 py-2 text-xs uppercase font-medium hover:bg-zinc-800 ${scoreFilter === f ? 'text-orange-500' : 'text-zinc-400'}`}
                     >
                       {f} Score
                     </button>
                   ))}
                </div>
             </div>
             <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full">{filteredContacts.length}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredContacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setAiInsight(null);
                setActiveTab('overview');
              }}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                selectedContact.id === contact.id 
                  ? 'bg-orange-500/10 border-orange-500/50' 
                  : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <h3 className="font-semibold text-zinc-100">{contact.name}</h3>
                    <div className="text-sm text-zinc-400 mb-1">{contact.role} @ {contact.company}</div>
                </div>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${getScoreColor(contact.leadScore)}`}>
                    {contact.leadScore ?? '?'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    contact.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    contact.status === 'Risk' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    {contact.status}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3 h-3" /> {contact.lastInteraction}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Column */}
      <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-zinc-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-2xl font-bold text-zinc-400 border border-zinc-700">
              {selectedContact.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">{selectedContact.name}</h1>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono border ${getScoreColor(selectedContact.leadScore)}`}>
                     Score: {selectedContact.leadScore ?? 'N/A'}
                  </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 mt-1">
                <Building className="w-4 h-4" /> {selectedContact.company}
                <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                <Mail className="w-4 h-4" /> {selectedContact.email}
              </div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-sm text-zinc-500 mb-1">Monthly Value</div>
             <div className="text-xl font-mono text-emerald-400">{selectedContact.value}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-zinc-800 mb-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-zinc-400 hover:text-white'}`}
          >
            Overview & History
          </button>
          <button 
             onClick={() => setActiveTab('ai')}
             className={`pb-2 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-zinc-400 hover:text-white'}`}
          >
            <Sparkles className="w-4 h-4" /> AI Intelligence
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Interaction History</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                  {selectedContact.history.map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 group-hover:bg-zinc-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {item.type === 'Call' && <Users className="w-4 h-4 text-blue-400" />}
                          {item.type === 'Email' && <Mail className="w-4 h-4 text-orange-400" />}
                          {item.type === 'Support' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                          {item.type === 'Demo' && <Play className="w-4 h-4 text-purple-400" />}
                          {item.type === 'Usage' && <Activity className="w-4 h-4 text-green-400" />}
                          {item.type === 'Inbound' && <ArrowRight className="w-4 h-4 text-emerald-400" />}
                       </div>
                       <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 shadow hover:border-zinc-700 transition-colors">
                          <div className="flex items-center justify-between space-x-2 mb-1">
                             <div className="font-bold text-zinc-200">{item.type}</div>
                             <time className="font-mono text-xs text-zinc-500">{item.date}</time>
                          </div>
                          <div className="text-zinc-400 text-sm">{item.note}</div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
               {!aiInsight && !isAnalyzing && (
                 <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                    <Sparkles className="w-12 h-12 text-zinc-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Generate AI Insights</h3>
                    <p className="text-zinc-400 mb-6 max-w-md">
                      Let OrenGen analyze interaction history, detect sentiment, and draft your next follow-up.
                    </p>
                    <div className="flex gap-3">
                        <button 
                        onClick={handleCalculateScore}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 border border-zinc-700"
                        >
                        <Trophy className="w-4 h-4" /> Calculate Score
                        </button>
                        <button 
                        onClick={handleAnalyze}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2"
                        >
                        <Sparkles className="w-4 h-4" /> Full Analysis
                        </button>
                    </div>
                 </div>
               )}

               {isAnalyzing && (
                 <div className="flex flex-col items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mb-4" />
                    <p className="text-zinc-400 animate-pulse">Running analysis models...</p>
                 </div>
               )}

               {aiInsight && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Bot className="w-32 h-32" />
                       </div>
                       
                       <div className="prose prose-invert prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">
                            {aiInsight}
                          </pre>
                       </div>

                       <div className="mt-6 pt-6 border-t border-zinc-800 flex gap-3">
                          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                             <FileText className="w-4 h-4" /> Save to Notes
                          </button>
                          <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-md transition-colors text-sm">
                             <Send className="w-4 h-4" /> Send Email
                          </button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple Icon helpers to avoid import errors if not all are present in main Lucide import
import { Play, Activity, Bot } from 'lucide-react';