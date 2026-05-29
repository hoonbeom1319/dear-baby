# Dear Baby — 프로젝트 아키텍처

## 전체 디렉토리 구조

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

---

## application/providers/

두 종류의 Provider로 구성된다.

### Client Provider

| Provider | 훅 | 담당 |
|---|---|---|
| `AppProvider` | — | 모음집. `AuthProvider` + `FavoriteProvider` + `ToastProvider` 조합 |
| `AuthProvider` | `useAuth()` | auth 상태(`loggedIn`, `userId`), 로그인 모달(`openLogin`), `logout` |
| `FavoriteProvider` | `useFavorite()` | 즐겨찾기. `AppProvider` 내부에 중첩 (useAuth 의존) |

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

### Provider 중첩 구조

```
app/layout.tsx (RSC)
└── PlacesProvider (RSC)
    └── AppProvider (client)
        └── CatalogProvider (RSC)
            └── {children}
```

**import 규칙**:
- 스크린/피처 등 클라이언트 코드 → `@/application/providers` barrel (훅만 export)
- `app/layout.tsx` → RSC Provider는 파일 직접 import (`@/application/providers/catalog/provider` 등)
  — RSC를 barrel에 포함하면 클라이언트 번들에서 에러 발생

---

## server/ 레이어 (프로젝트 구현)

> 패턴과 네이밍 컨벤션은 CLAUDE.md 참고. 여기는 이 프로젝트 전용 구현 세부사항.

- **db**: `createSupabaseAdmin` (서비스 롤), `createSupabaseAnon` (익명) 두 클라이언트 팩토리.
- **dao**: Supabase 쿼리/뮤테이션. 파일은 테이블(도메인) 단위로 생성한다.
- BFF가 필요한 경우 `app/api/` 라우트를 사용한다.
