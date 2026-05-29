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

### shared 전용 추가 세그먼트

`shared`는 도메인이 없는 레이어이므로 아래 세그먼트를 추가로 사용한다.

| 세그먼트 | 무엇을 두는가                  | 기준                                          |
| -------- | ------------------------------ | --------------------------------------------- |
| `hooks/` | 도메인 무관한 범용 커스텀 hook | React에 의존하지만 특정 도메인 지식이 없는 것 |
| `api/`   | BFF(/api/\*) 호출용 공통 헬퍼  | 클라이언트→서버 통신 유틸                     |

- `shared/hooks/` 예시: `useStorageState`, `useDebounce`, `useMediaQuery`
- `shared/lib/`의 "React 없이 동작하는 것" 기준은 유지한다. React hook은 반드시 `shared/hooks/`에 둔다.

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

## 전역 상태 관리

전역 상태는 React Context 대신 **Zustand**를 사용한다.

- **서버 초기 데이터가 필요한 경우**: Context에 store 레퍼런스를 담는 패턴
- **클라이언트 전용 singleton**: `create()`로 모듈 레벨 생성
- 소비자는 **셀렉터**로 필요한 슬라이스만 구독한다: `use*(s => s.*)`
- Context에 값을 직접 담지 않는다.

---

## entities — React Query 패턴

서버 데이터를 다루는 entity는 아래 구조를 따른다.

```
entities/{slice}/
├── api.ts        # fetch 함수 — 요청/응답 타입 정의 포함
├── factory.ts    # queryOptions, mutationOptions (queryClient 파라미터 패턴)
├── model/
│   ├── use-*-data.ts   # useQuery + useMutation (Raw Data 위주)
│   └── use-*.ts        # 소비자 hook — 비즈니스 로직
└── index.ts
```

- `factory.ts`의 `mutationOptions`는 `(userId, queryClient)` 형태로 캐시 전략을 함께 정의한다.
- `use-*-data.ts`는 데이터 레이어만, `use-*.ts`는 비즈니스 로직을 담당한다.
- entity hook은 상위 레이어(`application`, `features`)를 import하지 않는다. 필요한 값은 파라미터로 받는다.

---

## 서버 레이어 (server/)

FSD와 별도로 서버 전용 코드는 `server/` 디렉토리에 3계층으로 구성한다.

```
server/
├── db/          # DB 클라이언트 팩토리
├── dao/         # 테이블 단위 raw DB 접근 — 'use server' 없음
├── controllers/ # dao 호출 + 캐시 무효화 — 외부 노출 유일한 진입점
├── lib/         # 서버 공통 유틸
└── types/       # 서버 공통 타입
```

- **dao**: 순수 DB 접근만. 프레임워크에 의존하지 않는다. 파일은 테이블(도메인) 단위.
- **controllers**: dao를 호출하고 캐시 무효화(`revalidatePath`)를 처리한다.
    - 클라이언트 컴포넌트에서 직접 호출하는 경우 → `'use server'` 선언
    - API route(`app/api/`)에서만 호출하는 경우 → `'use server'` 불필요
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

---

## BFF API route (app/api/)

클라이언트 → 서버 데이터 통신은 `/api/` 경로를 경유한다.

- **인증**: `proxy.ts`에서 Bearer token 검증 후 `x-user-id` 헤더로 주입. route handler는 `request.headers.get('x-user-id')`만 읽는다.
- **새 보호 라우트 추가**: `proxy.ts`의 `PROTECTED_API_PREFIXES` 배열에만 추가한다.
- route handler는 controller만 호출한다. dao를 직접 import하지 않는다.

---

## proxy.ts (Next.js 16)

Next.js 16부터 `middleware.ts` 대신 `proxy.ts`를 사용한다. export 함수명도 `proxy`다.

`proxy.ts` 역할:

1. 보호된 API 경로 인증 (Bearer token → `x-user-id` 헤더 주입)
2. 모든 응답에 보안 헤더 적용 (CSP, X-Frame-Options 등)

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
