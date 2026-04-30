# HBDS (HB Design System)

HBDS는 프로젝트의 UI 일관성을 위한 디자인 시스템입니다.  
디자인 토큰과 컴포넌트는 `DESIGN.md`의 브랜드 방향(따뜻함, 신뢰감, 높은 가독성)을 기반으로 하며, 컴포넌트는 역할 중심으로 카테고리화합니다.

## Categorization Philosophy

HBDS의 컴포넌트 분류는 "어떻게 생겼는가"보다 "무엇을 해결하는가"에 초점을 둡니다.

### `display/` — 정보의 형상화

- 포함: `Typography`, `Table`, `Carousel`, `Badge`, `Timeline` 등
- 핵심 질문: **"정보를 어떤 포맷으로 보여줄 것인가?"**
- 기준: 정보의 구조화, 시각적 표현 방식, 읽기/스캔 효율

### `surfaces/` — 콘텐츠의 집

- 포함: `Card`, `Accordion`, `Divider`, `Section` 등
- 핵심 질문: **"정보를 어떤 면(Plane) 위에 그룹화할 것인가?"**
- 기준: 정보 묶음의 경계, 시각적 계층, 섹션 단위의 구성

### `overlay/` — 맥락을 깨는 부유물

- 포함: `Modal`, `Drawer`, `Popover`, `Tooltip` 등
- 핵심 질문: **"기존 레이아웃 위에 띄워 사용자의 시선을 강제로 끌 것인가?"**
- 기준: 기존 흐름의 인터럽트 여부, 포커스 강제, 일시적 레이어링

## Planned Categories

아래 분류는 HBDS의 개발 예정 카테고리 맵입니다.

| Category   | Description                                          | Components (Examples)           |
| ---------- | ---------------------------------------------------- | ------------------------------- |
| `layout`   | 공간의 분할과 컴포넌트 배치 프레임워크를 정의합니다. | `Container`, `Grid`, `Stack`    |
| `input`    | 사용자의 데이터 입력 및 상호작용을 처리합니다.       | `Button`, `TextField`, `Select` |
| `feedback` | 시스템의 상태나 처리 결과를 사용자에게 알립니다.     | `Loader`, `Alert`, `Toast`      |
