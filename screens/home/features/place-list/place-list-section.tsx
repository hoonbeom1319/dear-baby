import { useMemo } from 'react';

import { usePlaceList } from '@/entities/place/model/use-place-list';
import { useRegionList } from '@/entities/regions/model/use-region-list';

type PlaceListSectionProps = {
    regionCode: string;
    subRegionCode: string;
};

const CATEGORY_LABEL: Record<string, string> = {
    restaurant: '식당',
    cafe: '카페',
    play: '놀거리',
    mall: '복합몰'
};

const AMENITY_LABEL: Record<string, string> = {
    baby_chair: '아기의자',
    stroller_aisle: '유모차통로',
    nursing_room: '수유실',
    diaper_table: '기저귀대',
    microwave: '전자레인지',
    floor_seating: '좌식공간',
    kids_menu: '키즈메뉴',
    free_parking: '주차무료'
};

const AMENITY_EMOJI: Record<string, string> = {
    baby_chair: '🪑',
    stroller_aisle: '🛺',
    nursing_room: '🍼',
    diaper_table: '👶',
    microwave: '🍱',
    floor_seating: '🧘',
    kids_menu: '🍽️',
    free_parking: '🅿️'
};

const toReadableCode = (value: string) =>
    value
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

export function PlaceListSection({ regionCode, subRegionCode }: PlaceListSectionProps) {
    const {
        list: places,
        isPending: placesPending,
        isError: placesError,
        error: placesErr
    } = usePlaceList(
        {
            regionCode: regionCode || undefined,
            subRegionCode: subRegionCode || undefined,
            limit: 30
        },
        { enabled: !!regionCode }
    );
    const { list: regions } = useRegionList();
    const regionLabelByCode = useMemo(() => {
        const map = new Map<string, string>();
        for (const region of regions) {
            map.set(region.code, region.displayName);
            for (const sub of region.sub) {
                map.set(sub.code, sub.displayName);
            }
        }
        return map;
    }, [regions]);

    return (
        <section className="space-y-3 px-4 pt-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tight text-stone-900">내 주변 인기 장소</h2>
                <span className="text-sm font-bold text-amber-600">전체보기</span>
            </div>

            {placesPending ? (
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-8 text-center text-sm font-semibold text-stone-400">
                    장소 목록을 불러오는 중…
                </div>
            ) : null}

            {placesError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm font-semibold text-red-700">
                    장소 목록을 불러오지 못했어요. {placesErr instanceof Error ? placesErr.message : ''}
                </div>
            ) : null}

            {!placesPending && !placesError && places.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-10 text-center text-sm text-stone-500">
                    선택한 지역에 등록된 장소가 아직 없어요.
                </div>
            ) : null}

            {!placesPending && !placesError && places.length > 0 ? (
                <ul className="space-y-6">
                    {places.map((place) => (
                        <li key={place.id} className="overflow-hidden rounded-3xl bg-white shadow-xl">
                            <div className="relative h-48 overflow-hidden bg-linear-to-br from-amber-100 via-orange-100 to-rose-100">
                                {place.images?.[0] ? (
                                    <img src={place.images[0]} alt={place.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-center text-sm font-semibold text-stone-500">
                                        {place.name}
                                    </div>
                                )}
                                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur">
                                    <span className="text-xs font-bold text-amber-600">
                                        {regionLabelByCode.get(place.subRegionCode) ?? '근처'}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    {place.createdAt ? (
                                        <span className="rounded-full bg-sky-500/70 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">New</span>
                                    ) : null}
                                    {place.amenityCodes.length >= 3 ? (
                                        <span className="rounded-full bg-emerald-500/70 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                                            인기
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-3 p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">
                                            {CATEGORY_LABEL[place.categoryCode] ?? toReadableCode(place.categoryCode)}
                                        </span>
                                        <h3 className="mt-1 text-lg font-black leading-snug text-stone-900">{place.name}</h3>
                                    </div>
                                    <span aria-hidden className="text-xl text-stone-300">
                                        ♡
                                    </span>
                                </div>

                                <p className="text-sm text-stone-500">
                                    {place.subtitle || place.description || '아이와 함께 가기 좋은 장소예요.'}
                                </p>

                                <p className="text-sm text-stone-500">
                                    {regionLabelByCode.get(place.regionCode) ?? place.regionCode} ·{' '}
                                    {regionLabelByCode.get(place.subRegionCode) ?? place.subRegionCode}
                                    {place.address ? ` · ${place.address}` : ''}
                                </p>

                                {place.amenityCodes.length > 0 ? (
                                    <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 pt-3">
                                        {place.amenityCodes.slice(0, 4).map((code) => (
                                            <span
                                                key={code}
                                                className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600"
                                            >
                                                <span aria-hidden>{AMENITY_EMOJI[code] ?? '✓'}</span>
                                                {AMENITY_LABEL[code] ?? toReadableCode(code)}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="border-t border-stone-100 pt-3 text-xs font-semibold text-stone-400">등록된 편의시설 정보가 없어요.</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : null}
        </section>
    );
}
