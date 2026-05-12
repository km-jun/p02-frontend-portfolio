import { useState, useCallback } from 'react';
import DropZone from './DropZone';
import ProgressBar from './ProgressBar';

const COLORS = ['#9333ea', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function Sidebar({ layers, onAddLayer }) {
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');

  const handleDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setCurrentFile(file.name);
      setProgress(0);
      let val = 0;
      const timer = setInterval(() => {
        val += Math.random() * 15 + 5;
        if (val >= 100) {
          val = 100;
          clearInterval(timer);
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const geoData = JSON.parse(e.target.result);
              onAddLayer({
                id: Date.now(),
                name: file.name.replace('.geojson', '').replace('.json', ''),
                data: geoData,
                color: COLORS[layers.length % COLORS.length],
                visible: true,
              });
            } catch {
              alert('GeoJSON 형식이 올바르지 않습니다.');
            }
          };
          reader.readAsText(file);
        }
        setProgress(Math.round(val));
      }, 100);
    });
  }, [layers.length, onAddLayer]);

  return (
    <div style={{
      width: 280, borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      background: '#fff', padding: 16, overflowY: 'auto'
    }}>
      <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, margin: '0 0 12px' }}>
        업로드 목록
      </h2>
      <div style={{ marginBottom: 8 }}>
        {layers.map(layer => (
          <div key={layer.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 8px', borderRadius: 6, marginBottom: 2, background: '#f9fafb'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {layer.name}
            </span>
          </div>
        ))}
        {layers.length === 0 && (
          <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>
            파일을 업로드해 주세요
          </p>
        )}
      </div>
      <DropZone onDrop={handleDrop} />
      <ProgressBar fileName={currentFile} progress={progress} />
    </div>
  );
}