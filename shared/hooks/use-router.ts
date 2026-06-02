'use client';

import { useRouter as useNextRouter } from 'next/navigation';

import { useNavigationStore } from '@/shared/model/navigation-store';

/**
 * next/navigation의 useRouter를 대체한다.
 * push/replace 호출 시 NavigationProgress가 자동으로 활성화된다.
 */
export const useRouter = () => {
    const router = useNextRouter();
    const start = useNavigationStore((s) => s.start);

    return {
        ...router,
        push: (...args: Parameters<typeof router.push>) => {
            start();
            router.push(...args);
        },
        replace: (...args: Parameters<typeof router.replace>) => {
            start();
            router.replace(...args);
        },
    };
};
