# 환경 공간데이터 관리·시각화 플랫폼 — 프론트엔드

환경 공간데이터를 업로드하고 지도에서 조회하며, 필요한 영역과 파일 형식을 선택해 변환·다운로드를 요청하는 웹 플랫폼의 프론트엔드입니다.

학교 캡스톤 팀 프로젝트로 개발했습니다. 팀원 공동 작업물이 포함된 공개용 저장소입니다.

- **개발 기간:** 2026.03~2026.05
- **팀 구성:** 학생 4명, 멘토 1명
- **백엔드:** [p02-backend-portfolio](https://github.com/km-jun/p02-backend-portfolio)

## 사용 기술

React, JavaScript, Leaflet, react-leaflet, leaflet-draw, react-dropzone, axios, dnd-kit, Vercel

## 주요 기능

- 공간 데이터 파일 업로드와 전송 진행률 표시
- 지도 데이터 표시, 속성 조회 및 레이어 관리
- 지도 이동·확대에 따른 화면 영역 조회
- 사각형 영역 선택과 다운로드 조건 설정
- 파일 변환 요청, 작업 상태 조회 및 다운로드 링크 표시

파일 파싱·변환, DB 저장과 파일 보관은 백엔드에서 처리합니다.

## 로컬 실행

Node.js와 npm이 필요합니다.

```bash
git clone https://github.com/km-jun/p02-frontend-portfolio.git
cd p02-frontend-portfolio
npm ci
cp .env.example .env.local
npm start
```

Windows에서는 `.env.example`을 복사해 `.env.local`로 저장해도 됩니다.

`.env.local`의 `REACT_APP_API_BASE_URL`을 실행 중인 백엔드 주소로 설정하세요. 기본값은 `http://localhost:8000`입니다. 업로드·조회·다운로드 기능에는 백엔드와 DB·S3 환경이 필요합니다. 프론트엔드 환경변수에는 비밀번호나 AWS 키를 넣지 않습니다.

```bash
npm run build
```

## 현재 상태

기존 AWS 무료 플랜 종료로 현재 운영 데모는 제공하지 않습니다. 공개용 정리 당시 프론트엔드 빌드는 통과했으며, 현재 백엔드와의 통합 실행은 재검증하지 않았습니다.

## 관련 문서

- [실행·배포 상세 안내](docs/running.md)
- [개발 당시 팀 문서](docs/team-readme.md)
- [개발 이력 보존 및 공개용 정리 내역](docs/publication-notes.md)
