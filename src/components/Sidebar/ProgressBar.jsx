export default function ProgressBar({ fileName, progress }) {
  if (!fileName) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
          업로드 중: {fileName}
        </span>
        <span>{progress}%</span>
      </div>
      <div style={{ height: 5, background: '#e5e7eb', borderRadius: 99 }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: progress === 100 ? '#10b981' : '#3b82f6',
          borderRadius: 99, transition: 'width 0.3s'
        }} />
      </div>
    </div>
  );
}