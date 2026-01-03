import React from 'react';
import { 
  Activity, TrendingUp, Users, Server, AlertTriangle, 
  DollarSign, Globe, Zap, Cpu
} from 'lucide-react';

export const ControlRoom: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Control Room</h2>
          <p className="text-zinc-400 text-sm">System-wide telemetry and operational status.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           <span className="text-xs font-mono text-emerald-500">SYSTEM OPTIMAL</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Recurring Revenue', value: '$124,592', change: '+12.5%', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Active Active Users', value: '8,492', change: '+5.2%', icon: Users, color: 'text-blue-500' },
          { label: 'System Load (Avg)', value: '42%', change: '-2.1%', icon: Cpu, color: 'text-orange-500' },
          { label: 'Global Latency', value: '48ms', change: 'Stable', icon: Activity, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 rounded-xl border border-zinc-800">
             <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg bg-zinc-900 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-900 ${stat.change.includes('+') ? 'text-emerald-500' : 'text-zinc-400'}`}>
                  {stat.change}
                </span>
             </div>
             <div className="text-2xl font-bold text-white">{stat.value}</div>
             <div className="text-xs text-zinc-500 uppercase tracking-wide mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-zinc-800 flex flex-col">
           <h3 className="font-semibold text-zinc-200 mb-4 flex items-center gap-2">
             <TrendingUp size={16} className="text-orange-500" /> Revenue Velocity
           </h3>
           <div className="flex-1 flex items-end gap-2 h-64 border-b border-zinc-800 pb-2 relative">
              {/* Simulated Chart Bars */}
              {Array.from({ length: 24 }).map((_, i) => {
                 const height = Math.floor(Math.random() * 80) + 20;
                 return (
                    <div 
                      key={i} 
                      style={{ height: `${height}%` }} 
                      className="flex-1 bg-gradient-to-t from-orange-500/20 to-orange-500/80 rounded-t-sm hover:from-orange-400/40 hover:to-orange-400 transition-all cursor-pointer group relative"
                    >
                       <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-900 text-xs px-2 py-1 rounded border border-zinc-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                          ${height * 100}k
                       </div>
                    </div>
                 );
              })}
           </div>
           <div className="flex justify-between text-xs text-zinc-500 mt-2 font-mono">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:59</span>
           </div>
        </div>

        {/* Live Alerts */}
        <div className="glass-panel p-6 rounded-xl border border-zinc-800">
           <h3 className="font-semibold text-zinc-200 mb-4 flex items-center gap-2">
             <AlertTriangle size={16} className="text-red-500" /> Recent Alerts
           </h3>
           <div className="space-y-4">
              {[
                { title: 'High Latency: US-East', time: '2m ago', level: 'Critical', color: 'bg-red-500' },
                { title: 'Database Backup Completed', time: '1h ago', level: 'Info', color: 'bg-blue-500' },
                { title: 'New Creator Signup Surge', time: '3h ago', level: 'Growth', color: 'bg-emerald-500' },
                { title: 'API Rate Limit Approaching', time: '5h ago', level: 'Warning', color: 'bg-yellow-500' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                   <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.color}`} />
                   <div>
                      <div className="text-sm text-zinc-200 font-medium">{alert.title}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-2">
                        <span>{alert.time}</span>
                        <span>•</span>
                        <span>{alert.level}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Deployment Status */}
      <div className="glass-panel p-6 rounded-xl border border-zinc-800">
          <h3 className="font-semibold text-zinc-200 mb-4 flex items-center gap-2">
             <Server size={16} className="text-blue-500" /> Infrastructure Health
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Primary Cluster', 'Redis Cache', 'CDN Edge'].map((node, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-3">
                       <Zap size={16} className="text-zinc-500" />
                       <span className="text-sm font-mono text-zinc-300">{node}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                       </div>
                       <span className="text-xs text-emerald-500 font-medium">98%</span>
                    </div>
                 </div>
              ))}
           </div>
      </div>
    </div>
  );
};