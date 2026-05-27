const layerGroups = [
  {
    id: "weather",
    name: "기상정보",
    expanded: true,
    layers: [
      { id: "rainfall", name: "강수량", category: "기상", defaultOn: true, layerType: "polygon" },
      { id: "temperature", name: "기온", category: "기상", defaultOn: false, layerType: "polygon" },
      { id: "wind", name: "풍속", category: "기상", defaultOn: false, layerType: "polygon" }
    ]
  },
  {
    id: "air",
    name: "대기정보",
    expanded: true,
    layers: [
      { id: "pm10", name: "미세먼지", category: "대기", defaultOn: true, layerType: "polygon" },
      { id: "pm25", name: "초미세먼지", category: "대기", defaultOn: false, layerType: "polygon" },
      { id: "ozone", name: "오존", category: "대기", defaultOn: false, layerType: "polygon" }
    ]
  },
  {
    id: "water",
    name: "수질/수문",
    expanded: true,
    layers: [
      { id: "waterLevel", name: "수위", category: "수문", defaultOn: false, layerType: "polygon" },
      { id: "flow", name: "유량", category: "수문", defaultOn: false, layerType: "polygon" }
    ]
  },
  {
    id: "basic",
    name: "행정/기본정보",
    expanded: true,
    layers: [
      { id: "boundary", name: "행정경계", category: "기본", defaultOn: true, layerType: "polygon" },
      { id: "station", name: "측정소 위치", category: "기본", defaultOn: true, layerType: "point" }
    ]
  }
];

export default layerGroups;