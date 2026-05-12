export default function LayerPanel({ layers, onToggle }) {
  return (
    <div style={{
      position: 'absolute', top: 12, right: 12, zIndex: 1000,
      background: 'white', border: '1px solid #e5e7eb',
      borderRadius: 10, padding: '12px 14px', width: 185,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, margin: '0 0 10px' }}>레이어 목록</p>
      {layers.map(layer => (
        <div key={layer.id} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '4px 0', borderBottom: '1px solid #f3f4f6'
        }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: layer.color }} />
          <span style={{ flex: 1, fontSize: 12, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {layer.name}
          </span>
          <input type="checkbox" checked={layer.visible} onChange={() => onToggle(layer.id)} />
        </div>
      ))}
      {layers.length === 0 && (
        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>레이어 없음</p>
      )}
    </div>
  );
}