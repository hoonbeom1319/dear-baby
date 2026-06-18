# Handoff: 우리 가족 추억 지도 (Family Memory Map) — 지도 마커 & 히트맵

## Overview
가족이 아이와 다녀온 장소를 사진으로 자동 정리해 지도에 핀으로 쌓아가는 모바일 앱(dear-baby)의 프로토타입입니다. 이 핸드오프는 전체 플로우(온보딩 → 사진 선택 → 로그인 → 하루 편집기 → 저장 → 지도 → 장소 상세)를 담고 있으며, **이번 작업의 핵심은 지도 홈 화면의 마커 시스템 개편**입니다:

1. 큰 물방울(teardrop) 핀 → **작은 원형 도트 마커**로 교체 (핀이 너무 커 보이는 문제 해결).
2. **히트맵 레이어**: 같은 장소를 자주 방문할수록 글로우가 더 넓고 진해짐. 가까운 장소들이 겹치면 색이 더 짙어져 "자주 가는 동네"가 시각적으로 드러남.

## About the Design Files
번들에 포함된 `dear-baby V2.dc.html`은 **HTML로 만든 디자인 레퍼런스**입니다 — 의도한 모양과 동작을 보여주는 프로토타입이지, 그대로 가져다 쓰는 프로덕션 코드가 아닙니다. 목표는 **대상 코드베이스의 기존 환경(React Native, Flutter, SwiftUI, 네이티브 등)과 패턴/라이브러리로 이 디자인을 재현**하는 것입니다. 환경이 아직 없다면 프로젝트에 가장 적합한 프레임워크를 선택해 구현하세요.

이 앱은 실제 지도(카카오맵/구글맵 SDK) 위에 동작하는 것을 전제로 합니다. 프로토타입의 지도는 SVG 일러스트로 대체돼 있으니, **실제 구현에서는 지도 SDK의 커스텀 오버레이로 마커와 히트맵 레이어를 올리면 됩니다** (아래 "지도 SDK 통합" 참고).

## Fidelity
**High-fidelity (hifi)** — 색상, 타이포그래피, 간격, 인터랙션이 최종 의도값입니다. 마커/히트맵 시각 처리는 픽셀 단위로 재현하되, 지도 자체는 실제 지도 SDK로 대체하세요.

---

## 핵심: 지도 마커 & 히트맵 시스템

스크린샷: `screenshots/map-heatmap.png`

### 데이터 모델
각 "장소(place)"는 좌표 1개 + 방문(visit) 배열을 가집니다. 마커/히트의 강도는 **그 장소의 방문 횟수(`visits.length`)** 로 결정됩니다.

```
place = { id, name, x, y /* 또는 lat,lng */, src: 'kakao'|'free', visits: [...] }
```

`t` (정규화 강도) = `min(1, place.visits.length / maxVisits)`, 단 `maxVisits = max(2, 모든 장소 방문수의 최댓값)` — 분모 하한을 2로 둬서 방문 1회짜리가 100%로 타오르지 않게 함.

### 1) 도트 마커 (기본, `markerStyle = 'dot'`)
장소 좌표에 **중앙 정렬**(translate(-50%,-50%))되는 원형 배지.

- **크기**: `round(24 + t * 9)` px → 24~33px (방문 많을수록 큼)
- **배경색(방문 강도별 단계)**:
  - `t > 0.62` → `oklch(52% 0.2 34)` (가장 진한 적색)
  - `t > 0.30` → `oklch(60% 0.21 40)`
  - 그 외 → `oklch(68% 0.2 47)` (밝은 주황)
- **테두리/그림자**: `box-shadow: 0 2px 5px rgba(15,23,42,0.3), 0 0 0 2px #fff;` (2px 흰색 링 + 부드러운 그림자)
- **숫자(방문 횟수)**: 흰색, weight 700, `font-size: round(11 + t*2)` px (11~13), `font-variant-numeric: tabular-nums`, `line-height: 1`
- **탭**: 해당 장소 상세 화면으로 이동

### 2) 핀 마커 (대안, `markerStyle = 'pin'`)
작아진 물방울 핀. 좌표에 **하단 끝점 정렬**(translate(-50%,-100%)).

- SVG 34×34, path `M12 22s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z`
- `fill`은 도트와 동일한 강도별 색, `stroke="#fff" stroke-width="1.6"`
- `filter: drop-shadow(0 3px 4px rgba(15,23,42,0.28))`
- 숫자: 흰색 700, 11px, 핀 상단 7px 위치에 절대배치

### 3) 히트맵 레이어 (`heatmap = true`)
마커 **아래** 레이어. 컨테이너에 `mix-blend-mode: multiply; pointer-events:none;` — 겹치는 글로우가 곱연산으로 더 짙어짐.

장소별 블롭(원):
- **크기**: `round(92 + t * 138)` px → 92~230px, 좌표 중앙 정렬
- **밀도 계수** `i = 0.55 + t*0.45`
- **배경(radial-gradient)**:
  ```
  radial-gradient(circle,
    oklch(60% 0.21 38 / {0.32*i}) 0%,
    oklch(68% 0.2 46 / {0.18*i}) 42%,
    oklch(74% 0.17 52 / 0) 72%)
  ```
  중심 불투명도와 반경이 방문수에 비례 → "같은 장소 = 더 진하게" 요구 충족.

