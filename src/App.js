import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from './config';
import Sidebar from './components/Sidebar/Sidebar';
import MapView from './components/Map/MapView';

function App() {
  const [layers, setLayers] = useState([]);
  const [availableLayers, setAvailableLayers] = useState([]);
  const [bbox, setBbox] = useState(null);

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
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar layers={layers} onAddLayer={addLayer} availableLayers={availableLayers} bbox={bbox} />
      <MapView layers={layers} onToggle={toggleLayer} onAddLayer={addLayer} availableLayers={availableLayers} onBboxChange={setBbox} />
    </div>
  );
}

export default App;
