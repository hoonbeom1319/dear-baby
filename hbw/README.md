# hbw

훈범 개인 공통 자산 모음입니다.

`hbw` 폴더 자체를 하나의 패키지/저장소 단위로 관리합니다.

## 포함 범위

- 공통 개발 코드: `src`
- 공통 개발환경 설정: `config`

## 분리 전략

1. `hbw` 폴더만 새 저장소로 복사
2. 루트 `package.json` 기준으로 패키지 관리
3. 각 프로젝트에서 `hbw` 저장소를 패키지 의존성으로 연결

## Build

- `npm install`
- `npm run build`

## Public imports

- `hbw/api/fetch`
- `hbw/lib/device`
- `hbw/lib/number`
- `hbw/lib/object`
- `hbw/lib/string`

## Module guide

- 신규 모듈 추가 규칙: `CONTRIBUTING.md`
