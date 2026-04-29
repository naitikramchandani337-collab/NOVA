// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          background: '#000', color: '#fff', padding: '40px',
          fontFamily: 'monospace', minHeight: '100vh'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>
            🚨 NOVA Crash Report
          </h1>
          <pre style={{
            background: '#111', padding: '20px', borderRadius: '8px',
            color: '#fca5a5', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
          }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px', padding: '10px 24px',
              background: '#3b82f6', color: '#fff',
              border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px'
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
