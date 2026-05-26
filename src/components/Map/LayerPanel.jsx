import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../../config';

const COLORS = ['#9333ea', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function LayerPanel({ layers, onToggle, onAddLayer }) {
  const [availableLayers, setAvailableLayers] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState(new Set());
  const [loadingLayers, setLoadingLayers] = useState(false);

  useEffect(() => {
    const fetchLayers = async () => {
      try {
        const response = await axios.get(`${API_BASE}/layers`);
        setAvailableLayers(response.data);
      } catch (error) {
        console.error('레이어 목록 가져오기 실패:', error);
      }
    };
    fetchLayers();
  }, []);

  useEffect(() => {
    const currentLayerNames = new Set(layers.map(l => l.name));
    setSelectedLayers(currentLayerNames);
  }, [layers]);

  const handleLayerToggle = async (category) => {
    const existingLayer = layers.find(l => l.name === category);
    
    if (existingLayer) {
      const newSelected = new Set(selectedLayers);
      newSelected.delete(category);
      setSelectedLayers(newSelected);
      
      onAddLayer(layers.filter(l => l.id !== existingLayer.id));
    } else {
      const newSelected = new Set(selectedLayers);
      newSelected.add(category);
      setSelectedLayers(newSelected);
      setLoadingLayers(true);
      
      try {
        const geoResponse = await axios.get(`${API_BASE}/layers/${category}/geojson`);
        
        onAddLayer({
          id: Date.now(),
          name: category,
          data: geoResponse.data,
          color: COLORS[layers.length % COLORS.length],
          visible: true,
        });
      } catch (error) {
        console.error('레이어 로딩 실패:', error);
        alert(`레이어 로딩 실패: ${error.response?.data?.detail || error.message}`);
        newSelected.delete(category);
        setSelectedLayers(newSelected);
      } finally {
        setLoadingLayers(false);
      }
    }
  };

  // 필터링: 내가 업로드한 것 + ORIGINAL만 보여주기
  const myUploads = JSON.parse(localStorage.getItem('myUploads') || '[]');
  const filteredLayers = availableLayers.filter(layer => {
    // 내가 업로드한 것 OR ORIGINAL 타입
    return myUploads.includes(layer.category) || layer.file_type === 'ORIGINAL';
  });

  const uploadedLayers = filteredLayers.filter(l => myUploads.includes(l.category));
  const existingLayers = filteredLayers.filter(l => !myUploads.includes(l.category));

  return (
    <div style={{
      position: 'absolute', top: 12, right: 12, zIndex: 1000,
      background: 'white', border: '1px solid #e5e7eb',
      borderRadius: 10, padding: '12px 14px', width: 240,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      maxHeight: '70vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, margin: '0 0 10px' }}>
        레이어 목록
      </p>
      
      <div style={{
        overflowY: 'auto',
        maxHeight: 'calc(70vh - 60px)',
        paddingRight: 4
      }}>
        {filteredLayers.length === 0 ? (
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
            레이어를 불러오는 중...
          </p>
        ) : (
          <>
            {uploadedLayers.map((layer) => (
              <label
                key={layer.category}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 4, marginBottom: 4,
                  cursor: 'pointer', fontSize: 12,
                  background: selectedLayers.has(layer.category) ? '#f3f4f6' : 'transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedLayers.has(layer.category)}
                  onChange={() => handleLayerToggle(layer.category)}
                  disabled={loadingLayers}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {layer.category}
                </span>
              </label>
            ))}

            {uploadedLayers.length > 0 && existingLayers.length > 0 && (
              <div style={{ 
                height: 1, 
                background: '#d1d5db', 
                margin: '8px 0' 
              }} />
            )}

            {existingLayers.map((layer) => (
              <label
                key={layer.category}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 4, marginBottom: 4,
                  cursor: 'pointer', fontSize: 12,
                  background: selectedLayers.has(layer.category) ? '#f3f4f6' : 'transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedLayers.has(layer.category)}
                  onChange={() => handleLayerToggle(layer.category)}
                  disabled={loadingLayers}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {layer.category}
                </span>
              </label>
            ))}
          </>
        )}
      </div>

      {loadingLayers && (
        <p style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 8, margin: '8px 0 0' }}>
          레이어 로딩 중...
        </p>
      )}
    </div>
  );
}
