# Dear Baby — 개발 컨벤션

## 전체 프로젝트 구조

```
(project root)/
├── app/           # Next.js App Router — 라우트 정의, 메타데이터, page/layout
├── application/   # FSD: 앱 초기화, 프로바이더, 글로벌 스타일
├── screens/       # FSD: 라우트별 페이지 컴포넌트 (조립만, 로직 최소)
├── widgets/       # FSD: 페이지를 구성하는 큰 UI 블록 (헤더, 피드 등)
├── features/      # FSD: 사용자 상호작용 단위 기능 (폼, 토글 등)
├── entities/      # FSD: 비즈니스 엔터티 (Place, Course, User 등)
├── shared/        # FSD: 재사용 가능한 인프라 (UI 키트, lib, config)
├── server/        # 서버 전용 — dao / controllers / db
├── supabase/      # DB 스키마, 마이그레이션
└── public/        # 정적 파일
```

`app/`은 Next.js의 라우팅 역할만 담당한다. 실제 UI는 `screens/`에서 조립하고, `app/page.tsx`는 데이터를 fetch해서 screen 컴포넌트에 넘기는 것만 한다.

`application/providers/`는 두 종류의 Provider로 구성된다.

### Client Provider

| Provider | 훅 | 담당 |
|---|---|---|
| `AppProvider` | — | 모음집. `AuthProvider` + `FavoriteProvider` + `ToastProvider` 조합 |
| `AuthProvider` | `useAuth()` | auth 상태(`loggedIn`, `userId`), 로그인 모달(`openLogin`), `logout` |
| `FavoriteProvider` | `useFavorite()` | 즐겨찾기. `AppProvider` 내부에 중첩 (useAuth 의존) |

훅 사용 예시:
```ts
const { loggedIn, openLogin, logout } = useAuth();
const { favoriteIds, isFavorite, toggleFavorite } = useFavorite();
```

### RSC Provider (Zustand store 패턴)

| Provider | 훅 | 담당 |
|---|---|---|
| `PlacesProvider` | `usePlaces(selector)` | 장소 목록 서버 fetch, 지역 필터 |
| `CatalogProvider` | `useCatalog(selector)` | areas / categories / amenities 서버 fetch |

각 RSC Provider는 도메인 폴더 안에 3개 파일로 구성한다:
```
application/providers/
├── catalog/
│   ├── provider.tsx       # RSC — async fetch → StoreProvider 감쌈
│   ├── store.ts           # Zustand vanilla store (State + Action 타입, createStore)
│   └── store-provider.tsx # 'use client' — StoreContext + useCatalog hook
└── places/
    ├── provider.tsx
    ├── store.ts
    └── store-provider.tsx
```

훅은 **selector 기반**이다:
```ts
const areas = useCatalog((s) => s.areas);
const getArea = useCatalog((s) => s.getArea);
const area = usePlaces((s) => s.area);
const setArea = usePlaces((s) => s.setArea);
```

### Toast

`toast()`는 Provider 없이 `shared/lib`에서 직접 import해 어디서든 호출한다:
```ts
import { toast } from '@/shared/lib';
toast('저장됐어요');
toast('오류가 발생했어요', 'danger');
```
`entities/` 등 하위 레이어에서도 FSD 위반 없이 사용 가능하다.

### Provider 중첩 구조

```
app/layout.tsx (RSC)
└── PlacesProvider (RSC)          # layout에서 직접 import
    └── AppProvider (client)      # AuthProvider + FavoriteProvider + ToastProvider
        └── CatalogProvider (RSC) # layout에서 직접 import
            └── {children}
```

**import 규칙**:
- 스크린/피처 등 클라이언트 코드 → `@/application/providers` barrel (훅만 export)
- `app/layout.tsx` → RSC Provider는 파일 직접 import (`@/application/providers/catalog/provider` 등)
  — RSC를 barrel에 포함하면 클라이언트 번들에서 에러 발생

---

## FSD (Feature-Sliced Design)

