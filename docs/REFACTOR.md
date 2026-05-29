# Favorite Entitiy 구조 제안

```
entities/favorite/
  ├── model/
  │   ├── use-favorite-data.ts     # useQuery(['favorites', userId]) + useMutation
  │   └── use-favorite.ts          # use-favorite-data를 import (export로 isFavorite, add, remove, OR toggle) etc..
  ├── api.ts                       # /api/favorite(가칭)
  ├── factory.ts                   # queryOptions, MutationsOptions etc...
  └── index.ts
```

- server layer에 favorite 관련 dao, controller 추가

- /api/favorite에서 server layer의 favorite import해서 export

# 클로드 수정 후 2차 수정 제안

## factory.ts

- 현재 factory가 byUser밖에 없는 상태
- use-favorite-data.ts에 있느 mutation도 factory로 이동 (mutationOptions가 있음), byUser에 더해 add, remove도 추가하면 좋을 것 같음
- api.ts 내부에 있는 함수

```
async function getAuthHeaders(): Promise<HeadersInit> {
    const {
        data: { session }
    } = await getSupabaseBrowser().auth.getSession();
    if (!session?.access_token) return {};
    return { Authorization: `Bearer ${session.access_token}` };
}
```

이건 공용적으로 client에서 지금처럼 바로 통신이 필요할 때, BFF로 경유해 가야하니까 shared/api/helper.ts나 lib.ts로 이동하는것도 좋을 것으로 보이는데 한번 검토해줘

api/favorite/route.ts에서

```
async function getAuthUser(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const supabase = createSupabaseAdmin();
    const {
        data: { user }
    } = await supabase.auth.getUser(token);
    return user ?? null;
}
```

이것도 뭔가 공통함수 인 것 같고, 모든 요청마다 체크해야되는 부분인 것같아. next.js middleware.ts를 활용할 수 있는 여지가 있을 것 같은데 이부분도 검토해줘
