import { useState, useCallback } from 'react';
import axios from 'axios';
import DropZone from './DropZone';
import ProgressBar from './ProgressBar';

// 백엔드 API 주소
const API_BASE = 'http://127.0.0.1:8000';

const COLORS = ['#9333ea', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function Sidebar({ layers, onAddLayer }) {
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      setCurrentFile(file.name);
      setProgress(0);
      setUploading(true);

      try {
        // FormData로 파일 전송
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', file.name.replace(/\.[^/.]+$/, ''));

        // 백엔드로 업로드
        const response = await axios.post(`${API_BASE}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setProgress(pct);
          }
        });

        // 업로드 성공 시 GeoJSON 가져와서 지도에 표시
        const category = response.data.category;
        const geoResponse = await axios.get(`${API_BASE}/layers/${category}/geojson`);

        onAddLayer({
          id: Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          data: geoResponse.data,
          color: COLORS[layers.length % COLORS.length],
          visible: true,
        });

        setProgress(100);
      } catch (error) {
        console.error('업로드 실패:', error);
        alert(`업로드 실패: ${error.response?.data?.detail || error.message}`);
        setProgress(0);
      } finally {
        setUploading(false);
      }
    }
  }, [layers.length, onAddLayer]);

  return (
    <div style={{
      width: 280, borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      background: '#fff', padding: 16, overflowY: 'auto'
    }}>
      <h2 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>
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
      <DropZone onDrop={handleDrop} disabled={uploading} />
      <ProgressBar fileName={currentFile} progress={progress} />
      {uploading && (
        <p style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>
          DB 변환 중...
        </p>
      )}
    </div>
  );
}