'use client';

import { useState } from 'react';

import { PlaceListSection } from './features/place-list';
import { RegionSelectorSection, type SelectedRegionFilter } from './features/region-selector';

export default function Home() {
    const [selectedRegionFilter, setSelectedRegionFilter] = useState<SelectedRegionFilter>({
        regionCode: '',
        subRegionCode: ''
    });

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

            <RegionSelectorSection onChange={setSelectedRegionFilter} />
            <PlaceListSection regionCode={selectedRegionFilter.regionCode} subRegionCode={selectedRegionFilter.subRegionCode} />
        </main>
    );
}
