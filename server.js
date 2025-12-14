import express from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CONFIG_PATH = path.join(__dirname, 'server-config.yaml');

// Helper to read config
const readConfig = () => {
    try {
        const fileContents = fs.readFileSync(CONFIG_PATH, 'utf8');
        const data = yaml.load(fileContents);
        return data;
    } catch (e) {
        console.error("Error reading config:", e);
        return null;
    }
};

// API Endpoints
app.get('/api/config', (req, res) => {
    const config = readConfig();
    if (config) {
        // Transform YAML structure to match Frontend types if needed
        // Assuming loose mapping for now, but strict types might require mapping
        const mappedConfig = {
            maintenanceWindow: {
                days: config.maintenance_window.days || [],
                startTime: config.maintenance_window.start_time,
                endTime: config.maintenance_window.end_time,
                timezone: config.server_timezone || 'UTC'
            },
            services: (config.services || []).map((s, idx) => ({
                id: `svc-${idx}`,
                name: s.name,
                type: s.type,
                details: s.container_name || s.health_check || s.host || 'check config'
            })),
            notifications: {
                channel: config.notifications?.method || 'email',
                destination: config.notifications?.contact || '',
                notifyOnWarning: true
            },
            autoRemediation: {
                restartService: config.security?.allowed_actions?.includes('restart_service') || false,
                triggerBackup: config.security?.allowed_actions?.includes('trigger_backup') || false,
                applyPatches: false,
                scaleInstances: false
            },
            sshKeyPath: '' // Not in yaml example, keeping empty
        };
        res.json(mappedConfig);
    } else {
        res.status(500).json({ error: 'Failed to load configuration' });
    }
});

app.listen(PORT, () => {
    console.log(`Server Guardian Agent running at http://localhost:${PORT}`);
});
