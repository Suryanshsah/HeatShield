import StaySafeGuide from '../components/StaySafeGuide';

export default function StaySafePage({ t }) {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <StaySafeGuide t={t} />
    </div>
  );
}
