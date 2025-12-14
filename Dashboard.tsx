import React from 'react';
import { AgentConfiguration } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  config: AgentConfiguration;
}

const mockData = [
  { time: '00:00', load: 30, maintenance: 0 },
  { time: '01:00', load: 20, maintenance: 100 }, // Maintenance window start
  { time: '02:00', load: 15, maintenance: 100 },
  { time: '03:00', load: 10, maintenance: 100 },
  { time: '04:00', load: 12, maintenance: 100 },
  { time: '05:00', load: 25, maintenance: 0 }, // End
  { time: '06:00', load: 45, maintenance: 0 },
  { time: '07:00', load: 60, maintenance: 0 },
  { time: '08:00', load: 75, maintenance: 0 },
  { time: '09:00', load: 80, maintenance: 0 },
  { time: '10:00', load: 85, maintenance: 0 },
  { time: '11:00', load: 70, maintenance: 0 },
];

export const Dashboard: React.FC<DashboardProps> = ({ config }) => {
  
  // Generate a YAML-like string for display
  const yamlPreview = `
maintenance_window:
  days: [${config.maintenanceWindow.days.join(', ')}]
  start: "${config.maintenanceWindow.startTime}"
  end: "${config.maintenanceWindow.endTime}"
  timezone: "${config.maintenanceWindow.timezone}"

services:
${config.services.map(s => `  - name: ${s.name}\n    type: ${s.type}\n    host: ${s.details}`).join('\n')}

notifications:
  channel: ${config.notifications.channel}
  notify_warning: ${config.notifications.notifyOnWarning}

security:
  ssh_key: "${config.sshKeyPath ? '*******' : 'Not Set'}"
  allowed_actions:
    restart: ${config.autoRemediation.restartService}
    backup: ${config.autoRemediation.triggerBackup}
`.trim();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow flex items-center gap-4">
           <div className="bg-blue-900/50 p-3 rounded-full text-blue-400">
             <Activity size={24} />
           </div>
           <div>
             <p className="text-gray-400 text-sm">Monitored Services</p>
             <p className="text-2xl font-bold">{config.services.length}</p>
           </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow flex items-center gap-4">
           <div className="bg-green-900/50 p-3 rounded-full text-green-400">
             <CheckCircle size={24} />
           </div>
           <div>
             <p className="text-gray-400 text-sm">Agent Status</p>
             <p className="text-2xl font-bold">Active</p>
           </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow flex items-center gap-4">
           <div className="bg-purple-900/50 p-3 rounded-full text-purple-400">
             <Clock size={24} />
           </div>
           <div>
             <p className="text-gray-400 text-sm">Next Window</p>
             <p className="text-xl font-bold">{config.maintenanceWindow.startTime}</p>
             <p className="text-xs text-gray-500">Tomorrow</p>
           </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow flex items-center gap-4">
           <div className="bg-red-900/50 p-3 rounded-full text-red-400">
             <ShieldAlert size={24} />
           </div>
           <div>
             <p className="text-gray-400 text-sm">Permissions</p>
             <p className="text-xl font-bold">
               {Object.values(config.autoRemediation).filter(Boolean).length} / 4
             </p>
             <p className="text-xs text-gray-500">Actions Allowed</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="text-blue-400" size={18} />
            Predicted Load vs. Maintenance Window
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                />
                <Line type="monotone" dataKey="load" stroke="#60a5fa" strokeWidth={2} dot={false} name="Server Load %" />
                {/* Visualizing maintenance window as a reference line area hack */}
                <Line type="step" dataKey="maintenance" stroke="#34d399" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Window Active" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            The green dashed line indicates the configured maintenance window coverage against typical server load.
          </p>
        </div>

        {/* Config Preview Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow flex flex-col">
          <h3 className="text-lg font-bold mb-4">Configuration Preview</h3>
          <div className="bg-gray-900 p-4 rounded-lg flex-1 overflow-auto border border-gray-700 font-mono text-sm text-green-400">
            <pre>{yamlPreview}</pre>
          </div>
          <button className="mt-4 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-sm font-medium transition-colors">
            Download YAML
          </button>
        </div>

      </div>
    </div>
  );
};