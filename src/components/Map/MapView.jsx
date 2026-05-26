import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LayerPanel from './LayerPanel';

export default function MapView({ layers, onToggle, onAddLayer }) {
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <MapContainer
        center={[37.54, 127.22]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        {layers.map(layer =>
          layer.visible && (
            <GeoJSON
              key={`${layer.id}-${layer.visible}`}
              data={layer.data}
              style={{ color: layer.color, weight: 2 }}
            />
          )
        )}
      </MapContainer>
      <LayerPanel layers={layers} onToggle={onToggle} onAddLayer={onAddLayer} />
    </div>
  );
}