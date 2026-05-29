# Features 정의 사용법에 대해 (일단 눈에 보이는 것)

## 경로: features/install-prompt

### 현재 내가 파악하고 있는 구조
Root Layout에서 features/install-prompt/ui에서 각각 하나씩 뽑아서 쓰고 있음

### 내가 생각하고 있는 Feature
- Feature는 단 하나의 공유한 기능을 담당
```
features
    - install-prompt
        - model
            - use-sw-registrar.ts (현재 sw-registrar.tsx 내용이 들어옴)
    install-prompt.tsx (현재 install-banner.tsx 내용이 들어오면서 model에서 use-sw-registrar.ts를 import해 옴)
    index.tsx (install-prompt 내보냄냄)
```

그리고 Root Layout에서 features/install-prompt 1개  import해와서 적용