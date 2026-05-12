import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MapView from './components/Map/MapView';

function App() {
  const [layers, setLayers] = useState([]);

  const addLayer = (newLayer) => {
    setLayers(prev => [...prev, newLayer]);
  };

  const toggleLayer = (id) => {
    setLayers(prev =>
      prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar layers={layers} onAddLayer={addLayer} />
      <MapView layers={layers} onToggle={toggleLayer} />
    </div>
  );
}

export default App;