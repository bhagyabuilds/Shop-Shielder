
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Production Heartbeat Diagnostic
console.log("%c🛡️ Shop Shielder Engine: Initializing Secure Protocol...", "color: #10b981; font-weight: bold;");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical Registry Error: Root mount point not found.");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
