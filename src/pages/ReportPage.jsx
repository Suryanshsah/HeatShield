import CommunityReportsFeed from '../components/CommunityReportsFeed';
import ReportStepForm from '../components/ReportStepForm';

export default function ReportPage({ reports, onReportSubmitted, onReportConfirmed, onBackToMap, t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="animate-fade-in">
      {/* 3-Step Wizard Form Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 1.5rem',
        boxShadow: 'var(--shadow-sm)',
        maxWidth: 860,
        margin: '0 auto',
        width: '100%',
      }}>
        <ReportStepForm
          onReportSubmitted={onReportSubmitted}
          onBackToMap={onBackToMap}
          t={t}
        />
      </div>

      {/* Community Feed List with Confirm Buttons */}
      <div style={{ maxWidth: 860, margin: '0 auto', width: '100%' }}>
        <CommunityReportsFeed
          reports={reports}
          onReportConfirmed={onReportConfirmed}
          t={t}
        />
      </div>
    </div>
  );
}
