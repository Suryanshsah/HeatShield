export default function RadiusSelector({ radius, setRadius }) {
  const options = [
    { value: 500, label: '500 m' },
    { value: 1000, label: '1 km' },
    { value: 2000, label: '2 km' },
  ];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--bg-surface-subtle)', padding: 3, borderRadius: 99, border: '1px solid var(--border-subtle)' }}>
      {options.map(opt => {
        const active = radius === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setRadius(opt.value)}
            style={{
              padding: '4px 10px',
              borderRadius: 99,
              border: 'none',
              backgroundColor: active ? '#6FD3B8' : 'transparent',
              color: active ? '#07201F' : 'var(--text-muted)',
              fontWeight: active ? 800 : 600,
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
