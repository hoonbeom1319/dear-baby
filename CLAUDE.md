# Dear Baby — 개발 컨벤션

## 아키텍처

이 프로젝트는 **Feature-Sliced Design (FSD)** 구조를 따릅니다.
모든 코드 작성과 파일 배치는 FSD 규칙을 우선합니다.

### 레이어 구조

src/
├── application/ # 앱 초기화, 프로바이더, 글로벌 스타일, 라우팅
├── screens/ # 라우트별 페이지 컴포넌트 (조립만, 로직 최소)
├── widgets/ # 페이지를 구성하는 큰 블록 (헤더, 사이드바, 피드 등)
├── features/ # 사용자 상호작용 단위 기능 (로그인 폼, 댓글 작성 등)
├── entities/ # 비즈니스 엔터티 (User, Post, Comment 등 — 도메인 단위)
└── shared/ # 재사용 가능한 인프라 (UI 키트, lib, api, config)

### 의존성 규칙 (Public API 원칙)

- **상위 레이어만 하위 레이어를 import할 수 있음.**
  app → screens → widgets → features → entities → shared
- **같은 레이어 내 슬라이스 간 import 금지.**
  예: features/auth가 features/profile을 직접 import 못 함.
  필요하면 더 낮은 레이어(entities, shared)로 끌어내려야 함.
- **import는 항상 슬라이스 루트의 index.ts(Public API)를 통해서만.**
  `entities/user/model/store.ts`를 직접 import하지 말고
  `entities/user`로 import.

### 슬라이스 내부 세그먼트

각 슬라이스 안은 다음 세그먼트로 나눕니다.

- `ui/` — 컴포넌트
- `model/` — 상태, 비즈니스 로직, 타입
- `lib/` — 슬라이스 전용 유틸
- `config/` — 슬라이스 전용 설정
- `index.ts`— Public API (외부에 노출할 것만 export)

## 새 기능을 추가할 때

1. 어느 레이어에 속하는지 먼저 판단한다.
    - 비즈니스 엔터티의 데이터/표현 → entities
    - 사용자 액션(폼 제출, 토글 등) → features
    - 페이지의 큰 블록 → widgets
    - 도메인 무관한 재사용 → shared
2. 슬라이스 폴더를 만들고 필요한 세그먼트를 채운다.
3. index.ts에 외부 노출 API를 정의한다.
4. 사용처에서는 슬라이스 루트로만 import한다.

## 코드 작성 시 항상 확인

- 새 파일을 어디에 둘지 모르겠으면 **묻고 진행한다.**
  임의로 위치 정하지 않기.
- FSD 규칙에 어긋나는 import가 필요해 보이면, 그건 설계가 잘못된
  신호다. 코드를 짜기 전에 구조를 다시 보자고 사용자에게 알린다.
- 기존 코드를 수정할 때도 FSD 경계를 흐리지 않는다.

## 기타

- 변수/함수명, 컴포넌트명은 의미를 분명하게 짓는다.
- 한 파일이 너무 커지면 슬라이스 세그먼트로 분리한다.
- 주석은 "왜"를 적고, "무엇"은 코드로 드러나게 한다.