이 프로젝트는 **Feature-Sliced Design** 구조를 따른다.
모든 코드 작성과 파일 배치는 FSD 규칙을 우선한다.

### 의존성 규칙 (레이어 순서)

```
app → screens → widgets → features → entities → shared
```

- **상위 레이어만 하위 레이어를 import할 수 있다.**
- **같은 레이어 내 슬라이스 간 import 금지.**
  예: `features/auth`가 `features/profile`을 직접 import 못 함.
  필요하면 더 낮은 레이어(`entities`, `shared`)로 끌어내린다.
- **import는 항상 슬라이스 루트의 `index.ts` (Public API)를 통해서만.**
  `entities/place/model/store.ts`를 직접 import하지 말고 `entities/place`로 import.

### 슬라이스 내부 세그먼트

```
슬라이스/
├── ui/       # 컴포넌트
├── model/    # 상태, 비즈니스 로직, 타입
├── lib/      # 슬라이스 전용 유틸
├── config/   # 슬라이스 전용 설정
└── index.ts  # Public API — 외부에 노출할 것만 export
```

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

FSD와 별도로 서버 전용 코드는 `server/` 디렉토리에 3개 계층으로 구성한다.

```
server/
├── db/          # Supabase 클라이언트 (createSupabaseAdmin, createSupabaseAnon)
├── dao/         # 테이블 단위 raw DB 접근 — 'use server' 없음
├── controllers/ # Next.js 서버 액션 ('use server') — dao 호출 + revalidatePath
├── lib/         # 서버 공통 유틸
└── types/       # 서버 공통 타입
```

### 계층 역할

- **db**: Supabase 클라이언트 팩토리만. admin/anon 분리.
- **dao**: Supabase 쿼리/뮤테이션만. Next.js에 의존하지 않는다. 파일은 테이블(도메인) 단위로 생성한다.
- **controllers**: `'use server'` 선언. dao를 호출하고, 뮤테이션 후 `revalidatePath`를 처리한다. 외부(`app/`, `screens/`)에 노출되는 유일한 진입점.

### 네이밍 컨벤션

| 구분 | DAO | Controller |
|------|-----|------------|
| 읽기 | `find*` | `fetch*` |
| 생성 | `insert*` | `create*` |
| 수정 | `update*` | `update*` |
| 삭제 | `delete*` | `delete*` |
| 집계 | `count*` | — |

읽기는 DAO(`find*`)와 controller(`fetch*`)가 자연스럽게 구분된다.
수정/삭제처럼 이름이 겹칠 때는 controller에서 import 시 `as dao_*` 별칭을 사용한다.

```ts
import { updatePlace as dao_updatePlace } from '../dao/places';
```

### 규칙

- `app/`, `screens/` 등에서는 **controllers만 import**한다. dao를 직접 import하지 않는다.
- 뮤테이션의 `revalidatePath`는 controller에서만 처리한다. dao는 순수 DB 접근만.
- 타입(`CreatePlaceInput`, `ReportRow` 등)은 dao에 정의하고, controller가 `export type { ... } from`으로 외부에 노출한다.
- 클라이언트에서 서버로 직접 호출이 필요한 경우(BFF)는 `app/api/` 라우트를 사용한다.

---

## 코드 작성 시 항상 확인

- 새 파일을 어디에 둘지 모르겠으면 **묻고 진행한다.** 임의로 위치 정하지 않기.
- FSD 규칙에 어긋나는 import가 필요해 보이면, 그건 설계가 잘못된 신호다. 코드를 짜기 전에 구조를 다시 보자고 사용자에게 알린다.
- 기존 코드를 수정할 때도 FSD 경계를 흐리지 않는다.
- 변수/함수명, 컴포넌트명은 의미를 분명하게 짓는다.
- 한 파일이 너무 커지면 슬라이스 세그먼트로 분리한다.
- 주석은 "왜"를 적고, "무엇"은 코드로 드러나게 한다.
