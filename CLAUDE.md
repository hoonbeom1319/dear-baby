# Dear Baby — 개발 컨벤션

## FSD (Feature-Sliced Design)

이 프로젝트는 **Feature-Sliced Design** 구조를 따른다.
모든 코드 작성과 파일 배치는 FSD 규칙을 우선한다.

### 의존성 규칙 (레이어 순서)

```
application → screens → widgets → features → entities → shared
```

- **상위 레이어만 하위 레이어를 import할 수 있다.**
- **같은 레이어 내 슬라이스 간 import 금지.**
  예: `features/auth`가 `features/profile`을 직접 import 못 함.
  필요하면 더 낮은 레이어(`entities`, `shared`)로 끌어내린다.
- **import는 항상 슬라이스 루트의 `index.ts` (Public API)를 통해서만.**
  내부 파일(`model/store.ts` 등)을 직접 import하지 않는다.

### 슬라이스 내부 세그먼트

| 세그먼트  | 무엇을 두는가                      | 기준                     |
| --------- | ---------------------------------- | ------------------------ |
| `ui/`     | props만 받아 렌더링하는 컴포넌트   | 내부 상태·로직 없음      |
| `model/`  | hook, store, 도메인 로직           | React에 의존하는 모든 것 |
| `lib/`    | 순수 유틸, 브라우저 API 헬퍼, 상수 | React 없이 동작하는 것   |
| `config/` | 슬라이스 전용 상수·설정값          | 코드가 아닌 값           |

### Feature 루트 컴포넌트 역할

feature 루트 컴포넌트는 state와 action을 보유하고 `model/` hook을 호출하는 **조립 지점**이다.

**`ui/`로 분리하는 기준**: 상태별로 마크업이 충분히 달라서 루트에 다 두면 흐름 파악이 어려울 때.
**루트에 마크업이 있어도 괜찮은 경우**: 포지셔닝 컨테이너, 로딩 오버레이, UI 변형이 단순한 feature. 분리 기준이 안 되는 JSX를 억지로 빼면 의미 없는 Wrapper 파일만 생긴다.

### 새 기능을 추가할 때

1. 어느 레이어에 속하는지 먼저 판단한다.
    - 비즈니스 엔터티의 데이터/표현 → `entities`
    - 사용자 액션 (폼 제출, 토글 등) → `features`
    - 페이지의 큰 블록 → `widgets`
    - 도메인 무관한 재사용 → `shared`
2. 슬라이스 폴더를 만들고 필요한 세그먼트를 채운다.
3. `index.ts`에 외부 노출 API를 정의한다.
4. 사용처에서는 슬라이스 루트로만 import한다.

---

## 서버 레이어 (server/)

FSD와 별도로 서버 전용 코드는 `server/` 디렉토리에 3계층으로 구성한다.

```
server/
├── db/          # DB 클라이언트 팩토리
├── dao/         # 테이블 단위 raw DB 접근 — 'use server' 없음
├── controllers/ # 서버 액션 ('use server') — dao 호출 + 캐시 무효화
├── lib/         # 서버 공통 유틸
└── types/       # 서버 공통 타입
```

- **dao**: 순수 DB 접근만. 프레임워크에 의존하지 않는다. 파일은 테이블(도메인) 단위.
- **controllers**: `'use server'` 선언. dao를 호출하고 캐시 무효화(`revalidatePath`)를 처리한다. 외부에 노출되는 유일한 진입점.
- `app/`, `screens/` 등에서는 **controllers만 import**한다. dao를 직접 import하지 않는다.
- 타입은 dao에 정의하고, controller가 `export type { ... } from`으로 외부에 노출한다.

### 네이밍 컨벤션

DAO와 Controller 간 함수명 구분 규칙:

| 구분 | DAO       | Controller |
| ---- | --------- | ---------- |
| 읽기 | `find*`   | `fetch*`   |
| 생성 | `insert*` | `create*`  |
| 수정 | `update*` | `modify*`  |
| 삭제 | `delete*` | `remove*`  |
| 집계 | `count*`  | —          |

수정/삭제처럼 이름이 겹칠 때는 Controller에서 import 시 `as dao_*` 별칭을 사용한다.

```ts
import { updatePlace as dao_updatePlace } from '../dao/places';
```

---

## 아이콘

프로젝트 전용 아이콘 컴포넌트를 우선 사용한다.
목록에 없으면 아이콘 라이브러리(`@radix-ui/react-icons`)에서 import한다.
인라인 SVG는 작성하지 않는다.

---

## 코드 작성 시 항상 확인

- 새 파일을 어디에 둘지 모르겠으면 **묻고 진행한다.** 임의로 위치 정하지 않기.
- FSD 규칙에 어긋나는 import가 필요해 보이면, 그건 설계가 잘못된 신호다. 코드를 짜기 전에 구조를 다시 보자고 사용자에게 알린다.
- 변수/함수명, 컴포넌트명은 의미를 분명하게 짓는다.
- 한 파일이 너무 커지면 슬라이스 세그먼트로 분리한다.
- 주석은 "왜"를 적고, "무엇"은 코드로 드러나게 한다.
