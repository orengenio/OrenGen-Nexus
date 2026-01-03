import React, { useState } from 'react';
import { 
  Lock, Key, Eye, EyeOff, Settings, Database, 
  Workflow, Layers, ShieldCheck, ToggleLeft, ToggleRight
} from 'lucide-react';

interface SystemSuiteProps {
  view: string;
}

export const SystemSuite: React.FC<SystemSuiteProps> = ({ view }) => {
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  const toggleSecret = (id: string) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderVault = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><Lock className="text-orange-500" /> Vault</h2>
            <p className="text-zinc-400">Securely manage API keys, certificates, and environment secrets.</p>
          </div>
          <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
             + New Secret
          </button>
       </div>
       
       <div className="glass-panel border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-400">
             <thead className="bg-zinc-900/50 text-zinc-500 border-b border-zinc-800">
                <tr>
                   <th className="p-4 font-medium">Key Name</th>
                   <th className="p-4 font-medium">Service</th>
                   <th className="p-4 font-medium">Value</th>
                   <th className="p-4 font-medium">Last Accessed</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-zinc-800">
                {[
                   { id: '1', name: 'STRIPE_SECRET_KEY', service: 'Billing', val: 'sk_live_51Mz...', date: '2 mins ago' },
                   { id: '2', name: 'AWS_ACCESS_KEY', service: 'Infrastructure', val: 'AKIA...', date: '1 day ago' },
                   { id: '3', name: 'OPENAI_API_KEY', service: 'AI Core', val: 'sk-proj...', date: '4 hours ago' },
                ].map(secret => (
                   <tr key={secret.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4 font-mono text-zinc-300">{secret.name}</td>
                      <td className="p-4">{secret.service}</td>
                      <td className="p-4">
                         <div className="flex items-center gap-2">
                            <code className="bg-zinc-950 px-2 py-1 rounded text-xs border border-zinc-800 min-w-[120px]">
                               {showSecret[secret.id] ? secret.val : '••••••••••••••••'}
                            </code>
                            <button onClick={() => toggleSecret(secret.id)} className="text-zinc-500 hover:text-zinc-300">
                               {showSecret[secret.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                         </div>
                      </td>
                      <td className="p-4">{secret.date}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderAutomation = () => (
     <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><Workflow className="text-blue-500" /> Automation (n8n)</h2>
            <p className="text-zinc-400">Design automated workflows and recurring tasks.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
             Create Workflow
          </button>
       </div>
       <div className="flex-1 glass-panel border border-zinc-800 rounded-xl relative overflow-hidden bg-grid-zinc-900/50 [background-size:20px_20px]">
          {/* Mock Canvas */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex items-center gap-8">
                <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-xl flex items-center gap-3">
                   <div className="p-2 bg-green-500/20 rounded-lg text-green-500"><Database size={20} /></div>
                   <div>
                      <div className="font-bold text-white text-sm">New Lead</div>
                      <div className="text-xs text-zinc-400">Webhook Trigger</div>
                   </div>
                </div>
                <div className="w-12 h-0.5 bg-zinc-600 relative">
                   <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-zinc-600 rotate-45" />
                </div>
                <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-xl flex items-center gap-3">
                   <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500"><Settings size={20} /></div>
                   <div>
                      <div className="font-bold text-white text-sm">Enrich Data</div>
                      <div className="text-xs text-zinc-400">Clearbit API</div>
                   </div>
                </div>
                <div className="w-12 h-0.5 bg-zinc-600 relative">
                   <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-zinc-600 rotate-45" />
                </div>
                <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-xl flex items-center gap-3">
                   <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500"><Layers size={20} /></div>
                   <div>
                      <div className="font-bold text-white text-sm">Update CRM</div>
                      <div className="text-xs text-zinc-400">Postgres Write</div>
                   </div>
                </div>
             </div>
          </div>
       </div>
     </div>
  );

  const renderSettings = () => (
     <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
        
        <div className="glass-panel p-6 rounded-xl border border-zinc-800 space-y-6">
           <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                 <h3 className="font-medium text-white">Public Registration</h3>
                 <p className="text-sm text-zinc-400">Allow new users to sign up without an invite.</p>
              </div>
              <ToggleLeft size={32} className="text-zinc-600" />
           </div>
           
           <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                 <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                 <p className="text-sm text-zinc-400">Enforce 2FA for all admin accounts.</p>
              </div>
              <ToggleRight size={32} className="text-emerald-500" />
           </div>

           <div className="flex items-center justify-between">
              <div>
                 <h3 className="font-medium text-white">Maintenance Mode</h3>
                 <p className="text-sm text-zinc-400">Suspend all public-facing services.</p>
              </div>
              <ToggleLeft size={32} className="text-zinc-600" />
           </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-zinc-800">
            <h3 className="font-medium text-white mb-4">Danger Zone</h3>
            <button className="border border-red-500/50 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
               Flush All Caches
            </button>
        </div>
     </div>
  );

  return (
    <div className="p-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {view.includes('Vault') && renderVault()}
      {view.includes('Automation') && renderAutomation()}
      {view.includes('Settings') && renderSettings()}
      {view.includes('Integrations') && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Stripe', 'Slack', 'GitHub', 'Salesforce', 'HubSpot', 'Shopify'].map(name => (
               <div key={name} className="glass-panel p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <div className="font-bold text-white">{name}</div>
                  <button className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-white transition-colors">Connect</button>
               </div>
            ))}
         </div>
      )}
      {view.includes('API') && (
         <div className="glass-panel p-8 rounded-xl border border-zinc-800 text-center">
            <Key size={48} className="mx-auto text-zinc-600 mb-4" />
            <h2 className="text-xl font-bold text-white">Developer API</h2>
            <p className="text-zinc-400 mb-6">Manage API keys and webhooks for external integration.</p>
            <button className="bg-zinc-100 text-zinc-900 px-6 py-2 rounded-lg font-bold hover:bg-zinc-200">Generate New Key</button>
         </div>
      )}
    </div>
  );
};