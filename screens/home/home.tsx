'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePlaceList } from '@/entities/place/model/use-place-list';
import { useRegionList } from '@/entities/regions/model/use-region-list';

import { Carousel, CarouselContent, CarouselItem } from '@/hbds/display/carousel';

const FILTER_STORAGE_KEY = 'home-region-filter-v1';

type PersistedRegionFilter = {
    regionCode: string;
    subRegionCode: string;
};

export default function Home() {
    const [regionCode, setRegionCode] = useState<string>('');
    const [subRegionCode, setSubRegionCode] = useState<string>('');
    const [isFilterHydrated, setIsFilterHydrated] = useState(false);

    const { list, isPending } = useRegionList();
    const effectiveRegionCode = regionCode || list[0]?.code || '';

    const selectedRegion = useMemo(() => list.find((r) => r.code === effectiveRegionCode) ?? null, [effectiveRegionCode, list]);
    const regionEntries = useMemo(() => list.map((r) => [r.code, r] as const), [list]);
    const regionLabelByCode = useMemo(() => {
        const map = new Map<string, string>();
        for (const region of list) {
            map.set(region.code, region.displayName);
            for (const sub of region.sub) {
                map.set(sub.code, sub.displayName);
            }
        }
        return map;
    }, [list]);

    const {
        list: places,
        isPending: placesPending,
        isError: placesError,
        error: placesErr
    } = usePlaceList(
        {
            regionCode: effectiveRegionCode || undefined,
            subRegionCode: subRegionCode || undefined,
            limit: 30
        },
        { enabled: !!effectiveRegionCode }
    );

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(FILTER_STORAGE_KEY);
            if (!raw) return;

            const parsed = JSON.parse(raw) as Partial<PersistedRegionFilter>;
            if (typeof parsed.regionCode === 'string') setRegionCode(parsed.regionCode);
            if (typeof parsed.subRegionCode === 'string') setSubRegionCode(parsed.subRegionCode);
        } catch {
            window.localStorage.removeItem(FILTER_STORAGE_KEY);
        } finally {
            setIsFilterHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!isFilterHydrated || !list.length) return;

        setRegionCode((prev) => {
            if (prev && list.some((region) => region.code === prev)) return prev;
            return list[0]?.code ?? '';
        });
    }, [isFilterHydrated, list]);

    useEffect(() => {
        if (!selectedRegion || !subRegionCode) return;
        const hasSub = selectedRegion.sub.some((sub) => sub.code === subRegionCode);
        if (!hasSub) setSubRegionCode('');
    }, [selectedRegion, subRegionCode]);

    useEffect(() => {
        if (!isFilterHydrated || !effectiveRegionCode) return;

        const payload: PersistedRegionFilter = {
            regionCode: effectiveRegionCode,
            subRegionCode
        };
        window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(payload));
    }, [isFilterHydrated, effectiveRegionCode, subRegionCode]);

    return (
        <main className="min-h-screen bg-stone-50 pb-32">
            <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span aria-hidden className="text-amber-600">
                        <svg viewBox="0 0 24 24" className="size-6 fill-current">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 4.94 6.17 12.26 6.43 12.56a.75.75 0 0 0 1.14 0C12.83 21.26 19 13.94 19 9c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                        </svg>
                    </span>
                    <h1 className="text-xl font-black tracking-tight text-stone-900">육아똑똑</h1>
                </div>
            </header>

            <section className="bg-white px-4 py-4 shadow-sm">
                <div className="flex flex-col gap-1">
                    <span className="mb-1 text-[10px] font-black tracking-[0.16em] text-stone-400">지역 선택</span>

                    <Carousel aria-label="지역 선택" autoPlay spacing={1} options={{ dragFree: true }}>
                        <CarouselContent>
                            {regionEntries.map(([code, region]) => {
                                const isSelected = effectiveRegionCode === code;

                                return (
                                    <CarouselItem key={code} size="auto">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRegionCode(code);
                                                setSubRegionCode('');
                                            }}
                                            aria-pressed={isSelected}
                                            className={`min-w-max rounded-full px-6 py-2 text-sm transition-colors ${
                                                isSelected ? 'bg-amber-600 text-white shadow-sm' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                            }`}
                                        >
                                            {region.displayName}
                                        </button>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                    </Carousel>

                    <Carousel aria-label="세부 지역 선택">
                        <CarouselContent className="border-stone-50">
                            <CarouselItem size="auto">
                                <button
                                    type="button"
                                    onClick={() => setSubRegionCode('')}
                                    aria-pressed={!subRegionCode}
                                    className={`min-w-max rounded-full border-2 px-5 py-1.5 text-sm transition-colors ${
                                        !subRegionCode
                                            ? 'border-amber-600 bg-amber-50/50 font-bold text-amber-600'
                                            : 'border-transparent bg-stone-50 font-medium text-stone-500 hover:bg-stone-100'
                                    }`}
                                >
                                    전체
                                </button>
                            </CarouselItem>
                            {(selectedRegion?.sub ?? []).map((sub) => {
                                const isSelected = subRegionCode === sub.code;

                                return (
                                    <CarouselItem key={sub.code}>
                                        <button
                                            type="button"
                                            onClick={() => setSubRegionCode(sub.code)}
                                            aria-pressed={isSelected}
                                            className={`min-w-max rounded-full border-2 px-5 py-1.5 text-sm transition-colors ${
                                                isSelected
                                                    ? 'border-amber-600 bg-amber-50/50 font-bold text-amber-600'
                                                    : 'border-transparent bg-stone-50 font-medium text-stone-500 hover:bg-stone-100'
                                            }`}
                                        >
                                            {sub.displayName}
                                        </button>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                    </Carousel>

                    {isPending ? <div className="pt-2 text-xs font-semibold text-stone-400">지역 데이터를 불러오는 중…</div> : null}
                </div>
            </section>

            <section className="space-y-3 px-4 pt-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-black text-stone-900">등록된 장소</h2>
                    <span className="text-xs font-semibold text-stone-500">{places.length}개</span>
                </div>

                {placesPending ? (
                    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-8 text-center text-sm font-semibold text-stone-400">장소 목록을 불러오는 중…</div>
                ) : null}

                {placesError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm font-semibold text-red-700">
                        장소 목록을 불러오지 못했어요. {placesErr instanceof Error ? placesErr.message : ''}
                    </div>
                ) : null}

                {!placesPending && !placesError && places.length === 0 ? (
                    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-10 text-center text-sm text-stone-500">선택한 지역에 등록된 장소가 아직 없어요.</div>
                ) : null}

                {!placesPending && !placesError && places.length > 0 ? (
                    <ul className="space-y-3">
                        {places.map((place) => (
                            <li key={place.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-base font-bold text-stone-900">{place.name}</h3>
                                        <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">{place.categoryCode}</span>
                                    </div>
                                    {place.subtitle ? <p className="text-sm font-medium text-stone-600">{place.subtitle}</p> : null}
                                    <p className="text-sm text-stone-500">
                                        {regionLabelByCode.get(place.regionCode) ?? place.regionCode} · {regionLabelByCode.get(place.subRegionCode) ?? place.subRegionCode}
                                    </p>
                                    {place.address ? <p className="text-sm text-stone-500">{place.address}</p> : null}
                                    <p className="text-xs font-semibold text-stone-400">시설 {place.amenityCodes.length}개</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </section>
        </main>
    );
}
