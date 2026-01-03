import React from 'react';
import { 
  Calendar as CalIcon, Plus, Layout, Type, Globe, 
  Users, Video, GraduationCap 
} from 'lucide-react';

interface GrowthSuiteProps {
  view: string;
}

export const GrowthSuite: React.FC<GrowthSuiteProps> = ({ view }) => {
  
  const renderCalendar = () => (
    <div className="h-full flex flex-col p-6">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2"><CalIcon className="text-orange-500" /> Universal Calendar</h2>
          <div className="flex gap-2">
             <button className="px-3 py-1 bg-zinc-800 rounded text-sm">Week</button>
             <button className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-sm text-zinc-500">Month</button>
          </div>
       </div>
       <div className="flex-1 glass-panel border border-zinc-800 rounded-xl overflow-hidden grid grid-cols-7 grid-rows-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
             <div key={day} className="border-r border-zinc-800 last:border-r-0 bg-zinc-900/30">
                <div className="p-2 text-center text-xs font-medium text-zinc-500 border-b border-zinc-800 uppercase">{day}</div>
                <div className="p-2 space-y-2">
                   {i === 1 && (
                      <div className="p-2 rounded bg-blue-500/20 border border-blue-500/30 text-xs text-blue-200">
                         <div className="font-bold">Team Sync</div>
                         <div className="opacity-70">10:00 AM</div>
                      </div>
                   )}
                   {i === 3 && (
                      <div className="p-2 rounded bg-orange-500/20 border border-orange-500/30 text-xs text-orange-200">
                         <div className="font-bold">Product Launch</div>
                         <div className="opacity-70">2:00 PM</div>
                      </div>
                   )}
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderProject = () => (
     <div className="h-full p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Layout className="text-purple-500" /> Active Projects</h2>
        <div className="flex gap-4 h-[calc(100%-4rem)] w-max">
           {['Backlog', 'In Progress', 'Review', 'Done'].map(status => (
              <div key={status} className="w-80 glass-panel border border-zinc-800 rounded-xl flex flex-col bg-zinc-900/20">
                 <div className="p-4 font-bold text-zinc-300 border-b border-zinc-800 flex justify-between">
                    {status}
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">3</span>
                 </div>
                 <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    {[1, 2, 3].map(n => (
                       <div key={n} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow-sm hover:border-zinc-600 cursor-pointer transition-colors">
                          <div className="text-sm text-white font-medium mb-1">Implement new feature {n}</div>
                          <div className="flex items-center gap-2">
                             <div className="px-2 py-0.5 rounded text-[10px] bg-blue-900 text-blue-300">Dev</div>
                             <div className="w-5 h-5 rounded-full bg-zinc-700 ml-auto" />
                          </div>
                       </div>
                    ))}
                    <button className="w-full py-2 border border-dashed border-zinc-700 rounded text-zinc-500 text-sm hover:text-zinc-300 hover:border-zinc-500">
                       + Add Task
                    </button>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  return (
    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {view.includes('Calendar') && renderCalendar()}
      {view.includes('Project') && renderProject()}
      {view.includes('Form') && (
         <div className="p-12 text-center">
            <Type size={48} className="mx-auto text-zinc-600 mb-4" />
            <h2 className="text-2xl font-bold text-white">AI Form Generator</h2>
            <p className="text-zinc-400 mb-6">Describe your form and AI will build it instantly.</p>
            <div className="max-w-md mx-auto relative">
               <input className="w-full bg-zinc-900 border border-zinc-700 rounded-full px-4 py-3 pr-12 text-white focus:outline-none focus:border-orange-500" placeholder="e.g. A registration form for a yoga retreat..." />
               <button className="absolute right-2 top-2 p-1 bg-orange-600 rounded-full text-white"><Plus size={16} /></button>
            </div>
         </div>
      )}
      {view.includes('Web') && (
         <div className="p-6 grid grid-cols-3 gap-6">
            {[1,2,3].map(i => (
               <div key={i} className="glass-panel border border-zinc-800 rounded-xl aspect-video flex flex-col items-center justify-center group cursor-pointer hover:border-zinc-600">
                  <Globe size={32} className="text-zinc-600 mb-2 group-hover:text-blue-500 transition-colors" />
                  <span className="font-medium text-zinc-400 group-hover:text-white">Landing Page V{i}</span>
               </div>
            ))}
            <div className="border border-dashed border-zinc-800 rounded-xl aspect-video flex items-center justify-center text-zinc-600 hover:text-orange-500 hover:border-orange-500 cursor-pointer transition-all">
               + New Funnel
            </div>
         </div>
      )}
      {view.includes('Community') && (
         <div className="p-6 flex flex-col h-full items-center justify-center text-zinc-500">
            <GraduationCap size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-bold text-zinc-300">Course & Community Hub</h2>
            <p>Manage members, video content, and discussions.</p>
         </div>
      )}
    </div>
  );
};