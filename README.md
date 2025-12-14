# Sentinel AI - Server Maintenance Agent

![Agent Status](https://img.shields.io/badge/Status-Active-green) ![License](https://img.shields.io/badge/License-MIT-blue)

Sentinel AI is an intelligent dashboard and autonomous agent designed to monitor server health, enforce maintenance windows, and perform auto-remediation tasks (like restarting services) based on configurable rules.

It consists of:
1.  **React Frontend**: A modern dashboard to view status, configure schedules, and chat with the AI assistant.
2.  **Node.js Agent (Backend)**: A lightweight process that reads the configuration, monitors services (mock/simulated), and exposes an API.
3.  **App Configuration**: A simplified YAML file (`server-config.yaml`) to define everything.

## Features

*   **📊 Live Dashboard**: Visualizes service health and maintenance windows.
*   **🤖 AI Assistant**: Chat interface powered by Gemini Flash 2.5 to help you write configurations.
*   **📝 YAML Configuration**: Manage infrastructure as code with a simple YAML file.
*   **🛡️ Auto-Remediation**: Rules to automatically restart containers or trigger backups (simulated).

## Project Structure

```
├── components/          # React UI Components (Dashboard, ConfigForm, Chat)
├── services/            # Frontend services (Gemini AI integration)
├── server.js            # Node.js backend agent
├── server-config.yaml   # Main configuration file
├── App.tsx             # Main React Application
└── vite.config.ts       # Build and Proxy configuration
```

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/sentinel-ai.git
    cd sentinel-ai
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    Create a `.env.local` file in the root directory and add your Google Gemini API Key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the Application

This project requires both the **Backend Agent** and **Frontend UI** to be running.

**1. Start the Backend Agent:**
```bash
npm run server
```
*Runs on http://localhost:3001*

**2. Start the Frontend:**
```bash
npm run dev
```
*Runs on http://localhost:3000*

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Configuration

Edit `server-config.yaml` to change monitored services and schedules:

```yaml
services:
  - name: "api-server"
    type: "docker"
    container_name: "production-api"
```

The changes will be reflected in the dashboard (requires server restart in this version).

## Tech Stack

*   **Frontend**: React, Vite, TailwindCSS, Lucide Icons, Recharts
*   **Backend**: Node.js, Express
*   **AI**: Google Gemini SDK
*   **Config**: YAML (js-yaml)

## License

MIT
