# 로컬 실행과 배포

## 준비

Node.js와 npm이 필요합니다. 업로드·조회·다운로드를 실행하려면 [백엔드 프로젝트](https://github.com/km-jun/p02-backend-portfolio)의 DB·S3 환경도 별도로 준비해야 합니다.

## 프론트엔드 실행

```bash
git clone https://github.com/km-jun/p02-frontend-portfolio.git
cd p02-frontend-portfolio
npm ci
cp .env.example .env.local
```

Windows에서는 `.env.example`을 복사해 `.env.local`로 저장해도 됩니다.

`.env.local`의 `REACT_APP_API_BASE_URL`을 준비한 백엔드 주소로 설정합니다. 기본값은 `http://localhost:8000`입니다. 설정한 뒤 개발 서버를 시작합니다.

```bash
npm start
```

실행 중 환경변수를 바꾸었다면 개발 서버를 다시 시작합니다.

프론트엔드 환경변수는 브라우저에 공개됩니다. 비밀번호나 AWS 키를 넣지 않습니다.

## 빌드

```bash
npm run build
```

생성된 `build` 폴더가 정적 배포 결과물입니다. 백엔드 연결 없이도 빌드는 가능하지만, 빌드 성공이 데이터 조회·파일 변환의 통합 동작을 보장하지는 않습니다.

## Vercel 배포 설정

이 공개용 사본에는 Vercel 자동 배포를 연결하지 않았습니다.

1. 준비한 HTTPS 백엔드 주소를 `REACT_APP_API_BASE_URL`에 설정합니다.
2. 백엔드 CORS 설정에 프론트엔드 배포 도메인을 추가합니다.
3. 새 환경변수를 적용해 빌드하고 배포합니다.

`/api` 프록시를 사용할 경우 `vercel.example.json`의 예시 도메인을 실제 HTTPS 백엔드 주소로 바꿉니다. 파일을 `vercel.json`으로 저장하고 `REACT_APP_API_BASE_URL=/api`로 설정합니다.

기존 팀 문서에 있는 Mixed Content 문제는 HTTPS 프론트엔드에서 HTTP 백엔드를 호출하면서 발생한 기록입니다. 현재 작동하는 배포 환경을 복원한 상태는 아닙니다.

[README로 돌아가기](../README.md)
