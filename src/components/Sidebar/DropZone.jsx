import { useDropzone } from 'react-dropzone';

export default function DropZone({ onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/json': ['.geojson'], 
      'text/csv': ['.csv'],
      'application/zip': ['.zip']  // ZIP 추가
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? '#3b82f6' : '#d1d5db'}`,
        borderRadius: 8, padding: 20, textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? '#eff6ff' : 'transparent',
        transition: 'all 0.2s', marginTop: 8,
      }}
    >
      <input {...getInputProps()} />
      <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
        {isDragActive ? '여기에 놓으세요!' : '여기에 드래그 해 주세요'}
      </p>
      <small style={{ color: '#9ca3af' }}>GeoJSON, CSV, SHP(ZIP) 지원</small>
    </div>
  );
}