import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import API_BASE from '../../config';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COLORS = ['#9333ea', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const DEFAULT_GROUPS = {
  "지하수 정보": ["연간 지하수 재충전", "지하수", "지하수 산출량(양수량)", "지하수 산출량(투수량계수)", "지하수 등수위선", "지하수 질산성질소"],
  "토지 및 지표": ["중분류 토지피복", "지표수 유기오염", "불투수면 비율"],
  "기타 수자원": ["하천구역", "해수침투 지수"],
  "분류 안됨": []
};

const SortableLayerItem = React.memo(({ layer, isSelected, onToggle, loadingLayers, isMyUpload, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: layer.category });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform), transition,
    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
    borderRadius: 4, marginBottom: 4, fontSize: 12,
    background: isSelected ? '#eff6ff' : 'white', border: '1px solid #e5e7eb',
    opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 999 : 1, position: 'relative',
  }), [transform, transition, isSelected, isDragging]);

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '0 4px', color: '#9ca3af', userSelect: 'none' }}>⠿</div>
      <input type="checkbox" checked={isSelected} onChange={() => onToggle(layer.category)} disabled={loadingLayers} style={{ cursor: 'pointer' }} />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', userSelect: 'none' }}>{layer.category}</span>

      {isMyUpload && (
        <button
          onClick={(e) => onDelete(layer.category, e)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, padding: '0 4px' }}
          title="레이어 삭제"
        >
          🗑️
        </button>
      )}
    </div>
  );
});

