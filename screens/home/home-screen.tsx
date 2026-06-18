'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/application/providers';

import { AccountSheet } from '@/features/account-menu';

import { useLogRecall } from '@/entities/event';
import { usePlacesData } from '@/entities/place';

import { MapHomeView } from './ui/map-home-view';
import { OnboardingView } from './ui/onboarding-view';

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '';

/**
 * 앱 진입점(`/`) — 핀 수로 온보딩(C-1) ↔ 지도 홈(A-1/B-1)을 가른다.
 * 시나리오 A(기록)와 B(되새김)가 같은 화면에서 출발한다(PRD §6.1/§6.2).
 */
export function HomeScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const userId = useAuth((s) => s.userId);
    const loggedIn = useAuth((s) => s.loggedIn);
    const openLogin = useAuth((s) => s.openLogin);
    const logout = useAuth((s) => s.logout);
    const displayName = useAuth((s) => s.displayName);
    const avatarUrl = useAuth((s) => s.avatarUrl);
    const { places, isLoading } = usePlacesData(userId);

    const [accountOpen, setAccountOpen] = useState(false);

    // 저장 완료(A-4)에서 "지도에서 보기"로 넘어오면 ?new=id,id → 그 핀들을 펄스시킨다.
    const newParam = searchParams.get('new');
    const newPlaceIds = useMemo(() => (newParam ? newParam.split(',').filter(Boolean) : []), [newParam]);
    const fromSave = newPlaceIds.length > 0;

    // F-9: 순수 되새김 세션 — 저장에서 온 게 아니고, 핀이 있는 지도를 열어 둘러봤을 때 1회 로깅.
    // (창/임계값은 셀프 베타로 확정하더라도 사건 자체는 첫 버전부터 남긴다 — PRD §2.6)
    const recall = useLogRecall();
    const recalled = useRef(false);
    useEffect(() => {
        if (recalled.current || !loggedIn || fromSave || places.length === 0) return;
        recalled.current = true;
        recall.mutate();
    }, [loggedIn, fromSave, places.length, recall]);

    // F-8(폴백 (가)): 기록 플로우 진입 시점에 로그인을 받는다. OAuth가 외부로 리다이렉트했다
    // 돌아오므로, 사진을 고른 뒤가 아니라 진입 직전에 받아야 인메모리 File[] 소실을 피한다.
    const goRecord = () => {
        if (!loggedIn) {
            openLogin();
            return;
        }
        router.push('/record');
    };

    // 로그아웃 상태이거나, 로딩이 끝났는데 핀이 0개면 온보딩.
    if (!loggedIn || (!isLoading && places.length === 0)) {
        return <OnboardingView onStart={goRecord} />;
    }

    return (
        <>
            <MapHomeView
                places={places}
                newPlaceIds={newPlaceIds}
                onAddRecord={goRecord}
                onPinClick={(place) => router.push(`/place/${place.id}`)}
                onAvatar={() => setAccountOpen(true)}
            />
            <AccountSheet
                open={accountOpen}
                onOpenChange={setAccountOpen}
                displayName={displayName}
                avatarUrl={avatarUrl}
                version={APP_VERSION}
                onLogout={() => {
                    // 로그아웃하면 onAuthStateChange가 loggedIn=false로 → 온보딩으로 재렌더(시트 언마운트).
                    void logout();
                }}
            />
        </>
    );
}
