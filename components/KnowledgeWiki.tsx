import React, { useState } from 'react';
import { Book, ChevronRight, FileText, Search, Plus } from 'lucide-react';

export const KnowledgeWiki: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState('Welcome');

  return (
    <div className="flex h-full animate-in fade-in duration-500">
       {/* Sidebar */}
       <div className="w-64 border-r border-zinc-800 bg-zinc-900/30 p-4 flex flex-col">
          <div className="mb-4 relative">
             <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
             <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-700" placeholder="Search..." />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1">
             <div className="text-xs font-bold text-zinc-600 uppercase mb-2 px-2">General</div>
             {['Welcome', 'Getting Started', 'Architecture'].map(doc => (
                <button 
                  key={doc}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 ${selectedDoc === doc ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
                >
                   <FileText size={14} /> {doc}
                </button>
             ))}
             
             <div className="text-xs font-bold text-zinc-600 uppercase mt-4 mb-2 px-2">Engineering</div>
             {['API Reference', 'Deployment Guide', 'Database Schema'].map(doc => (
                <button 
                  key={doc}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 ${selectedDoc === doc ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
                >
                   <FileText size={14} /> {doc}
                </button>
             ))}
          </div>
          
          <button className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-zinc-700 rounded-lg text-zinc-500 hover:text-white hover:border-zinc-500 text-sm mt-4">
             <Plus size={14} /> New Page
          </button>
       </div>

       {/* Content */}
       <div className="flex-1 p-8 overflow-y-auto bg-zinc-950">
          <div className="max-w-3xl mx-auto">
             <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                <span>Wiki</span>
                <ChevronRight size={14} />
                <span className="text-zinc-300">{selectedDoc}</span>
             </div>
             
             <h1 className="text-4xl font-bold text-white mb-6">{selectedDoc}</h1>
             
             <div className="prose prose-invert prose-lg max-w-none text-zinc-300">
                <p className="lead">
                   Welcome to the OrenGen Nexus Knowledge Base. This centralized repository stores all operational procedures, technical documentation, and strategic assets.
                </p>
                <hr className="border-zinc-800 my-8" />
                <h3>Overview</h3>
                <p>
                   This system is designed to be the single source of truth for the organization.
                   Utilize the AI Agent in the sidebar to summarize long documents or generate new content based on existing wikis.
                </p>
                <div className="bg-zinc-900 p-4 rounded-lg border-l-4 border-orange-500 my-6">
                   <strong>Pro Tip:</strong> You can reference these documents in the Agent Studio to ground your AI agents in company data.
                </div>
                <h3>Key Resources</h3>
                <ul className="list-disc pl-5 space-y-2">
                   <li>System Architecture Diagrams</li>
                   <li>API Authentication Protocols</li>
                   <li>Brand Voice Guidelines</li>
                </ul>
             </div>
          </div>
       </div>
    </div>
  );
};