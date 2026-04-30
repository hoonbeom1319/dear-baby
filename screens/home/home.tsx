'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { REGIONS, type RegionCode } from '@/entities/geolocation/lib/resion';
import { Carousel, CarouselContent, CarouselItem } from '@/hbds/display/carousel';

export default function Home() {
    const [regionCode, setRegionCode] = useState<RegionCode>('SEOUL');
    const [subRegionName, setSubRegionName] = useState<string>('');

    const selectedRegion = REGIONS[regionCode];
    const regionEntries = useMemo(() => Object.entries(REGIONS) as [RegionCode, (typeof REGIONS)[RegionCode]][], []);

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

                <button type="button" aria-label="검색" className="flex size-10 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100">
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                        <path d="M10 2a8 8 0 1 0 4.9 14.32l5.39 5.39a1 1 0 0 0 1.42-1.42l-5.39-5.39A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
                    </svg>
                </button>
            </header>

            <section className="bg-white px-4 py-4 shadow-sm">
                <div className="flex flex-col gap-1">
                    <span className="mb-1 text-[10px] font-black tracking-[0.16em] text-stone-400">지역 선택</span>

                    <Carousel aria-label="지역 선택" spacing={10}>
                        <CarouselContent>
                            {regionEntries.map(([code, region]) => {
                                const isSelected = regionCode === code;

                                return (
                                    <CarouselItem key={code}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRegionCode(code);
                                                setSubRegionName('');
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
                            {selectedRegion.sub.map((sub) => {
                                const isSelected = subRegionName === sub.displayName;

                                return (
                                    <CarouselItem key={sub.displayName}>
                                        <button
                                            type="button"
                                            onClick={() => setSubRegionName(sub.displayName)}
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
                </div>
            </section>
        </main>
    );
}
