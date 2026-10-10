import { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import { SAMPLE_REPORTS } from './data/sampleData';
import { FileText } from 'lucide-react';

export default function App() {
  const [localReports, setLocalReports] = useState([...SAMPLE_REPORTS]);

  function handleNewReport(report) {
    setLocalReports(prev => [report, ...prev]);
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--offwhite)' }}>
        <Navbar />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard localReports={localReports} />} />

            <Route path="/report" element={
              <main style={{ maxWidth: 1240, margin: '0 auto', padding: '1.75rem 1.25rem' }}>

                {/* Page header */}
                <div style={{
                  background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem 2rem',
                  marginBottom: '1.5rem',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: '0 6px 24px rgba(27,67,50,0.2)',
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileText size={22} color="#74c69d" />
                  </div>
                  <div>
                    <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 3 }}>
                      Report a Problem
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      Report a broken tap, water outage, pipe leak, or unavailable cooling facility in Delhi.
                    </p>
                  </div>
                </div>

                {/* Two-column layout on desktop */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
                  {/* Form card */}
                  <div style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <ReportForm onSuccess={handleNewReport} />
                  </div>

                  {/* Tips sidebar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Tips card */}
                    <div style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <div style={{
                        padding: '0.75rem 1rem',
                        background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
                        color: '#fff',
                      }}>
                        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                          💡 Tips for a Good Report
                        </h3>
                      </div>
                      <ul style={{ listStyle: 'none', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          'Be specific about the location.',
                          'Describe how long the issue has persisted.',
                          'Mention if it affects multiple households.',
                          'Attach a photo if it is safe to do so.',
                          'Use the map to pinpoint the exact spot.',
                        ].map((tip, i) => (
                          <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: 'var(--text-md)' }}>
                            <span style={{ color: 'var(--forest-lt)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AWS status reminder */}
                    <div style={{
                      backgroundColor: '#fef3e6',
                      border: '1px solid #f4a26133',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.9rem 1rem',
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#d4760a', marginBottom: 6 }}>
                        ⚡ Demo Mode
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#a35e10', lineHeight: 1.55 }}>
                        Reports are currently saved locally in your browser session. AWS API Gateway, Lambda, DynamoDB &amp; SNS integration is ready to be wired — just set the <code style={{ background: '#ffe8c2', padding: '1px 4px', borderRadius: 3 }}>VITE_API_URL</code> environment variable.
                      </p>
                    </div>
                  </div>
                </div>

                <style>{`
                  @media (max-width: 760px) {
                    div[style*="grid-template-columns: 1fr 300px"] { grid-template-columns: 1fr !important; }
                  }
                `}</style>
              </main>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--muted-lt)',
          backgroundColor: 'var(--card)',
        }}>
          HeatShield · Built for the Heat &amp; Water Hackathon Track · Data is illustrative and not verified
        </footer>
      </div>
    </Router>
  );
}