const DroppableFolderArea = React.memo(({ id, categories, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = useMemo(() => ({
    padding: '4px 4px 8px 8px',
    minHeight: categories.length === 0 ? '40px' : '10px',
    background: isOver && categories.length === 0 ? '#f0fdf4' : 'transparent',
    borderRadius: '4px', transition: 'background 0.2s', border: isOver && categories.length === 0 ? '1px dashed #22c55e' : 'none'
  }), [isOver, categories.length]);

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
});

export default function LayerPanel({ layers, onToggle, onAddLayer, availableLayers, mapBounds }) {
  const [loadingLayers, setLoadingLayers] = useState(false);

  const myUploads = JSON.parse(localStorage.getItem('myUploads') || '[]');

  const handleDeleteLayer = async (category, e) => {
    e.stopPropagation();
    if (!window.confirm(`'${category}' 레이어를 완전히 삭제하시겠습니까?\n(DB와 S3 원본 파일이 모두 삭제됩니다.)`)) return;

    try {
      await axios.delete(`${API_BASE}/layers/${category}`);

      const updatedUploads = myUploads.filter(c => c !== category);
      localStorage.setItem('myUploads', JSON.stringify(updatedUploads));

      alert('성공적으로 삭제되었습니다.');
      window.location.reload();
    } catch (error) {
      alert(`삭제 실패: ${error.response?.data?.detail || error.message}`);
    }
  };

  // 1. 레이어 소속 그룹 State
  const [customGroups, setCustomGroups] = useState(() => {
    const saved = localStorage.getItem('customLayerGroupsV3');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_GROUPS));
  });

  // 2. 폴더 렌더링 순서 State
  const [folderOrder, setFolderOrder] = useState(() => {
    const saved = localStorage.getItem('customFolderOrderV3');
    return saved ? JSON.parse(saved) : Object.keys(DEFAULT_GROUPS);
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({});
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    localStorage.setItem('customLayerGroupsV3', JSON.stringify(customGroups));
    localStorage.setItem('customFolderOrderV3', JSON.stringify(folderOrder));
  }, [customGroups, folderOrder]);

  // 새로운 레이어 자동 분류 로직 최적화
  useEffect(() => {
    if (!availableLayers || availableLayers.length === 0) return;
    setCustomGroups(prevGroups => {
      const newGroups = { ...prevGroups };
      const allAssigned = new Set();
      Object.values(newGroups).forEach(list => list.forEach(item => allAssigned.add(item)));
      let isModified = false;
      availableLayers.forEach(layer => {
        const cat = layer.category;
        if (!allAssigned.has(cat)) {
          isModified = true;
          let target = "분류 안됨";
          for (const [folder, items] of Object.entries(DEFAULT_GROUPS)) {
            if (items.includes(cat)) { target = folder; break; }
          }
          if (!newGroups[target]) newGroups[target] = [];
          newGroups[target].push(cat);
          allAssigned.add(cat);
        }
      });
      return isModified ? newGroups : prevGroups;
    });
  }, [availableLayers]);

  useEffect(() => {
    const activeLayerNames = layers.filter(l => l.visible).map(l => l.name);

    if (!mapBounds || activeLayerNames.length === 0) return;

    const timer = setTimeout(async () => {
      const updateLayers = async () => {
        for (const category of activeLayerNames) {
          try {
            const res = await axios.post(`${API_BASE}/spatial/search`, { category, ...mapBounds, limit: 1000 });
            const existingLayer = layers.find(l => l.name === category);
            if (existingLayer) {
              onAddLayer([...layers.filter(l => l.name !== category), { ...existingLayer, data: res.data }]);
            }
          } catch (error) { console.error(`${category} 실패:`, error); }
        }
      };
      updateLayers();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapBounds]);

  const handleLayerToggle = useCallback(async (category) => {
    const existingLayer = layers.find(l => l.name === category);

    if (existingLayer) {
      const updatedLayers = layers.map(l =>
        l.name === category ? { ...l, visible: !l.visible } : l
      );
      onAddLayer(updatedLayers);

    } else {
      setLoadingLayers(true);
      try {
        let geoData;
        if (mapBounds) {
          const res = await axios.post(`${API_BASE}/spatial/search`, { category, ...mapBounds, limit: 50000 });
          geoData = res.data;
        } else {
          const res = await axios.get(`${API_BASE}/layers/${category}/geojson`);
          geoData = res.data;
        }

        const newLayer = {
          id: Date.now(),
          name: category,
          data: geoData,
          color: COLORS[layers.length % COLORS.length],
          visible: true
        };

        onAddLayer([...layers, newLayer]);

      } catch (error) {
        alert(`로딩 실패: ${error.message}`);
      } finally {
        setLoadingLayers(false);
      }
    }
  }, [layers, mapBounds, onAddLayer]);

  const toggleFolder = useCallback((folderName) => {
    setExpandedFolders(prev => ({ ...prev, [folderName]: prev[folderName] === false ? true : false }));
  }, []);

  const handleCreateFolderSubmit = () => {
    const name = newFolderName.trim();
    if (!name) return alert("이름을 입력해주세요.");
    if (customGroups[name]) return alert("이미 존재하는 폴더입니다.");
    setCustomGroups(prev => ({ ...prev, [name]: [] }));
    setFolderOrder(prev => {
      const filtered = prev.filter(f => f !== "분류 안됨");
      return [name, ...filtered, "분류 안됨"];
    });
    setNewFolderName('');
    setIsModalOpen(false);
  };

  const deleteFolder = useCallback((folderName, e) => {
    e.stopPropagation();
    if (folderName === "분류 안됨") return alert("기본 폴더는 삭제할 수 없습니다.");
    if (window.confirm(`'${folderName}' 폴더를 삭제하시겠습니까?`)) {
      setCustomGroups(prev => {
        const newGroups = { ...prev };
        const orphanLayers = newGroups[folderName];
        delete newGroups[folderName];
        newGroups["분류 안됨"] = [...newGroups["분류 안됨"], ...orphanLayers];
        return newGroups;
      });
      setFolderOrder(prev => prev.filter(f => f !== folderName));
    }
  }, []);

  const moveFolder = useCallback((folderName, direction, e) => {
    e.stopPropagation();
    setFolderOrder(prev => {
      const idx = prev.indexOf(folderName);
      if (idx < 0) return prev;
      const newOrder = [...prev];
      if (direction === 'up' && idx > 0) {
        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
      } else if (direction === 'down' && idx < prev.length - 2) {
        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
      }
      return newOrder;
    });
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    setCustomGroups(prev => {
      let activeContainer = Object.keys(prev).find(key => prev[key].includes(activeId));
      let overContainer = Object.keys(prev).find(key => prev[key].includes(overId)) || overId;

      if (!activeContainer || !overContainer || !prev[overContainer]) return prev;

      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.indexOf(activeId);

      if (activeContainer === overContainer) {
        const overIndex = overItems.indexOf(overId);
        return { ...prev, [activeContainer]: arrayMove(overItems, activeIndex, overIndex) };
      }
      const newActiveItems = activeItems.filter(item => item !== activeId);
      const newOverItems = [...overItems, activeId];
      return { ...prev, [activeContainer]: newActiveItems, [overContainer]: newOverItems };
    });
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 12, right: 12, zIndex: 1000,
      background: 'white', border: '1px solid #e5e7eb',
      borderRadius: 10, padding: '16px', width: 290,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '80vh',
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#111827', userSelect: 'none' }}>레이어 목록</p>
        <button onClick={() => setIsModalOpen(true)} style={{
          background: '#3b82f6', color: 'white', border: 'none',
          borderRadius: 4, padding: '4px 8px', fontSize: 11, cursor: 'pointer', fontWeight: 'bold'
        }}>+ 새 폴더</button>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'absolute', top: 50, left: 10, right: 10, background: 'white', zIndex: 1010,
          padding: '12px', border: '1px solid #3b82f6', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 12, fontWeight: 'bold', userSelect: 'none' }}>새 폴더 이름 입력</p>
          <input
            autoFocus value={newFolderName} onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateFolderSubmit()}
            style={{ width: '100%', padding: '6px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <button onClick={() => setIsModalOpen(false)} style={{ padding: '4px 8px', fontSize: 11, border: '1px solid #d1d5db', background: 'white', borderRadius: 4, cursor: 'pointer' }}>취소</button>
            <button onClick={handleCreateFolderSubmit} style={{ padding: '4px 8px', fontSize: 11, border: 'none', background: '#3b82f6', color: 'white', borderRadius: 4, cursor: 'pointer' }}>확인</button>
          </div>
        </div>
      )}

      <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
          {folderOrder.map((folderName, index) => {
             const categories = customGroups[folderName];
             if (!categories) return null;
             const isExpanded = expandedFolders[folderName] !== false;

             return (
               <div key={folderName} style={{ marginBottom: 12 }}>
                 <div onClick={() => toggleFolder(folderName)} style={{
                     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                     padding: '6px 8px', backgroundColor: '#f3f4f6', borderRadius: '6px', cursor: 'pointer', userSelect: 'none'
                   }}>
                   <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
                     {isExpanded ? '📂' : '📁'} {folderName}
                   </span>
                   <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                     {folderName !== "분류 안됨" && (
                       <>
                         <button onClick={(e) => moveFolder(folderName, 'up', e)} disabled={index === 0} style={{ background:'transparent', border:'none', cursor: index === 0 ? 'default' : 'pointer', fontSize:11, padding: 0, opacity: index === 0 ? 0.3 : 1 }}>▲</button>
                         <button onClick={(e) => moveFolder(folderName, 'down', e)} disabled={index === folderOrder.length - 2} style={{ background:'transparent', border:'none', cursor: index === folderOrder.length - 2 ? 'default' : 'pointer', fontSize:11, padding: 0, opacity: index === folderOrder.length - 2 ? 0.3 : 1 }}>▼</button>
                         <button onClick={(e) => deleteFolder(folderName, e)} style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:11, marginLeft: 4 }}>❌</button>
                       </>
                     )}
                   </div>
                 </div>

                 {isExpanded && (
                   <DroppableFolderArea id={folderName} categories={categories}>
                     <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                       {categories.map((catName) => {
                         const layerData = availableLayers?.find(l => l.category === catName);
                         if (!layerData) return null;
                         const isSelected = layers.some(l => l.name === catName && l.visible);
                         const isMyUpload = myUploads.includes(catName);
                         return <SortableLayerItem key={catName} layer={layerData} isSelected={isSelected} onToggle={handleLayerToggle} loadingLayers={loadingLayers} isMyUpload={isMyUpload} onDelete={handleDeleteLayer} />;
                       })}
                     </SortableContext>
                     {categories.length === 0 && <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', padding: '8px 0', border: '1px dashed #d1d5db', borderRadius: 4, userSelect: 'none' }}>여기로 드래그하세요</div>}
                   </DroppableFolderArea>
                 )}
               </div>
             );
          })}
          <DragOverlay dropAnimation={defaultDropAnimationSideEffects({ sideEffects: ['default'] })}>
            {activeId ? (
              <div style={{
                padding: '6px 8px', background: 'white', border: '1px solid #3b82f6',
                borderRadius: 4, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', gap: 8, opacity: 0.9, pointerEvents: 'none', userSelect: 'none'
              }}><span style={{ color: '#9ca3af' }}>⠿</span> {activeId}</div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {loadingLayers && <p style={{ fontSize: 11, color: '#3b82f6', textAlign: 'center', margin: '8px 0 0', fontWeight: 'bold', userSelect: 'none' }}>레이어 데이터 로딩 중...</p>}
    </div>
  );
}