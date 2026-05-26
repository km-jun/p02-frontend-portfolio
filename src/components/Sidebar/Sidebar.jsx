import { useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE from '../../config';
import DropZone from './DropZone';
import ProgressBar from './ProgressBar';

const COLORS = ['#9333ea', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function Sidebar({ layers, onAddLayer, availableLayers }) {
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [uploading, setUploading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('GEOJSON');
  const [regionName, setRegionName] = useState('');
  const [downloadTask, setDownloadTask] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      setCurrentFile(file.name);
      setProgress(0);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^\w가-힣-]/g, '_');

        formData.append('category', cleanName);
        
        const response = await axios.post(`${API_BASE}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setProgress(pct);
          }
        });

        const category = response.data.category;
        const geoResponse = await axios.get(`${API_BASE}/layers/${category}/geojson`);

        onAddLayer({
          id: Date.now(),
          name: category,
          data: geoResponse.data,
          color: COLORS[layers.length % COLORS.length],
          visible: true,
        });

        // localStorage에 내가 업로드한 카테고리 저장
        const myUploads = JSON.parse(localStorage.getItem('myUploads') || '[]');
        if (!myUploads.includes(category)) {
          myUploads.push(category);
          localStorage.setItem('myUploads', JSON.stringify(myUploads));
        }

        setProgress(100);

        setTimeout(() => {
          setProgress(0);
          setCurrentFile('');
        }, 2000);
      } catch (error) {
        console.error('업로드 실패:', error);
        alert(`업로드 실패: ${error.response?.data?.detail || error.message}`);
        setProgress(0);
      } finally {
        setUploading(false);
      }
    }
  }, [layers.length, onAddLayer]);

  const handleDownloadRequest = async () => {
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요');
      return;
    }

    setDownloading(true);
    setDownloadTask(null);

    try {
      const response = await axios.post(`${API_BASE}/spatial/query`, {
        category: selectedCategory,
        target_format: selectedFormat,
        region_name: regionName || null
      });

      const taskId = response.data.task_id;
      setDownloadTask({ task_id: taskId, status: 'PENDING', progress: 0 });

      const checkStatus = async () => {
        try {
          const statusResponse = await axios.get(`${API_BASE}/spatial/task/${taskId}`);
          const task = statusResponse.data;
          
          setDownloadTask(task);

          if (task.status === 'COMPLETED') {
            setDownloading(false);
          } else if (task.status === 'FAILED') {
            setDownloading(false);
            alert('다운로드 작업 실패');
          } else {
            setTimeout(checkStatus, 2000);
          }
        } catch (error) {
          console.error('상태 확인 실패:', error);
          setDownloading(false);
        }
      };

      setTimeout(checkStatus, 2000);
    } catch (error) {
      console.error('다운로드 요청 실패:', error);
      alert(`다운로드 요청 실패: ${error.response?.data?.detail || error.message}`);
      setDownloading(false);
    }
  };

  return (
    <div style={{
      width: 280, borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      background: '#fff', padding: 16, overflowY: 'auto', gap: 24
    }}>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>
          파일 업로드
        </h2>
        <DropZone onDrop={handleDrop} disabled={uploading} />
        <ProgressBar fileName={currentFile} progress={progress} />
        {uploading && (
          <p style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>
            DB 변환 중...
          </p>
        )}
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>
          데이터 다운로드
        </h2>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            카테고리
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={downloading}
            style={{
              width: '100%', padding: '6px 8px', fontSize: 12,
              border: '1px solid #d1d5db', borderRadius: 6,
              background: '#fff', cursor: 'pointer'
            }}
          >
            <option value="">선택해주세요</option>
            {availableLayers.map(layer => (
              <option key={layer.category} value={layer.category}>
                {layer.category}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            파일 형식
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {['GEOJSON', 'CSV', 'EXCEL', 'SHP'].map(format => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                disabled={downloading}
                style={{
                  padding: '6px 8px', fontSize: 11, fontWeight: 500,
                  border: '1px solid #d1d5db', borderRadius: 6,
                  background: selectedFormat === format ? '#9333ea' : '#fff',
                  color: selectedFormat === format ? '#fff' : '#374151',
                  cursor: downloading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            지역명 (선택)
          </label>
          <input
            type="text"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            placeholder="예: 서울특별시"
            disabled={downloading}
            style={{
              width: '100%', padding: '6px 8px', fontSize: 12,
              border: '1px solid #d1d5db', borderRadius: 6,
              background: '#fff'
            }}
          />
        </div>

        <button
          onClick={handleDownloadRequest}
          disabled={downloading || !selectedCategory}
          style={{
            width: '100%', padding: '8px 12px', fontSize: 12, fontWeight: 600,
            border: 'none', borderRadius: 6,
            background: downloading || !selectedCategory ? '#d1d5db' : '#9333ea',
            color: '#fff',
            cursor: downloading || !selectedCategory ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {downloading ? '처리 중...' : '다운로드 요청'}
        </button>

        {downloadTask && (
          <div style={{
            marginTop: 12, padding: 12, background: '#f9fafb',
            borderRadius: 6, border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
              상태: <span style={{ fontWeight: 600, color: '#374151' }}>
                {downloadTask.status === 'PENDING' && '대기 중'}
                {downloadTask.status === 'PROCESSING' && '처리 중'}
                {downloadTask.status === 'COMPLETED' && '완료'}
                {downloadTask.status === 'FAILED' && '실패'}
              </span>
            </div>
            {downloadTask.progress > 0 && (
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>
                진행률: {downloadTask.progress}%
              </div>
            )}
            {downloadTask.status === 'COMPLETED' && downloadTask.download_url && (
              <a
                href={downloadTask.download_url}
                download
                style={{
                  display: 'block', padding: '6px 8px', fontSize: 11,
                  background: '#10b981', color: '#fff', textAlign: 'center',
                  borderRadius: 6, textDecoration: 'none', fontWeight: 600
                }}
              >
                파일 다운로드
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
