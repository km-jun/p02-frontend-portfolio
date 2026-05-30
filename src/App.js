import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from './config';
import Sidebar from './components/Sidebar/Sidebar';
import MapView from './components/Map/MapView';
import './App.css';

import headerlogo from './assets/map.png';
import modallogo from './assets/dashboard.png';

function App() {
  const [layers, setLayers] = useState([]);
  const [availableLayers, setAvailableLayers] = useState([]);
  const [bbox, setBbox] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

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

  const addLayer = (newLayer) => {
    if (Array.isArray(newLayer)) {
      setLayers(newLayer);
    } else {
      setLayers(prev => [...prev, newLayer]);
      if (!availableLayers.find(l => l.category === newLayer.name)) {
        setAvailableLayers(prev => [...prev, { category: newLayer.name }]);
      }
    }
  };

  const toggleLayer = (id) => {
    setLayers(prev =>
      prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="title-wrapper">
          <img src={headerlogo} alt="logo" className="header-logo" />
          <div className="title-group">
            <h1>GeoSpatial Data Platform</h1>
            <p>환경 공간 데이터 통합 관리 및 시각화 시스템</p>
          </div>
        </div>
        <button className="help-button" onClick={() => setShowHelp(true)}>?</button>
      </header>

      <div className="main-content">
        <Sidebar layers={layers} onAddLayer={addLayer} availableLayers={availableLayers} bbox={bbox} />
        <MapView layers={layers} onToggle={toggleLayer} onAddLayer={addLayer} availableLayers={availableLayers} onBboxChange={setBbox} />
      </div>

      {showHelp && (
        <div className="help-modal-overlay">
          <div className="help-modal">
            <button className="close-button" onClick={() => setShowHelp(false)}>✕</button>
            <div className="modal-top">
              <img src={modallogo} alt="logo" className="modal-logo" />
              <h2>환경 공간 데이터 통합 관리 및 시각화 시스템</h2>
              <p>
                환경 공간 데이터를 통합 관리하고,
                지도 기반 시각화와 다양한 분석 및
                <br />
                맞춤형 데이터 추출을 지원하는
                클라우드 기반 GIS 플랫폼입니다.
              </p>
            </div>
            <div className="feature-box">
              <h3>주요 기능</h3>
              <ul>
                <li>공간 데이터 업로드 및 자동 정규화</li>
                <li>지도 기반 공간 데이터 시각화 및 필터링</li>
                <li>맞춤형 데이터 재추출 및 내보내기</li>
              </ul>
            </div>
            <div className="bottom-info">
              PostGIS/JSONB 하이브리드 모델링 기반으로
              다양한 환경 공간 데이터를 통합 관리합니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;