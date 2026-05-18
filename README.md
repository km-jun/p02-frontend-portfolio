# p02-frontend

환경 공간데이터 통합 관리 및 시각화 플랫폼 - 프론트엔드

## 기술 스택
- React
- Leaflet.js (지도 렌더링)
- react-dropzone (파일 업로드)
- axios (REST API 통신)

## 로컬 실행 방법
```bash
npm install
npm start
```

## 브랜치 전략
```
main
└── develop
    ├── feature/map-view
    ├── feature/file-upload
    ├── feature/layer-control
    ├── feature/filter-search
    └── feature/progress-bar
```

### 브랜치 규칙
| 브랜치 | 용도 |
|--------|------|
| `main` | 배포용 브랜치 (Vercel 자동 배포) |
| `develop` | 개발 통합 브랜치 |
| `feature/xxx` | 기능별 개발 브랜치 |

## 개발 흐름

### 1. 최초 세팅 (처음 한 번만)
```bash
git clone https://github.com/km-jun/p02-frontend.git
cd p02-frontend
npm install
```

### 2. 작업 시작할 때마다
```bash
# develop 브랜치로 이동 후 최신 코드 pull
git checkout develop
git pull origin develop

# 기능 브랜치 생성
git checkout -b feature/기능명
```

### 3. 작업 완료 후
```bash
# 변경사항 저장
git add .
git commit -m "feat: 기능 설명"

# 원격 저장소에 push
git push origin feature/기능명
```

### 4. Pull Request (PR) 생성
1. GitHub에서 `p02-frontend` 저장소 접속
2. **"Compare & pull request"** 버튼 클릭
3. base: `develop` ← compare: `feature/기능명` 확인
4. 제목과 설명 작성 후 **"Create pull request"** 클릭
5. 코드 리뷰 후 **"Merge pull request"** 클릭

### 5. Merge 후 로컬 정리
```bash
git checkout develop
git pull origin develop
git branch -d feature/기능명
```

## 📋 현재 진행 상황 (2026.05.18)

### ✅ 완료된 기능
- [x] 기본 지도 렌더링 (Leaflet + OpenStreetMap)
- [x] GeoJSON 파일 업로드
- [x] CSV 파일 업로드
- [x] **SHP(ZIP) 파일 업로드** ⭐
- [x] 파일명 특수문자 자동 처리
- [x] 레이어 목록 표시 및 토글
- [x] 업로드 진행률 표시
- [x] 백엔드 API 연동 완료
- [x] Vercel 자동 배포

### 🔧 백엔드 연동 정보
**API 서버**: `http://127.0.0.1:8000`

**주요 엔드포인트**:
- `POST /upload` - 파일 업로드
- `GET /layers/{category}/geojson` - 레이어 데이터 조회

### ⚠️ 알려진 이슈
**Vercel 배포에서 파일 업로드 불가**
- **원인**: Mixed Content Error (HTTPS → HTTP 차단)
- **해결**: 백엔드 HTTPS 설정 필요 (도메인 구매 후)
- **현재**: localhost:3000에서는 정상 작동 ✅

### 📅 다음 단계
1. [ ] 도메인 구매 (학교 예산 신청 중)
2. [ ] EC2 HTTPS 설정 (SSL 인증서)
3. [ ] Vercel 완전 작동 확인
4. [ ] 레이어 필터/검색 기능
5. [ ] 속성 정보 팝업

## 🚀 로컬 개발 (권장)
현재는 localhost에서 테스트를 권장합니다:
```bash
npm start
# 백엔드도 로컬 실행 시: Sidebar.jsx의 API_BASE를 localhost:8000으로 변경
```

## 🔗 관련 저장소
- 백엔드: [km-jun/p02-backend](https://github.com/km-jun/p02-backend)

## 배포
https://example.com