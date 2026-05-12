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

## 배포
https://example.com