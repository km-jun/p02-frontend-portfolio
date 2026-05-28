import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import LayerPanel from './LayerPanel';
import L from 'leaflet';
import { useEffect, useState, useCallback } from 'react';
import 'leaflet-draw';

// 기본 마커 아이콘 fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function DrawControl({ onBboxChange }) {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        rectangle: true,
        polygon: false,
        circle: false,
        marker: false,
        polyline: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers();
      drawnItems.addLayer(e.layer);
      const bounds = e.layer.getBounds();
      onBboxChange([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
      ]);
    });

    map.on(L.Draw.Event.DELETED, () => {
      onBboxChange(null);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onBboxChange]);

  return null;
}

function MapBoundsTracker({ onBoundsChange }) {
  const map = useMap();

  useEffect(() => {
    const updateBounds = () => {
      const bounds = map.getBounds();
      onBoundsChange({
        minLng: bounds.getWest(),
        minLat: bounds.getSouth(),
        maxLng: bounds.getEast(),
        maxLat: bounds.getNorth()
      });
    };

    updateBounds();
    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);

    return () => {
      map.off('moveend', updateBounds);
      map.off('zoomend', updateBounds);
    };
  }, [map, onBoundsChange]);

  return null;
}

export default function MapView({ layers, onToggle, onAddLayer, availableLayers, onBboxChange }) {
  const [mapBounds, setMapBounds] = useState(null);

  const handleBoundsChange = useCallback((bounds) => {
    setMapBounds(bounds);
  }, []);

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
        <DrawControl onBboxChange={onBboxChange} />
        <MapBoundsTracker onBoundsChange={handleBoundsChange} />
        {layers.map(layer =>
          layer.visible && (
            <GeoJSON
              key={`${layer.id}-${layer.visible}-${JSON.stringify(layer.data?.features?.length)}`}
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
      <LayerPanel
        layers={layers}
        onToggle={onToggle}
        onAddLayer={onAddLayer}
        availableLayers={availableLayers}
        mapBounds={mapBounds}
      />
    </div>
  );
}
