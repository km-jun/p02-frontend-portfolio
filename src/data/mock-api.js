function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const mockLayerData = {
  boundary: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남시 행정경계", region: "하남", type: "행정경계" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.130, 37.565],
            [127.190, 37.565],
            [127.200, 37.530],
            [127.185, 37.495],
            [127.140, 37.500],
            [127.120, 37.530],
            [127.130, 37.565]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "수원시 예시경계", region: "수원", type: "행정경계" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [126.970, 37.320],
            [127.060, 37.320],
            [127.070, 37.260],
            [126.990, 37.240],
            [126.950, 37.280],
            [126.970, 37.320]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산시 예시경계", region: "부산", type: "행정경계" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.020, 35.220],
            [129.120, 35.220],
            [129.140, 35.140],
            [129.060, 35.110],
            [129.000, 35.160],
            [129.020, 35.220]
          ]]
        }
      }
    ]
  },

  station: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 측정소 A", region: "하남", status: "정상", value: 32 },
        geometry: { type: "Point", coordinates: [127.150, 37.548] }
      },
      {
        type: "Feature",
        properties: { name: "서울 측정소 A", region: "서울", status: "정상", value: 41 },
        geometry: { type: "Point", coordinates: [127.000, 37.565] }
      },
      {
        type: "Feature",
        properties: { name: "수원 측정소 A", region: "수원", status: "점검중", value: 27 },
        geometry: { type: "Point", coordinates: [127.020, 37.280] }
      },
      {
        type: "Feature",
        properties: { name: "대전 측정소 A", region: "대전", status: "정상", value: 29 },
        geometry: { type: "Point", coordinates: [127.385, 36.350] }
      },
      {
        type: "Feature",
        properties: { name: "부산 측정소 A", region: "부산", status: "정상", value: 35 },
        geometry: { type: "Point", coordinates: [129.075, 35.165] }
      }
    ]
  },

  rainfall: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 강수량", region: "하남", value: "18mm" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.138, 37.560],
            [127.155, 37.560],
            [127.155, 37.548],
            [127.138, 37.548],
            [127.138, 37.560]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "서울 강수량", region: "서울", value: "14mm" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [126.970, 37.585],
            [127.010, 37.585],
            [127.010, 37.555],
            [126.970, 37.555],
            [126.970, 37.585]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "수원 강수량", region: "수원", value: "10mm" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [126.995, 37.295],
            [127.030, 37.295],
            [127.030, 37.265],
            [126.995, 37.265],
            [126.995, 37.295]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산 강수량", region: "부산", value: "22mm" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.045, 35.180],
            [129.090, 35.180],
            [129.090, 35.145],
            [129.045, 35.145],
            [129.045, 35.180]
          ]]
        }
      }
    ]
  },

  temperature: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 기온", region: "하남", value: "22℃" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.120, 37.558],
            [127.136, 37.558],
            [127.136, 37.544],
            [127.120, 37.544],
            [127.120, 37.558]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "서울 기온", region: "서울", value: "21℃" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [126.945, 37.575],
            [126.985, 37.575],
            [126.985, 37.545],
            [126.945, 37.545],
            [126.945, 37.575]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "대전 기온", region: "대전", value: "24℃" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.350, 36.370],
            [127.410, 36.370],
            [127.410, 36.330],
            [127.350, 36.330],
            [127.350, 36.370]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산 기온", region: "부산", value: "25℃" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.030, 35.175],
            [129.080, 35.175],
            [129.080, 35.135],
            [129.030, 35.135],
            [129.030, 35.175]
          ]]
        }
      }
    ]
  },

  wind: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 풍속", region: "하남", value: "3.2m/s" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.180, 37.538],
            [127.196, 37.538],
            [127.196, 37.522],
            [127.180, 37.522],
            [127.180, 37.538]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "수원 풍속", region: "수원", value: "4.1m/s" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [126.965, 37.285],
            [126.995, 37.285],
            [126.995, 37.255],
            [126.965, 37.255],
            [126.965, 37.285]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "대전 풍속", region: "대전", value: "2.8m/s" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.370, 36.365],
            [127.425, 36.365],
            [127.425, 36.325],
            [127.370, 36.325],
            [127.370, 36.365]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산 풍속", region: "부산", value: "5.0m/s" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.085, 35.185],
            [129.120, 35.185],
            [129.120, 35.145],
            [129.085, 35.145],
            [129.085, 35.185]
          ]]
        }
      }
    ]
  },

  pm10: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 미세먼지", region: "하남", grade: "보통", value: 45 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.145, 37.552],
            [127.162, 37.552],
            [127.162, 37.538],
            [127.145, 37.538],
            [127.145, 37.552]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "서울 미세먼지", region: "서울", grade: "나쁨", value: 61 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [126.990, 37.570],
            [127.030, 37.570],
            [127.030, 37.540],
            [126.990, 37.540],
            [126.990, 37.570]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "수원 미세먼지", region: "수원", grade: "보통", value: 39 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.005, 37.285],
            [127.035, 37.285],
            [127.035, 37.255],
            [127.005, 37.255],
            [127.005, 37.285]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산 미세먼지", region: "부산", grade: "좋음", value: 22 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.055, 35.175],
            [129.095, 35.175],
            [129.095, 35.145],
            [129.055, 35.145],
            [129.055, 35.175]
          ]]
        }
      }
    ]
  },

  pm25: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 초미세먼지", region: "하남", grade: "나쁨", value: 38 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.165, 37.552],
            [127.182, 37.552],
            [127.182, 37.538],
            [127.165, 37.538],
            [127.165, 37.552]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "서울 초미세먼지", region: "서울", grade: "매우나쁨", value: 52 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [126.945, 37.540],
            [126.985, 37.540],
            [126.985, 37.510],
            [126.945, 37.510],
            [126.945, 37.540]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "대전 초미세먼지", region: "대전", grade: "보통", value: 20 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.335, 36.355],
            [127.390, 36.355],
            [127.390, 36.315],
            [127.335, 36.315],
            [127.335, 36.355]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산 초미세먼지", region: "부산", grade: "좋음", value: 15 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.000, 35.150],
            [129.040, 35.150],
            [129.040, 35.120],
            [129.000, 35.120],
            [129.000, 35.150]
          ]]
        }
      }
    ]
  },

  ozone: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 오존", region: "하남", grade: "좋음", value: 0.021 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.145, 37.520],
            [127.162, 37.520],
            [127.162, 37.507],
            [127.145, 37.507],
            [127.145, 37.520]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "서울 오존", region: "서울", grade: "보통", value: 0.034 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.020, 37.545],
            [127.055, 37.545],
            [127.055, 37.515],
            [127.020, 37.515],
            [127.020, 37.545]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "수원 오존", region: "수원", grade: "좋음", value: 0.019 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [126.960, 37.250],
            [126.995, 37.250],
            [126.995, 37.220],
            [126.960, 37.220],
            [126.960, 37.250]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산 오존", region: "부산", grade: "보통", value: 0.030 },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.090, 35.150],
            [129.125, 35.150],
            [129.125, 35.120],
            [129.090, 35.120],
            [129.090, 35.150]
          ]]
        }
      }
    ]
  },

  waterLevel: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 수위", region: "하남", value: "2.3m" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.120, 37.548],
            [127.135, 37.548],
            [127.135, 37.532],
            [127.120, 37.532],
            [127.120, 37.548]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "대전 수위", region: "대전", value: "1.8m" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.400, 36.355],
            [127.430, 36.355],
            [127.430, 36.325],
            [127.400, 36.325],
            [127.400, 36.355]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산 수위", region: "부산", value: "2.7m" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.030, 35.205],
            [129.065, 35.205],
            [129.065, 35.175],
            [129.030, 35.175],
            [129.030, 35.205]
          ]]
        }
      }
    ]
  },

  flow: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "하남 유량", region: "하남", value: "12.8㎥/s" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.184, 37.548],
            [127.198, 37.548],
            [127.198, 37.532],
            [127.184, 37.532],
            [127.184, 37.548]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "수원 유량", region: "수원", value: "9.4㎥/s" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [127.040, 37.270],
            [127.070, 37.270],
            [127.070, 37.240],
            [127.040, 37.240],
            [127.040, 37.270]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "부산 유량", region: "부산", value: "14.2㎥/s" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [129.100, 35.190],
            [129.135, 35.190],
            [129.135, 35.160],
            [129.100, 35.160],
            [129.100, 35.190]
          ]]
        }
      }
    ]
  }
};

export async function fetchLayerGeoJSON(layerId) {
  await delay(150);
  const data = mockLayerData[layerId];

  if (!data) {
    throw new Error(`mock 데이터 없음: ${layerId}`);
  }

  return JSON.parse(JSON.stringify(data));
}