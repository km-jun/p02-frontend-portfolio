# 환경 공간데이터 관리·시각화 플랫폼 — 프론트엔드

학교 캡스톤 팀 프로젝트의 개인 포트폴리오용 사본입니다. 원본 팀 저장소와 별도로 관리하며, 프로젝트 전체를 개인의 단독 구현으로 주장하지 않습니다.

- **프로젝트 기간:** 2026.03~2026.05
- **공개용 정리:** 2026년 10월. 기존 커밋 작성자 이름·날짜·메시지와 브랜치 병합 이력을 보존했습니다.
- **백엔드 코드:** [p02-backend-portfolio](https://github.com/km-jun/p02-backend-portfolio)
- **운영 상태:** 기존 AWS 환경은 무료 플랜 종료로 접근할 수 없어 현재 작동하는 통합 데모를 제공하지 않습니다.

## 프로젝트 소개

공간 데이터 파일을 업로드하고 지도에서 확인하며, 범위와 형식을 선택해 다운로드하는 웹 플랫폼입니다. React·Leaflet 기반 지도 화면을 FastAPI 백엔드와 연결합니다.

## 역할 정리

당시 보고서에 기록한 본인 역할은 프로젝트 총괄 관리, DB 아키텍처 설계, PostGIS·JSONB 모델링, 프론트엔드·Leaflet 지도 UI 개발, AWS EC2·S3 인프라 구축, Vercel 배포 및 보고서 작성입니다.

현재 이력서에는 **공간 DB 설계, 프론트엔드 개발 및 AWS 인프라 구축·배포**로 요약했습니다. 이는 보고서와 본인의 역할 설명을 바탕으로 한 내용이며, Git 기록만으로 전체 담당 범위를 확정한 것은 아닙니다. 팀원도 UI와 백엔드 및 시각화 기능 개발에 참여했습니다.

### 본인 계정 커밋에서 확인되는 변경 사항

- React·Leaflet 지도와 GeoJSON 표시 화면 구성
- 파일 업로드 API 연동 및 진행률 표시, SHP ZIP 업로드 지원
- 카테고리·포맷·지역 선택 및 다운로드 상태 UI
- 레이어 선택·필터링, 속성 툴팁과 지도 영역 선택
- 지도 이동·확대 시 현재 화면 영역 조회 API 연동

위 목록은 커밋에 포함된 변경 사항이며 각 기능을 모두 단독 설계·구현했다는 의미는 아닙니다. 세부 기여는 팀원 작성 기록과 함께 확인해야 합니다.

## 사용 기술

React, JavaScript, Leaflet, react-leaflet, react-dropzone, axios, Vercel

## 로컬 실행

```bash
npm ci
cp .env.example .env.local
npm start
```

`.env.local`의 `REACT_APP_API_BASE_URL`을 준비한 백엔드 주소로 설정합니다. 기본값은 `http://localhost:8000`입니다. 업로드·조회·다운로드에는 실행 중인 백엔드와 DB·S3 설정이 필요합니다. 프론트엔드 환경변수는 브라우저에 공개되므로 비밀번호나 AWS 키를 넣지 않습니다.

```bash
npm run build
```

Vercel 배포는 이 사본에 자동으로 연결하지 않았습니다. 직접 배포할 경우 HTTPS 백엔드 주소를 환경변수로 지정하고 백엔드의 CORS 허용 출처를 맞춥니다. `/api` 프록시 방식이 필요하면 `vercel.example.json`의 예시 도메인을 실제 주소로 바꾼 후 `vercel.json`으로 저장하고 `REACT_APP_API_BASE_URL=/api`로 설정합니다.

## 공개용 보존·정리 범위

- 코드, UI 리소스, 기존 브랜치와 커밋 이력을 유지했습니다.
- 과거 서버 IP와 배포 주소는 이력에서도 로컬·예시 주소로 치환했습니다.
- 커밋 작성자의 개인 이메일은 GitHub 비공개용 주소로 치환했습니다. 작성자 이름과 작업 날짜는 유지했으며, 커밋 ID와 기존 서명 인증은 원본과 다릅니다.
- GitHub PR·이슈·댓글은 이전하지 않았습니다.
- `src/assets`의 기존 이미지는 화면 구성에 쓰인 리소스이며, 실제 서비스 실행 증빙으로 제시하지 않습니다.

---

## 개발 당시 README

아래는 원래 팀 문서를 보존한 기록입니다. 당시 완료 표시와 운영·배포 정보는 현재 실행 상태를 보장하지 않습니다. 주소는 공개용 예시로 치환되어 있습니다.

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

## 📋 현재 진행 상황 (2026.05.30)

### ✅ 완료된 기능
- [x] 기본 지도 렌더링 (Leaflet + OpenStreetMap)
- [x] GeoJSON, CSV, SHP(ZIP) 파일 업로드 및 특수문자 처리
- [x] 업로드 진행률 표시 및 백엔드 API 연동
- [x] 대용량 벡터 데이터 렌더링 최적화 (Canvas 엔진 적용)
- [x] TIF 래스터 파일 동적 히트맵 시각화 (hsla 투명도 적용)
- [x] 레이어 렌더링 완료 상태를 감지하는 로딩 UI 연동
- [x] Vercel 자동 배포

### 🔧 백엔드 연동 정보
**API 서버**: `http://127.0.0.1:8000`

**주요 엔드포인트**:
- `POST /upload` - 파일 업로드
- `GET /layers` - 레이어 목록 조회 (속도 최적화 완료)
- `GET /layers/{category}/geojson` - 벡터 레이어 데이터 조회
- `GET /layers/{category}/raster` - TIF 래스터 이미지 S3 다운로드 URL 반환

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
- 백엔드: [km-jun/p02-backend-portfolio](https://github.com/km-jun/p02-backend-portfolio)

## 배포
https://example.com