import { useEffect, useMemo, useState } from 'react';

import { useRegionList } from '@/entities/regions/model/use-region-list';

import { Carousel, CarouselContent, CarouselItem } from '@/hbds/display/carousel';

const FILTER_STORAGE_KEY = 'home-region-filter-v1';

type PersistedRegionFilter = {
    regionCode: string;
    subRegionCode: string;
};

export type SelectedRegionFilter = {
    regionCode: string;
    subRegionCode: string;
};

const readStoredFilter = (): PersistedRegionFilter | null => {
    const raw = window.localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PersistedRegionFilter>;
    if (typeof parsed.regionCode !== 'string' || typeof parsed.subRegionCode !== 'string') return null;

    return { regionCode: parsed.regionCode, subRegionCode: parsed.subRegionCode };
};

type RegionSelectorSectionProps = {
    onChange: (filter: SelectedRegionFilter) => void;
};

export function RegionSelectorSection({ onChange }: RegionSelectorSectionProps) {
    const { list, isPending } = useRegionList();
    const [regionCode, setRegionCode] = useState<string>('');
    const [subRegionCode, setSubRegionCode] = useState<string>('');
    const [isFilterHydrated, setIsFilterHydrated] = useState(false);

    const effectiveRegionCode = regionCode || list[0]?.code || '';
    const selectedRegion = useMemo(() => list.find((r) => r.code === effectiveRegionCode) ?? null, [effectiveRegionCode, list]);
    const regionEntries = useMemo(() => list.map((r) => [r.code, r] as const), [list]);

    useEffect(() => {
        try {
            const savedFilter = readStoredFilter();
            if (!savedFilter) return;

            setRegionCode(savedFilter.regionCode);
            setSubRegionCode(savedFilter.subRegionCode);
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

    useEffect(() => {
        if (!isFilterHydrated) return;
        onChange({ regionCode: effectiveRegionCode, subRegionCode });
    }, [effectiveRegionCode, isFilterHydrated, onChange, subRegionCode]);

    const handleSelectRegion = (code: string) => {
        setRegionCode(code);
        setSubRegionCode('');
    };

    return (
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
                                        onClick={() => handleSelectRegion(code)}
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
    );
}
