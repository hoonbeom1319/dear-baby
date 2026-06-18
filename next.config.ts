import type { NextConfig } from 'next';

import pkg from './package.json';

const nextConfig: NextConfig = {
    // 앱 버전을 package.json 단일 출처에서 클라이언트로 주입(계정 시트 표시용)
    env: {
        NEXT_PUBLIC_APP_VERSION: pkg.version
    }
};

export default nextConfig;
