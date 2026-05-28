# [AppProvider.tsx](../application/providers/app-provider.tsx)

## getSupabaseBrowser의 사용성
이미 server > db > supabase.ts에 admin전용과, anon 전용이 따로 있는데 이걸 굳이 또 만들어서 써야 하는지 확인

## AppProvider의 정체성
- AppProvider는 도메인 상관없이 앱 전체에 제공되는 value들만 관리되면 좋을 것 같아, 예를 들면 user정보라던가... 등등
- Catalog는 별도의 Provider를 만들어서 Catalog를 진짜 써야하는 페이지 (현재는 home이랑 몇몇군데..)만 쓰는 방식이 좋을 것 같아
- 그런의미에서 지금 구성된 AppContext도 마찬가지로 분리가 되어야 할 것 같음