### 4) 신규 핀 강조 (`isNew`)
방금 저장한 장소는 펄스 링: 36×36 원, `oklch(70.5% 0.213 47.604)`, `animation: db-ring 1.7s ease-out infinite`. 도트는 중앙(top: -18px 보정), 핀은 top:4px. 지도 진입 3초 후 자동 해제.

```css
@keyframes db-ring { 0% { transform: translate(-50%,-50%) scale(0.55); opacity:.55 } 100% { transform: translate(-50%,-50%) scale(2.5); opacity:0 } }
```

### Tweakable props (루트 컴포넌트)
- `heatmap: boolean` (default `true`) — 히트 레이어 on/off
- `markerStyle: 'dot' | 'pin'` (default `'dot'`)

### 지도 SDK 통합 (실제 구현)
- **카카오맵**: 도트/핀은 `CustomOverlay`로, 히트맵 블롭은 별도 `CustomOverlay`(또는 캔버스 오버레이)에 `mix-blend-mode: multiply` div로 올림. 줌 레벨에 따라 블롭 px 크기 재계산 필요.
- **대안**: deck.gl `HeatmapLayer` / Google Maps `HeatmapLayer`로 히트를 그리되, 색 램프를 위 oklch 값에 맞춰 커스텀.
- **클러스터링**: PRD의 1.5km 클러스터링은 유지. 단 "같은 장소 반복 방문"은 클러스터가 아니라 **단일 장소의 방문수=강도**로 표현(클러스터 묶음 카운트와 구분).

---

## Screens / Views (전체 플로우 요약)

화면 전환은 `state.screen` 으로 관리: `onboarding | map | select | login | editor | saved | place`. 프로토타입 하단 "프로토타입 내비게이션" 칩으로 각 화면 점프 가능(프로덕션에서는 제거).

### C-1 온보딩 (빈 지도)
- 빈 지도 일러스트 + 점선 "미래 핀" 고스트 + 하단 카드.
- 카드: 60×60 아이콘 타일(`oklch(95.4% 0.038 75.164)` 배경), H1 27px/800/`-0.025em`, 본문 16px/`#475569`, 풀폭 54px 버튼(`oklch(64.6% 0.222 41.116)`, radius 14px).
- 액션: "첫 기록 남기기" → 사진 선택.

### 지도 홈 (map) — 위 마커/히트맵 시스템 적용
- 상단 플로팅 카드(top:58px, 좌우 14px): radius 16px, 1px `#e2e8f0`, 제목 16/700, 서브 13/`#64748b` "장소 N곳 · 방문 N번", 우측 40px 원형 아바타.
- 하단 토스트 칩: `rgba(15,23,42,0.84)` 배경, 13px 흰색, radius 999px.
- 우하단 FAB "기록 추가": 56px 높이, radius 999px, primary 배경, + 아이콘.

### A-2 사진 선택 (select)
- 헤더(뒤로 + "전체 사진" + chevron) + 안내문.
- 3열 갤러리 그리드(gap 3px), 선택 시 inset 3px primary 링 + 우상단 22px 체크 배지(`db-pop` 애니메이션).
- 하단 고정 풀폭 버튼: "다음 · N장 선택" / 선택 0이면 "사진 없이 장소만 추가".

### 로그인 (login)
- 아이콘 타일 + H1 25/800 + 본문.
- 카카오(`#fee500`/`#191600`), Google(흰 배경 1px 보더), 이메일 버튼. 모두 52px, radius 12px.

### A-3 하루 편집기 (editor) — 가장 복잡
- 헤더: 뒤로 + "하루 기록 정리" + 우측 날짜 칩(달력 아이콘 + `draftDate`).
- **분석 중 상태**(`analyzing`, 1.1s): 스피너 + 안내 + 118px 스켈레톤 3개(`db-shimmer`).
- **미분류 섹션**(`hasUnassigned`): 점선 테두리 카드(`oklch(98.7% 0.022 95.277)` 배경), 4열 사진 그리드.
- **장소 그룹 카드**(반복): 핀 아이콘 + 장소명 input(16/700) + 소스 배지(카카오맵=sky 톤 / 직접 추가=slate) + "사진 N장" + ⋯ 메뉴(핀 위치 수정 / 장소 삭제), 4열 사진 그리드, 한마디 textarea(`#f8fafc`).
- **장소 추가 버튼**: 2px 점선, "장소 추가 · 지도에서 검색".
- **선택 바**(사진 선택 시): 하단 `#0f172a` 바 — "N장 선택됨" / 빼기 / 장소로 이동 / 닫기.
- **저장 바**: 풀폭 "저장 · 지도에 N곳 남기기".
- **바텀시트들**: 날짜 선택 / 장소 추가(검색 모드 ↔ 지도 직접 찍기 모드) / 이동 대상 선택. 모두 radius 20px 상단, `db-sheet` 슬라이드업.
  - 지도 직접 찍기: 220px SVG 미니맵, 탭하면 핀 이동 + 좌표 표시. x/y ↔ lat/lng 변환 로직 포함(`xyToLatLng`/`latlngToXY`).

