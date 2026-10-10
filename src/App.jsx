import { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import { SAMPLE_REPORTS } from './data/sampleData';

export default function App() {
  // Keep a local report list so newly submitted reports appear in RecentReports
  const [localReports, setLocalReports] = useState([...SAMPLE_REPORTS]);

  function handleNewReport(report) {
    setLocalReports((prev) => [report, ...prev]);
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"       element={<Dashboard localReports={localReports} />} />
        <Route path="/report" element={
          <main style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.25rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                Report a Problem
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)' }}>
                Report a broken tap, water outage, pipe leak, or unavailable cooling facility.
              </p>
            </div>
            <div style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              padding: '1.75rem',
              maxWidth: 680,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <ReportForm onSuccess={handleNewReport} />
            </div>
          </main>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
