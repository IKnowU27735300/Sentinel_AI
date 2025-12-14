import React, { useState, useEffect } from 'react';
import { AgentConfiguration } from './types';
import { ConfigForm } from './components/ConfigForm';
import { Dashboard } from './components/Dashboard';
import { AgentChat } from './components/AgentChat';
import { LayoutDashboard, Settings, MessageSquare, Terminal, Loader2, AlertCircle } from 'lucide-react';

const INITIAL_CONFIG: AgentConfiguration = {
  maintenanceWindow: {
    days: [],
    startTime: '00:00',
    endTime: '00:00',
    timezone: 'UTC'
  },
  services: [],
  notifications: {
    channel: 'email',
    destination: '',
    notifyOnWarning: false
  },
  autoRemediation: {
    restartService: false,
    triggerBackup: false,
    applyPatches: false,
    scaleInstances: false
  },
  sshKeyPath: ''
};

type View = 'dashboard' | 'config' | 'chat';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [config, setConfig] = useState<AgentConfiguration>(INITIAL_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load configuration');
        return res.json();
      })
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not connect to Agent Backend. Ensure "npm run server" is running.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p>Connecting to Sentinel Agent...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
         <div className="flex flex-col items-center gap-4 max-w-md text-center p-6 bg-gray-800 rounded-xl border border-red-500/50">
          <AlertCircle className="text-red-500" size={48} />
          <h2 className="text-xl font-bold">Connection Failed</h2>
          <p className="text-gray-400">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-700">
          <div className="bg-blue-600 p-2 rounded">
            <Terminal className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">Sentinel AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'config' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Settings size={20} />
            Configuration
          </button>
          <button 
            onClick={() => setCurrentView('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <MessageSquare size={20} />
            AI Assistant
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-green-400">Agent Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8">
           <h1 className="text-xl font-semibold capitalize">
             {currentView === 'chat' ? 'Ask Sentinel' : currentView}
           </h1>
           <div className="text-sm text-gray-400">
             Project: <span className="text-gray-200 font-medium">Production-Alpha</span>
           </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {currentView === 'dashboard' && <Dashboard config={config} />}
          {currentView === 'config' && <ConfigForm config={config} onUpdate={setConfig} />}
          {currentView === 'chat' && <AgentChat config={config} />}
        </div>
      </main>

    </div>
  );
}