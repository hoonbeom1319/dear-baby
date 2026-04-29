# hbw Module Playbook

`hbw`는 "내부 구현(`src`) + 외부 진입점(루트 폴더) + exports 제한" 원칙으로 운영합니다.

## 핵심 원칙

- 구현은 `src`에 둡니다.
- 외부 공개는 루트 레벨 진입점만 허용합니다.
- 배포 표면은 `package.json`의 `exports`로 관리합니다.

## 신규 모듈 추가 절차

아래 예시는 `telemetry` 모듈을 추가하는 흐름입니다.

### 1) 구현 작성

- 구현 위치: `src/telemetry/*`

예시:

- `src/telemetry/trace.ts`
- `src/telemetry/span.ts`

### 2) 루트 진입점 생성

- 공개할 파일만 루트 `telemetry/*.ts`에 re-export로 노출합니다.
- 진입점은 단일 깊이만 허용합니다 (`telemetry/*.ts`).

예시:

- `telemetry/trace.ts` -> `export * from '../src/telemetry/trace';`
- `telemetry/span.ts` -> `export * from '../src/telemetry/span';`

### 3) 빌드 엔트리 등록

`tsup.config.ts`의 `entry`에 루트 모듈 패턴을 추가합니다.

```ts
entry: ['api/*.ts', 'lib/*.ts', 'telemetry/*.ts'];
```

### 4) 타입 체크 범위 등록

`tsconfig.json`의 `include`에 루트 진입점 패턴을 추가합니다.

```json
"include": [
  "api/*.ts",
  "lib/*.ts",
  "telemetry/*.ts",
  "src/**/*.ts",
  "src/types/**/*.d.ts"
]
```

### 5) exports 등록

`package.json`의 `exports`에 공개 경로를 추가합니다.

```json
"./telemetry/*": {
  "types": "./dist/telemetry/*.d.ts",
  "import": "./dist/telemetry/*.js",
  "require": "./dist/telemetry/*.cjs"
}
```

### 6) 검증

- `npm run build`
- `dist/telemetry/*` 생성 확인
- 소비 프로젝트에서 `import { ... } from 'hbw/telemetry/trace'` 확인

## 운영 팁

- 루트 진입점 파일명과 `exports` 경로는 안정 API로 취급하세요.
- 호환성이 필요하면 기존 경로를 즉시 삭제하지 말고 한 버전 유예 후 제거하세요.
