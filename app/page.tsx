import { Suspense } from 'react';

import { MobileShell } from '@/shared/ui';

import { HomeScreen } from '@/screens/home';


export default function Page() {
    return (
        <MobileShell>
            {/* useSearchParams(저장 직후 ?new= 핀 펄스)를 쓰므로 Suspense 경계가 필요 */}
            <Suspense fallback={<div className="h-dvh w-full bg-[#EAEEF3]" />}>
                <HomeScreen />
            </Suspense>
        </MobileShell>
    );
}
