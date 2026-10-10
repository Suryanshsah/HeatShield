import { useEffect, useState } from 'react';
import { fetchReports, fetchWaterPoints, updateReportStatus, updateWaterPointStatus, addWaterPoint, deleteReport } from '../services/api';
import { AlertTriangle, CheckCircle, Clock, Droplets, Plus, ShieldCheck, Trash2, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AdminPortal() {
  const { t } = useLanguage();
  const [reports, setReports]       = useState([]);
  const [waterPoints, setWaterPoints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('reports');
  const [selectedNote, setSelectedNote] = useState({});

  // New Water point form state
  const [newWp, setNewWp] = useState({ name: '', type: 'Community Tap', lat: '28.6139', lng: '77.2090', status: 'operational', address: '' });
  const [showAddWp, setShowAddWp] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [r, w] = await Promise.all([fetchReports(), fetchWaterPoints()]);
    setReports(r);
    setWaterPoints(w);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  async function handleStatusChange(id, newStatus) {
    const note = selectedNote[id] || '';
    await updateReportStatus(id, newStatus, note);
    loadAll();
  }

  async function handleDeleteReport(id) {
    if (confirm('Are you sure you want to delete this incident report?')) {
      await deleteReport(id);
      loadAll();
    }
  }

  async function handleWpStatusChange(id, newStatus) {
    await updateWaterPointStatus(id, newStatus);
    loadAll();
  }

  async function handleAddWaterPointSubmit(e) {
    e.preventDefault();
    if (!newWp.name) return;
    await addWaterPoint(newWp);
    setShowAddWp(false);
    setNewWp({ name: '', type: 'Community Tap', lat: '28.6139', lng: '77.2090', status: 'operational', address: '' });
    loadAll();
  }

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '1.75rem 1.25rem' }}>

      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        marginBottom: '1.5rem',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 6px 20px rgba(29,53,87,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShieldCheck size={26} color="#a8dadc" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 2 }}>
              Municipal Authority &amp; Response Team Portal
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              Manage reported water issues, issue official resolutions, and monitor Delhi infrastructure points.
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: 8, backgroundColor: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 10 }}>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              backgroundColor: activeTab === 'reports' ? '#fff' : 'transparent',
              color: activeTab === 'reports' ? '#1d3557' : '#fff',
              fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer'
            }}
          >
            📋 Incident Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('waterPoints')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              backgroundColor: activeTab === 'waterPoints' ? '#fff' : 'transparent',
              color: activeTab === 'waterPoints' ? '#1d3557' : '#fff',
              fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer'
            }}
          >
            💧 Water Points ({waterPoints.length})
          </button>
        </div>
      </div>

      {/* Reports Table Tab */}
      {activeTab === 'reports' && (
        <div style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>
            Active Citizen Incidents ({reports.filter(r => r.status === 'open').length} Open)
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--border-lt)', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                  <th style={{ padding: '10px 14px' }}>Issue &amp; Description</th>
                  <th style={{ padding: '10px 14px' }}>Location</th>
                  <th style={{ padding: '10px 14px' }}>Upvotes</th>
                  <th style={{ padding: '10px 14px' }}>Current Status</th>
                  <th style={{ padding: '10px 14px' }}>Official Resolution Note</th>
                  <th style={{ padding: '10px 14px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rpt) => (
                  <tr key={rpt.id} style={{ borderBottom: '1px solid var(--border-lt)' }}>
                    <td style={{ padding: '12px 14px', maxWidth: 260 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{rpt.issueType}</div>
                      <div style={{ color: 'var(--text-md)', fontSize: '0.8rem', lineHeight: 1.4 }}>{rpt.description}</div>
                    </td>
                    <td style={{ padding: '12px 14px', maxWidth: 180 }}>
                      <div style={{ fontWeight: 600 }}>{rpt.address || 'Delhi'}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{rpt.lat?.toFixed(3)}, {rpt.lng?.toFixed(3)}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--forest-dk)' }}>
                      👍 {rpt.upvotes || 0}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <select
                        value={rpt.status}
                        onChange={(e) => handleStatusChange(rpt.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--border)',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          backgroundColor: rpt.status === 'resolved' ? '#e8f7ef' : rpt.status === 'acknowledged' ? '#fef3e6' : '#fde8e8',
                          color: rpt.status === 'resolved' ? '#2d6a4f' : rpt.status === 'acknowledged' ? '#d4760a' : '#c1121f',
                        }}
                      >
                        <option value="open">Open (Active)</option>
                        <option value="acknowledged">In Review / Dispatched</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <input
                        type="text"
                        placeholder="Add response note (e.g. Tanker sent)..."
                        defaultValue={rpt.officialNote || ''}
                        onBlur={(e) => {
                          if (e.target.value !== rpt.officialNote) {
                            updateReportStatus(rpt.id, rpt.status, e.target.value).then(loadAll);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--border)',
                          fontSize: '0.78rem',
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => handleDeleteReport(rpt.id)}
                        title="Delete Report"
                        style={{ background: 'none', border: 'none', color: '#c1121f', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Water Points Tab */}
      {activeTab === 'waterPoints' && (
        <div style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ fontWeight: 700 }}>Delhi Public Water Points Management</h3>
            <button
              onClick={() => setShowAddWp(!showAddWp)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 8,
                backgroundColor: 'var(--forest)', color: '#fff', border: 'none',
                fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
              }}
            >
              <Plus size={14} /> Add Water Point
            </button>
          </div>

          {/* Add New Water Point Form */}
          {showAddWp && (
            <form onSubmit={handleAddWaterPointSubmit} style={{ padding: '1.25rem', backgroundColor: '#fcfdfd', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              <input
                placeholder="Water point name" required
                value={newWp.name} onChange={e => setNewWp({ ...newWp, name: e.target.value })}
                style={{ padding: 8, border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.82rem' }}
              />
              <select
                value={newWp.type} onChange={e => setNewWp({ ...newWp, type: e.target.value })}
                style={{ padding: 8, border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.82rem' }}
              >
                <option value="Community Tap">Community Tap</option>
                <option value="Water Kiosk">Water Kiosk</option>
                <option value="Public Tap">Public Tap</option>
                <option value="Tanker Point">Tanker Point</option>
                <option value="Water Booth">Water Booth</option>
              </select>
              <input
                placeholder="Address / Area"
                value={newWp.address} onChange={e => setNewWp({ ...newWp, address: e.target.value })}
                style={{ padding: 8, border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.82rem' }}
              />
              <input
                type="number" step="any" placeholder="Lat (28.6139)"
                value={newWp.lat} onChange={e => setNewWp({ ...newWp, lat: e.target.value })}
                style={{ padding: 8, border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.82rem' }}
              />
              <input
                type="number" step="any" placeholder="Lng (77.2090)"
                value={newWp.lng} onChange={e => setNewWp({ ...newWp, lng: e.target.value })}
                style={{ padding: 8, border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.82rem' }}
              />
              <button
                type="submit"
                style={{ padding: 8, backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
              >
                Save Point
              </button>
            </form>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--border-lt)', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                  <th style={{ padding: '10px 14px' }}>Point Name</th>
                  <th style={{ padding: '10px 14px' }}>Type</th>
                  <th style={{ padding: '10px 14px' }}>Address</th>
                  <th style={{ padding: '10px 14px' }}>Status Toggle</th>
                </tr>
              </thead>
              <tbody>
                {waterPoints.map((wp) => (
                  <tr key={wp.id} style={{ borderBottom: '1px solid var(--border-lt)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700 }}>💧 {wp.name}</td>
                    <td style={{ padding: '12px 14px' }}>{wp.type}</td>
                    <td style={{ padding: '12px 14px' }}>{wp.address || 'Delhi'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <select
                        value={wp.status}
                        onChange={(e) => handleWpStatusChange(wp.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--border)',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          backgroundColor: wp.status === 'operational' ? '#e8f7ef' : wp.status === 'low-supply' ? '#fef3e6' : '#fde8e8',
                          color: wp.status === 'operational' ? '#2d6a4f' : wp.status === 'low-supply' ? '#d4760a' : '#c1121f',
                        }}
                      >
                        <option value="operational">Operational</option>
                        <option value="low-supply">Low Supply</option>
                        <option value="broken">Broken</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
