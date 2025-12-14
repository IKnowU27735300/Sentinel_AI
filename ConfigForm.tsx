import React, { useState } from 'react';
import { AgentConfiguration, DayOfWeek, ServiceConfig, ServiceType } from '../types';
import { Plus, Trash2, Save, ShieldCheck, Clock, Bell, Server } from 'lucide-react';

interface ConfigFormProps {
  config: AgentConfiguration;
  onUpdate: (newConfig: AgentConfiguration) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ConfigForm: React.FC<ConfigFormProps> = ({ config, onUpdate }) => {
  const [localConfig, setLocalConfig] = useState<AgentConfiguration>(config);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceType, setNewServiceType] = useState<ServiceType>('docker');
  const [newServiceDetails, setNewServiceDetails] = useState('');

  const handleSave = () => {
    onUpdate(localConfig);
    // Visual feedback handled by parent or toast ideally
    alert("Configuration Saved Successfully!");
  };

  const toggleDay = (day: DayOfWeek) => {
    const currentDays = localConfig.maintenanceWindow.days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setLocalConfig({
      ...localConfig,
      maintenanceWindow: { ...localConfig.maintenanceWindow, days: newDays }
    });
  };

  const addService = () => {
    if (!newServiceName) return;
    const newService: ServiceConfig = {
      id: Date.now().toString(),
      name: newServiceName,
      type: newServiceType,
      details: newServiceDetails
    };
    setLocalConfig({
      ...localConfig,
      services: [...localConfig.services, newService]
    });
    setNewServiceName('');
    setNewServiceDetails('');
  };

  const removeService = (id: string) => {
    setLocalConfig({
      ...localConfig,
      services: localConfig.services.filter(s => s.id !== id)
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      
      {/* Maintenance Window Section */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-2">
          <Clock className="text-blue-400" />
          <h2 className="text-xl font-bold text-gray-100">1. Maintenance Window</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Allowed Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    localConfig.maintenanceWindow.days.includes(day)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Start Time (24h)</label>
              <input 
                type="time" 
                value={localConfig.maintenanceWindow.startTime}
                onChange={(e) => setLocalConfig({...localConfig, maintenanceWindow: {...localConfig.maintenanceWindow, startTime: e.target.value}})}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">End Time (24h)</label>
              <input 
                type="time" 
                value={localConfig.maintenanceWindow.endTime}
                onChange={(e) => setLocalConfig({...localConfig, maintenanceWindow: {...localConfig.maintenanceWindow, endTime: e.target.value}})}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Timezone</label>
              <select 
                value={localConfig.maintenanceWindow.timezone}
                onChange={(e) => setLocalConfig({...localConfig, maintenanceWindow: {...localConfig.maintenanceWindow, timezone: e.target.value}})}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-2">
          <Server className="text-green-400" />
          <h2 className="text-xl font-bold text-gray-100">2. Managed Services</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-900 p-4 rounded-lg">
            <div className="md:col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Service Name</label>
              <input 
                placeholder="e.g. api-server"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select 
                value={newServiceType}
                onChange={(e) => setNewServiceType(e.target.value as ServiceType)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white"
              >
                <option value="docker">Docker Container</option>
                <option value="systemd">Systemd Service</option>
                <option value="kubernetes">K8s Deployment</option>
                <option value="static">Static/Other</option>
              </select>
            </div>
            <div className="md:col-span-5">
              <label className="block text-xs text-gray-500 mb-1">Details (Container Name / Host:Port)</label>
              <input 
                placeholder="e.g. my-app-container"
                value={newServiceDetails}
                onChange={(e) => setNewServiceDetails(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white"
              />
            </div>
            <div className="md:col-span-1">
              <button 
                onClick={addService}
                disabled={!newServiceName}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-2 rounded flex justify-center items-center"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {localConfig.services.length === 0 && (
              <p className="text-gray-500 text-sm text-center italic py-4">No services configured yet.</p>
            )}
            {localConfig.services.map(service => (
              <div key={service.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded border border-gray-600">
                <div>
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-xs text-gray-400">
                    <span className="bg-gray-600 px-1.5 py-0.5 rounded text-gray-200 mr-2">{service.type}</span>
                    {service.details}
                  </div>
                </div>
                <button onClick={() => removeService(service.id)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-2">
          <Bell className="text-yellow-400" />
          <h2 className="text-xl font-bold text-gray-100">3. Notifications</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Alert Channel</label>
              <select 
                 value={localConfig.notifications.channel}
                 onChange={(e) => setLocalConfig({...localConfig, notifications: {...localConfig.notifications, channel: e.target.value as any}})}
                 className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="slack">Slack Webhook</option>
                <option value="email">Email</option>
                <option value="pagerduty">PagerDuty</option>
              </select>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Destination (URL/Email/Key)</label>
              <input 
                type="password"
                value={localConfig.notifications.destination}
                onChange={(e) => setLocalConfig({...localConfig, notifications: {...localConfig.notifications, destination: e.target.value}})}
                placeholder="https://hooks.slack.com/..."
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
           </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <input 
              type="checkbox"
              id="warn"
              checked={localConfig.notifications.notifyOnWarning}
              onChange={(e) => setLocalConfig({...localConfig, notifications: {...localConfig.notifications, notifyOnWarning: e.target.checked}})}
              className="w-4 h-4 rounded bg-gray-900 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="warn" className="text-sm text-gray-300">Notify on Warnings (Non-Critical)</label>
        </div>
      </section>

      {/* Security & Access */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-2">
          <ShieldCheck className="text-purple-400" />
          <h2 className="text-xl font-bold text-gray-100">4. Permissions & Credentials</h2>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-1">SSH Private Key Path / Cloud IAM Role ARN</label>
            <input 
                type="text"
                value={localConfig.sshKeyPath}
                onChange={(e) => setLocalConfig({...localConfig, sshKeyPath: e.target.value})}
                placeholder="/home/user/.ssh/id_rsa_agent"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
             <p className="text-xs text-gray-500 mt-1">The agent uses this credential to execute commands on the host.</p>
        </div>

        <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Allowed Auto-Remediation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { key: 'restartService', label: 'Restart Crashed Services' },
                { key: 'triggerBackup', label: 'Trigger Automated Backups' },
                { key: 'applyPatches', label: 'Apply OS Security Patches' },
                { key: 'scaleInstances', label: 'Scale Up Instances' }
            ].map((action) => (
                <div key={action.key} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded border border-gray-700">
                    <input 
                        type="checkbox"
                        checked={(localConfig.autoRemediation as any)[action.key]}
                        onChange={(e) => setLocalConfig({
                            ...localConfig, 
                            autoRemediation: { ...localConfig.autoRemediation, [action.key]: e.target.checked }
                        })}
                        className="w-5 h-5 rounded bg-gray-800 border-gray-600 text-purple-500 focus:ring-purple-500"
                    />
                    <label className="text-gray-200">{action.label}</label>
                </div>
            ))}
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-10">
        <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105"
        >
            <Save />
            Deploy Configuration
        </button>
      </div>

    </div>
  );
};