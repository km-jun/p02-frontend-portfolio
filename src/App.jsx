import { useEffect, useRef, useState } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./App.css";

import layerGroupsData from "./data/layer-data";
import { fetchLayerGeoJSON } from "./data/mock-api";

function App() {
  const mapRef = useRef(null);
  const leafletLayersRef = useRef({});
  const layerLoadedRef = useRef({});

  const [layerGroups] = useState(layerGroupsData);
  const [layerState, setLayerState] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [panelOpen, setPanelOpen] = useState(true);

  const [layerSearch, setLayerSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  useEffect(() => {
    const map = L.map("map").setView([36.4, 127.8], 7);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    }).addTo(map);

    mapRef.current = map;

    const initialState = {};
    const initialExpanded = {};

    layerGroupsData.forEach((group) => {
      initialExpanded[group.id] = group.expanded ?? true;

      group.layers.forEach((layer) => {
        initialState[layer.id] = false;
        layerLoadedRef.current[layer.id] = false;
      });
    });

    setLayerState(initialState);
    setExpandedGroups(initialExpanded);

    return () => {
      map.remove();
    };
  }, []);

  function getLayerConfig(layerId) {
    for (const group of layerGroupsData) {
      const found = group.layers.find((layer) => layer.id === layerId);
      if (found) return found;
    }

    return null;
  }

  function getLayerStyle(layerId) {
    switch (layerId) {
      case "boundary":
        return { color: "#ef4444", weight: 3, fillColor: "#f87171", fillOpacity: 0.12 };
      case "rainfall":
        return { color: "#2563eb", weight: 2, fillColor: "#60a5fa", fillOpacity: 0.4 };
      case "temperature":
        return { color: "#10b981", weight: 2, fillColor: "#6ee7b7", fillOpacity: 0.4 };
      case "wind":
        return { color: "#6366f1", weight: 2, fillColor: "#a5b4fc", fillOpacity: 0.4 };
      case "pm10":
        return { color: "#f97316", weight: 2, fillColor: "#fdba74", fillOpacity: 0.4 };
      case "pm25":
        return { color: "#dc2626", weight: 2, fillColor: "#fca5a5", fillOpacity: 0.4 };
      case "ozone":
        return { color: "#7c3aed", weight: 2, fillColor: "#c4b5fd", fillOpacity: 0.4 };
      case "waterLevel":
        return { color: "#0891b2", weight: 2, fillColor: "#67e8f9", fillOpacity: 0.4 };
      case "flow":
        return { color: "#0f766e", weight: 2, fillColor: "#5eead4", fillOpacity: 0.4 };
      default:
        return { color: "#374151", weight: 2, fillColor: "#9ca3af", fillOpacity: 0.3 };
    }
  }

  function makePopupHtml(properties) {
    return Object.entries(properties || {})
      .map(([key, value]) => `<b>${key}</b>: ${value}`)
      .join("<br>");
  }

  function isFeatureMatched(feature) {
    const props = feature.properties || {};

    if (regionFilter && props.region !== regionFilter) {
      return false;
    }

    if (gradeFilter && props.grade !== gradeFilter) {
      return false;
    }

    if (propertySearch.trim()) {
      const valuesText = Object.values(props).join(" ").toLowerCase();

      if (!valuesText.includes(propertySearch.trim().toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  function filterGeoJSON(geojson) {
    return {
      ...geojson,
      features: geojson.features.filter(isFeatureMatched),
    };
  }

  function createGeoJsonLayer(layerId, geojson, layerType) {
    if (layerType === "point") {
      return L.geoJSON(geojson, {
        pointToLayer: (feature, latlng) => L.marker(latlng),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(makePopupHtml(feature.properties));
        },
      });
    }

    return L.geoJSON(geojson, {
      style: getLayerStyle(layerId),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(makePopupHtml(feature.properties));
      },
    });
  }

  async function loadLayer(layerId) {
    const layerConfig = getLayerConfig(layerId);

    if (!layerConfig) return;

    const geojson = await fetchLayerGeoJSON(layerId);
    const filteredGeoJSON = filterGeoJSON(geojson);

    leafletLayersRef.current[layerId] = createGeoJsonLayer(
      layerId,
      filteredGeoJSON,
      layerConfig.layerType
    );

    layerLoadedRef.current[layerId] = true;
  }

  async function setLayerVisible(layerId, isOn) {
    const map = mapRef.current;

    if (!map) return;

    setLayerState((prev) => ({
      ...prev,
      [layerId]: isOn,
    }));

    if (!isOn) {
      if (leafletLayersRef.current[layerId]) {
        map.removeLayer(leafletLayersRef.current[layerId]);
      }

      return;
    }

    try {
      if (!layerLoadedRef.current[layerId]) {
        await loadLayer(layerId);
      }

      const targetLayer = leafletLayersRef.current[layerId];

      if (targetLayer) {
        targetLayer.addTo(map);

        const bounds = targetLayer.getBounds?.();

        if (bounds && bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [30, 30],
          });
        }
      }
    } catch (error) {
      console.error(error);

      alert(`${layerId} 레이어를 불러오지 못했습니다.`);

      setLayerState((prev) => ({
        ...prev,
        [layerId]: false,
      }));
    }
  }

  async function toggleLayer(layerId) {
    await setLayerVisible(layerId, !layerState[layerId]);
  }

  function toggleGroupExpand(groupId) {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }

  function isGroupAllOn(group) {
    return group.layers.every((layer) => layerState[layer.id]);
  }

  async function toggleGroupLayers(group) {
    const turnOn = !isGroupAllOn(group);

    for (const layer of group.layers) {
      await setLayerVisible(layer.id, turnOn);
    }
  }

  async function refreshVisibleLayersByFilter() {
    const map = mapRef.current;

    if (!map) return;

    for (const group of layerGroupsData) {
      for (const layer of group.layers) {
        const layerId = layer.id;

        if (leafletLayersRef.current[layerId]) {
          map.removeLayer(leafletLayersRef.current[layerId]);
        }

        leafletLayersRef.current[layerId] = null;
        layerLoadedRef.current[layerId] = false;

        if (layerState[layerId]) {
          await loadLayer(layerId);

          const targetLayer = leafletLayersRef.current[layerId];

          if (targetLayer) {
            targetLayer.addTo(map);
          }
        }
      }
    }
  }

  async function getVisibleLayerGeoJSON() {
    const features = [];

    for (const group of layerGroupsData) {
      for (const layer of group.layers) {
        const layerId = layer.id;

        if (!layerState[layerId]) continue;

        const originalGeoJSON = await fetchLayerGeoJSON(layerId);
        const filteredGeoJSON = filterGeoJSON(originalGeoJSON);

        filteredGeoJSON.features.forEach((feature) => {
          features.push({
            ...feature,
            properties: {
              ...feature.properties,
              layerName: layer.name,
              category: layer.category,
            },
          });
        });
      }
    }

    return {
      type: "FeatureCollection",
      features,
    };
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], {
      type: mimeType,
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  async function downloadCurrentGeoJSON() {
    const geojson = await getVisibleLayerGeoJSON();

    if (geojson.features.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    downloadFile(
      "selected_layers.geojson",
      JSON.stringify(geojson, null, 2),
      "application/geo+json"
    );
  }

  function convertGeoJSONToCSV(geojson) {
    const rows = geojson.features.map((feature) => {
      const props = feature.properties || {};
      const geometry = feature.geometry || {};

      return {
        ...props,
        geometry_type: geometry.type || "",
        coordinates: JSON.stringify(geometry.coordinates || []),
      };
    });

    if (rows.length === 0) return "";

    const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

    const csvRows = [];

    csvRows.push(headers.join(","));

    rows.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header] ?? "";
        return `"${String(value).replaceAll('"', '""')}"`;
      });

      csvRows.push(values.join(","));
    });

    return csvRows.join("\n");
  }

  async function downloadCurrentCSV() {
    const geojson = await getVisibleLayerGeoJSON();

    if (geojson.features.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const csv = convertGeoJSONToCSV(geojson);

    downloadFile(
      "selected_layers.csv",
      "\uFEFF" + csv,
      "text/csv;charset=utf-8"
    );
  }

  async function turnOnAllLayers() {
    for (const group of layerGroupsData) {
      for (const layer of group.layers) {
        await setLayerVisible(layer.id, true);
      }
    }
  }

  async function turnOffAllLayers() {
    for (const group of layerGroupsData) {
      for (const layer of group.layers) {
        await setLayerVisible(layer.id, false);
      }
    }
  }

  async function resetLayers() {
    for (const group of layerGroupsData) {
      for (const layer of group.layers) {
        await setLayerVisible(layer.id, !!layer.defaultOn);
      }
    }
  }

  useEffect(() => {
    refreshVisibleLayersByFilter();
  }, [propertySearch, regionFilter, gradeFilter]);

  const activeCount = Object.values(layerState).filter(Boolean).length;

  return (
    <div id="app">
      <div id="map"></div>

      <div className="map-legend">
        <h4>범례</h4>

        <div className="legend-item">
          <span className="legend-color boundary"></span>
          <span>행정경계</span>
        </div>

        <div className="legend-item">
          <span className="legend-color rainfall"></span>
          <span>강수량</span>
        </div>

        <div className="legend-item">
          <span className="legend-color temperature"></span>
          <span>기온</span>
        </div>

        <div className="legend-item">
          <span className="legend-color pm10"></span>
          <span>미세먼지</span>
        </div>

        <div className="legend-item">
          <span className="legend-marker"></span>
          <span>측정소 위치</span>
        </div>
      </div>

      <div className="layer-panel">
        <div className="panel-header">
          <h2>레이어 관리</h2>

          <button
            className="panel-toggle-btn"
            onClick={() => setPanelOpen(!panelOpen)}
          >
            {panelOpen ? "−" : "+"}
          </button>
        </div>

        {panelOpen && (
          <div id="panelContent">
            <div className="panel-top-actions">
              <input
                type="text"
                id="layerSearch"
                placeholder="레이어 검색"
                value={layerSearch}
                onChange={(e) => setLayerSearch(e.target.value)}
              />

              <div className="action-row">
                <button onClick={turnOnAllLayers}>전체 켜기</button>
                <button onClick={turnOffAllLayers}>전체 끄기</button>
                <button onClick={resetLayers}>초기화</button>
              </div>

              <div className="filter-box">
                <input
                  type="text"
                  id="propertySearch"
                  placeholder="속성 통합 검색 예: 서울, 나쁨, 하남"
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                />

                <select
                  id="regionFilter"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="">전체 지역</option>
                  <option value="서울">서울</option>
                  <option value="하남">하남</option>
                  <option value="수원">수원</option>
                  <option value="대전">대전</option>
                  <option value="부산">부산</option>
                </select>

                <select
                  id="gradeFilter"
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                >
                  <option value="">전체 등급</option>
                  <option value="좋음">좋음</option>
                  <option value="보통">보통</option>
                  <option value="나쁨">나쁨</option>
                  <option value="매우나쁨">매우나쁨</option>
                </select>

                <button
                  id="filterResetBtn"
                  onClick={() => {
                    setPropertySearch("");
                    setRegionFilter("");
                    setGradeFilter("");
                  }}
                >
                  필터 초기화
                </button>
              </div>
            </div>

            <div id="layerGroupContainer">
              {layerGroups.map((group) => {
                const filteredLayers = group.layers.filter((layer) =>
                  layer.name.toLowerCase().includes(layerSearch.toLowerCase())
                );

                if (layerSearch.trim() && filteredLayers.length === 0) {
                  return null;
                }

                return (
                  <div className="group-card" key={group.id}>
                    <div
                      className="group-header"
                      onClick={() => toggleGroupExpand(group.id)}
                    >
                      <div className="group-left">
                        <span>{expandedGroups[group.id] ? "▼" : "▶"}</span>
                        <span className="group-title">{group.name}</span>
                      </div>

                      <label
                        className="switch"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isGroupAllOn(group)}
                          onChange={() => toggleGroupLayers(group)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div
                      className={`group-body ${
                        expandedGroups[group.id] ? "" : "hidden"
                      }`}
                    >
                      {filteredLayers.map((layer) => (
                        <div className="layer-item" key={layer.id}>
                          <div className="layer-info">
                            <span className="badge">{layer.category}</span>
                            <span>{layer.name}</span>
                          </div>

                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={!!layerState[layer.id]}
                              onChange={() => toggleLayer(layer.id)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="download-box">
              <button onClick={downloadCurrentGeoJSON}>
                GeoJSON 다운로드
              </button>

              <button onClick={downloadCurrentCSV}>
                CSV 다운로드
              </button>
            </div>

            <div className="panel-footer">
              활성 레이어 수: <strong>{activeCount}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;g