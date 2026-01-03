import React from 'react';
import { Terminal, Database, Shield, Activity, Layers, FileText, Share2, Users, Clock, Play } from 'lucide-react';
import { ServiceItem } from '../types';

interface FossRegistryProps {
  onDeploy: () => void;
  onOpenTerminal: (service: ServiceItem) => void;
}

const services: ServiceItem[] = [
  { id: '1', name: 'Penpot', version: 'v1.19.0', port: 9001, description: 'Open Source Design & Prototyping (Figma Alternative).', status: 'Running', icon: 'penpot' },
  { id: '2', name: 'Mattermost', version: 'v9.5.0', port: 8065, description: 'Secure collaboration and team messaging.', status: 'Running', icon: 'mattermost' },
  { id: '3', name: 'NocoDB', version: 'v0.204.0', port: 8080, description: 'Open Source Airtable alternative. Turns DBs into Spreadsheets.', status: 'Running', icon: 'nocodb' },
  { id: '4', name: 'Jenkins', version: 'v2.440', port: 8081, description: 'Open source automation server for CI/CD pipelines.', status: 'Running', icon: 'jenkins' },
  { id: '5', name: 'Grafana', version: 'v10.3.3', port: 3000, description: 'The open observability platform.', status: 'Running', icon: 'grafana' },
  { id: '6', name: 'Paperless-ngx', version: 'v2.5.0', port: 8000, description: 'Document management system that transforms physical docs to searchable text.', status: 'Running', icon: 'paperless' },
  { id: '7', name: 'Postiz', version: 'v1.1.0', port: 4200, description: 'The ultimate AI social media scheduling tool.', status: 'Running', icon: 'postiz' },
  { id: '8', name: 'pgBackWeb', version: 'v0.1.0', port: 8085, description: 'Web interface for PostgreSQL backups.', status: 'Running', icon: 'pgbackweb' },
  { id: '9', name: 'OrangeHRM', version: 'v5.6', port: 8090, description: 'Open source HR management system.', status: 'Running', icon: 'orangehrm' },
];

const ServiceCard: React.FC<{ service: ServiceItem; onTerminal: (s: ServiceItem) => void }> = ({ service, onTerminal }) => {
  // Helper to get random icon since we don't have real logos loaded
  const getIcon = (name: string) => {
    switch (name) {
      case 'Penpot': return <Layers className="w-6 h-6 text-orange-400" />;
      case 'Mattermost': return <Users className="w-6 h-6 text-blue-400" />;
      case 'NocoDB': return <Database className="w-6 h-6 text-emerald-400" />;
      case 'Jenkins': return <Activity className="w-6 h-6 text-red-400" />;
      case 'Grafana': return <Activity className="w-6 h-6 text-orange-500" />;
      case 'Paperless-ngx': return <FileText className="w-6 h-6 text-green-400" />;
      case 'Postiz': return <Share2 className="w-6 h-6 text-purple-400" />;
      case 'pgBackWeb': return <Database className="w-6 h-6 text-blue-300" />;
      case 'OrangeHRM': return <Users className="w-6 h-6 text-orange-600" />;
      default: return <Shield className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          {getIcon(service.name)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-zinc-100">{service.name}</h3>
            <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-mono">
              :{service.port}
            </span>
          </div>
          <div className="text-xs text-zinc-400 font-mono mb-1">{service.version}</div>
          <p className="text-sm text-zinc-400 max-w-md truncate">{service.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {service.status}
        </div>
        
        <button 
          onClick={() => onTerminal(service)}
          className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-zinc-800 rounded-lg transition-colors"
          title="Open Console"
        >
          <Terminal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const FossRegistry: React.FC<FossRegistryProps> = ({ onDeploy, onOpenTerminal }) => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">FOSS Registry</h2>
          <p className="text-zinc-400">Manage your self-hosted Open Source infrastructure. One-click deploy and monitor.</p>
        </div>
        <button 
          onClick={onDeploy}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-orange-900/20"
        >
          <Play className="w-4 h-4 fill-current" />
          Deploy New Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map(s => (
          <ServiceCard key={s.id} service={s} onTerminal={onOpenTerminal} />
        ))}
      </div>
      
      <div className="mt-8 p-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 flex items-center justify-center text-zinc-500 gap-2 cursor-pointer hover:border-orange-500/50 hover:text-orange-400 transition-colors">
        <span>Docker Compose / Helm Chart Upload</span>
      </div>
    </div>
  );
};