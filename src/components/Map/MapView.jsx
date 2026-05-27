import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LayerPanel from './LayerPanel';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 기본 마커 아이콘 fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function MapView({ layers, onToggle, onAddLayer, availableLayers }) {  return (
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
              onEachFeature={(feature, leafletlayer) => {
                if (feature.properties) {
                  const content = Object.entries(feature.properties)
                    .filter(([, value]) => value !== null && value !== undefined)
                    .map(([key, value]) => `<b>${key}</b>: ${value}`)
                    .join('<br/>');
                  if (content) {
                    leafletlayer.bindTooltip(content, { sticky: true });
                  }
                }
              }}
            />
          )
        )}
      </MapContainer>
      <LayerPanel layers={layers} onToggle={onToggle} onAddLayer={onAddLayer} availableLayers={availableLayers} />
    </div>
  );
}