### A-4 저장 완료 (saved)
- 80px 성공 체크 원(emerald 톤, `db-pop`) + H1 "오늘 N곳을 남겼어요" + 동선(핀들을 점선으로 연결).

### B-2 장소 상세 (place)
- 헤더(뒤로 "지도") + 장소명 H1 22/800 + "여기 N번 왔어요"(primary).
- **방문 타임라인**(세로 라인 + 도트): 방문별 카드 — 날짜/사진 N장, 커버 이미지(접힘) ↔ 3열 그리드(펼침) 토글, "+N장 더보기" 배지, 메모.

---

## Interactions & Behavior
- **화면 전환**: `state.screen` 기반, 뒤로가기는 화면별 분기(`back()`).
- **편집기 분석**: 사진 선택 후 진입 시 `analyzing=true` → 1100ms 후 그룹 자동 생성(`makeScenarioDraft`).
- **사진 멀티선택 → 이동/빼기**: 선택된 사진 id 배열을 그룹 간 이동.
- **장소 추가**: 카카오맵 POI 검색(목 데이터) 또는 지도 직접 찍기.
- **신규 핀 펄스**: 저장 직후 3초.
- **애니메이션**: `db-ring`(펄스), `db-drop`, `db-up`(0.2s), `db-sheet`(0.25s), `db-fade`, `db-shimmer`(1.2s), `db-pop`(0.2~0.4s), `db-spin`(0.8s). 전환은 대부분 200~300ms.

## State Management
- `screen`, `loggedIn`, `places[]`, `activePlaceId`, `newPlaceIds[]`, `draftDate`
- `gallery[]`(선택 토글), `draft`{groups[], unassigned[]}, `selectedPhotos[]`
- 시트 상태: `moveSheetOpen`, `dateSheetOpen`, `addSheetOpen`, `addMode('search'|'manual')`
- 지도 찍기: `pinX`, `pinY`, `manualName`; 편집기 메뉴: `editorMenuId`; `analyzing`, `expandedVisits{}`
- 데이터 페칭(실제): 사진 EXIF(위치·시간)로 장소 자동 그룹핑, 역지오코딩으로 장소명 추론, 지도 POI 검색 API.

## Design Tokens
hb-kit 디자인 시스템 기반. Primary = tangerine.
- **Primary**: `oklch(64.6% 0.222 41.116)` (≈ tangerine-600, 주 강조/버튼/FAB). 진한 변형 `oklch(55.3% 0.195 38.402)`, 밝은 변형 `oklch(70.5% 0.213 47.604)`.
- **히트 강도색**: `oklch(52% 0.2 34)` / `oklch(60% 0.21 40)` / `oklch(68% 0.2 47)`.
- **텍스트**: 제목 `#0f172a`, 본문 `#475569`/`#334155`, 보조 `#64748b`, 흐림 `#94a3b8`.
- **보더/면**: 보더 `#e2e8f0`, 면 `#f8fafc`/`#f1f5f9`, 흰색 `#fff`. 지도 바탕 `#eaeef3`.
- **상태색**: success emerald `oklch(60% 0.16 162)`.
- **Radius**: 8px(작은 면), 10~12px(input/버튼), 14px(주 버튼), 16px(카드), 20px(바텀시트), 999px(칩/FAB/도트).
- **그림자**: 카드 `0 1px 3px rgba(15,23,42,0.05)`, 플로팅 `0 8px 24px -10px rgba(15,23,42,0.28)`, 버튼 `0 10px 22px -8px oklch(64.6% 0.222 41.116 / .5)`.
- **타이포**: Pretendard Variable. H1 24~27/800/`-0.025em`, 제목 16~18/700, 본문 14~16/400, 보조 12~13. 숫자는 `tabular-nums`.
- **간격**: 4px 그리드. 카드 패딩 14~16px, 화면 좌우 16~28px.

## Assets
- **폰트**: Pretendard Variable (CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css`). 코드베이스의 기존 한글 폰트로 대체 가능.
- **아이콘**: 모두 인라인 SVG, Lucide/Feather 스타일(24×24, stroke 2, round cap/join). 코드베이스의 아이콘 라이브러리로 대체.
- **사진**: 프로토타입은 그라디언트 플레이스홀더. 실제 사용자 사진으로 대체.
- **지도**: 프로토타입 SVG 일러스트 → 실제 지도 SDK로 대체.

## Files
- `dear-baby V2.dc.html` — 전체 프로토타입(템플릿 + 로직). 마커/히트맵 로직은 `renderVals()`의 `heatBlobs`/`mapPins` 계산과 지도 홈 `sc-for` 블록 참고.
- `screenshots/map-heatmap.png` — 적용된 지도 홈 캡처.
