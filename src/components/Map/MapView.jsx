import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import LayerPanel from './LayerPanel';
import L from 'leaflet';
import { useEffect, useState, useCallback } from 'react';
import 'leaflet-draw';
import axios from 'axios';
import API_BASE from '../../config';

window.L = L;

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
      draw: { rectangle: true, polygon: false, circle: false, marker: false, polyline: false, circlemarker: false },
      edit: { featureGroup: drawnItems, remove: true }
    });
    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers();
      drawnItems.addLayer(e.layer);
      const bounds = e.layer.getBounds();
      onBboxChange([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
    });
    map.on(L.Draw.Event.DELETED, () => onBboxChange(null));
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
      onBoundsChange({ minLng: bounds.getWest(), minLat: bounds.getSouth(), maxLng: bounds.getEast(), maxLat: bounds.getNorth() });
    };
    updateBounds();
    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);
    return () => { map.off('moveend', updateBounds); map.off('zoomend', updateBounds); };
  }, [map, onBoundsChange]);
  return null;
}

// TIF 전용 렌더링 컴포넌트
function TifLayer({ category }) {
  const map = useMap();

  useEffect(() => {
    let layer = null;
    let isMounted = true;

    const loadScriptsAndTif = async () => {
      try {
        // 1. Leaflet이 준비된 상태에서 TIF 라이브러리를 순서대로 안전하게 불러옵니다.
        if (!window.parseGeoraster) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/georaster";
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }

        if (!window.GeoRasterLayer) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/georaster-layer-for-leaflet/dist/georaster-layer-for-leaflet.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }

        if (!isMounted) return;

        const parseGeoraster = window.parseGeoraster;
        const GeoRasterLayer = window.GeoRasterLayer;

        // 2. 백엔드에서 S3 임시 URL 받아오기
        const res = await axios.get(`${API_BASE}/layers/${category}/raster`);
        if (!isMounted) return;

        // 3. URL에서 TIF 파일을 다운로드하여 버퍼 형태로 읽기
        const response = await fetch(res.data.url);
        const arrayBuffer = await response.arrayBuffer();
        if (!isMounted) return;

        // 4. 브라우저가 읽을 수 있도록 Georaster로 파싱
        const georaster = await parseGeoraster(arrayBuffer);
        if (!isMounted) return;

        const min = georaster.mins[0];
        const max = georaster.maxs[0];
        const range = max - min;

        // 5. 지도 위에 씌우기
        layer = new GeoRasterLayer({
          georaster,
          opacity: 0.8,
          resolution: 256,

          pixelValuesToColorFn: (values) => {
            const val = values[0];

            if (val === georaster.noDataValue || Number.isNaN(val) || val === null || val <= 0.0001) {
              return null;
            }

            const ratio = (val - min) / (range || 1);

            if (ratio < 0.03) {
              return null;
            }

            const hue = (1 - ratio) * 240;
            const alpha = 0.3 + (ratio * 0.7);

            return `hsla(${hue}, 100%, 50%, ${alpha})`;
          }
        });

        layer.addTo(map);
        map.fitBounds(layer.getBounds());

      } catch (error) {
        console.error(`${category} TIF 렌더링 실패:`, error);
      }
    };

    loadScriptsAndTif();

    return () => {
      isMounted = false;
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [category, map]);

  return null;
}

export default function MapView({ layers, onToggle, onAddLayer, availableLayers, onBboxChange }) {
  const [mapBounds, setMapBounds] = useState(null);

  const handleBoundsChange = useCallback((bounds) => {
    setMapBounds(bounds);
  }, []);

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <MapContainer center={[37.54, 127.22]} zoom={13} style={{ width: '100%', height: '100%' }} preferCanvas={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        <DrawControl onBboxChange={onBboxChange} />
        <MapBoundsTracker onBoundsChange={handleBoundsChange} />

        {layers.map(layer => {
          if (!layer.visible) return null;

          const isRaster = !layer.data?.features || layer.data.features.length === 0;

          if (isRaster) {
            return <TifLayer key={`tif-${layer.id}`} category={layer.name} />;
          }

          return (
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
          );
        })}
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