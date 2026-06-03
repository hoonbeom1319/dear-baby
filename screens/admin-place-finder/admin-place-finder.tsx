'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { useCatalog } from '@/application/providers';
import { createPlace } from '@/server/controllers/places';
import type { AmenityId, AreaId, CategoryId } from '@/shared/config';
import { useRouter } from '@/shared/hooks';
import { toast } from '@/shared/lib';
import { Icon, type IconName } from '@/shared/ui';
import { AdField, AdInput, AdTextarea, AreaSelect } from '@/widgets/admin-shell';

import { Button } from '@/hbds/display/button';
import { cn } from '@/hbds/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const kakao: { maps: any };

// ── Types ────────────────────────────────────────────────────────────────────

type NaverLocalItem = {
    title: string;
    link: string;
    category: string;
    description: string;
    telephone: string;
    address: string;
    roadAddress: string;
    mapx: string;
    mapy: string;
};

type NaverBlogItem = {
    title: string;
    link: string;
    description: string;
    bloggername: string;
    postdate: string;
};

type FormState = {
    name: string;
    area: AreaId;
    category: CategoryId;
    address: string;
    phone: string;
    ageRangeStart: string;
    ageRangeEnd: string;
    sortOrder: string;
    description: string;
    amenities: AmenityId[];
};

// ── Constants ─────────────────────────────────────────────────────────────────

const AREA_ID_MAP: Record<string, string> = {
    강남구: 'gangnam', 강북구: 'gangbuk', 강동구: 'gangdong', 강서구: 'gangseo',
    관악구: 'gwanak', 광진구: 'gwangjin', 구로구: 'guro', 금천구: 'geumcheon',
    노원구: 'nowon', 도봉구: 'dobong', 동대문구: 'dongdaemun', 동작구: 'dongjak',
    마포구: 'mapo', 서대문구: 'seodaemun', 서초구: 'seocho', 성동구: 'seongdong',
    성북구: 'seongbuk', 송파구: 'songpa', 양천구: 'yangcheon', 영등포구: 'yeongdeungpo',
    용산구: 'yongsan', 은평구: 'eunpyeong', 종로구: 'jongno', 중구: 'jung', 중랑구: 'jungnang'
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, '');
}

function toLatLng(mapx: string, mapy: string): [number, number] {
    return [parseInt(mapy) / 1e6, parseInt(mapx) / 1e6];
}

function detectArea(roadAddress: string): AreaId | '' {
    for (const [name, id] of Object.entries(AREA_ID_MAP)) {
        if (roadAddress.includes(name)) return id as AreaId;
    }
    return '';
}

function detectCategory(naverCategory: string): CategoryId {
    return naverCategory.includes('카페') || naverCategory.includes('디저트') ? 'cafe' : 'rest';
}

function buildAgeRange(start: string, end: string): string {
    if (!start && !end) return '전 연령';
    if (start && !end) return `${start}개월~`;
    if (start && end) return `${start}~${end}개월`;
    return '';
}

function formatPostDate(d: string): string {
    return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
}

// ── ResultsList ───────────────────────────────────────────────────────────────

function ResultsList({
    results, searching, onSelect
}: {
    results: NaverLocalItem[];
    searching: boolean;
    onSelect: (place: NaverLocalItem) => void;
}) {
    if (searching) return <div className="flex flex-1 items-center justify-center py-20 text-[13px] text-muted">검색 중…</div>;

    if (results.length === 0) return (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
            <Icon name="search" size={28} />
            <p className="mt-1 text-[13.5px] font-medium text-surface-foreground">검색으로 장소를 찾아보세요</p>
            <p className="text-[12.5px] text-muted">강남 카페, 잠실 뷔페, 영등포 식당 …</p>
        </div>
    );

    return (
        <div className="flex flex-col">
            <div className="border-b border-border px-4 py-2 text-[12px] text-muted">{results.length}개 결과</div>
            {results.map((place, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onSelect(place)}
                    className="flex flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-surface-foreground">{stripHtml(place.title)}</span>
                        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-muted">
                            {place.category.split('>').pop()}
                        </span>
                    </div>
                    <span className="text-[12.5px] text-muted">{place.roadAddress || place.address}</span>
                    {place.telephone && <span className="text-[12px] text-muted">{place.telephone}</span>}
                </button>
            ))}
        </div>
    );
}

// ── DetailPanel ───────────────────────────────────────────────────────────────

function DetailPanel({
    selected, blogPosts, blogLoading,
    form, set, toggleAmenity,
    saving, onBack, onSave,
    areas, regions, categories, amenities
}: {
    selected: NaverLocalItem;
    blogPosts: NaverBlogItem[];
    blogLoading: boolean;
    form: FormState;
    set: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
    toggleAmenity: (id: AmenityId) => void;
    saving: boolean;
    onBack: () => void;
    onSave: () => void;
    areas: any[]; regions: any[]; categories: any[]; amenities: any[];
}) {
    return (
        <div className="flex flex-col">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-neutral-50"
            >
                ← 결과 목록
            </button>

            {/* Place info */}
            <div className="border-b border-border px-4 py-4">
                <div className="mb-1 flex items-center gap-2">
                    <span className="text-[16px] font-bold text-surface-foreground">{stripHtml(selected.title)}</span>
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-muted">
                        {selected.category.split('>').pop()}
                    </span>
                </div>
                <p className="text-[13px] text-muted">{selected.roadAddress || selected.address}</p>
                {selected.telephone && <p className="mt-0.5 text-[12.5px] text-muted">{selected.telephone}</p>}
                {selected.link && (
                    <a href={selected.link} target="_blank" rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[12px] text-primary-600 hover:underline">
                        네이버 지도에서 보기 ↗
                    </a>
                )}
            </div>

            {/* Blog */}
            <div className="border-b border-border">
                <div className="px-4 py-2 text-[11.5px] font-semibold tracking-widest text-muted uppercase">네이버 블로그 후기</div>
                {blogLoading ? (
                    <div className="px-4 pb-4 text-[12.5px] text-muted">불러오는 중…</div>
                ) : blogPosts.length === 0 ? (
                    <div className="px-4 pb-4 text-[12.5px] text-muted">후기를 찾을 수 없어요</div>
                ) : (
                    <div className="flex flex-col">
                        {blogPosts.map((post, i) => (
                            <a key={i} href={post.link} target="_blank" rel="noopener noreferrer"
                                className="flex flex-col gap-1 border-b border-border px-4 py-3 transition-colors hover:bg-neutral-50">
                                <span className="line-clamp-1 text-[13px] font-medium text-surface-foreground">{stripHtml(post.title)}</span>
                                <span className="line-clamp-2 text-[11.5px] text-muted">{stripHtml(post.description)}</span>
                                <span className="text-[11px] text-muted">{post.bloggername} · {formatPostDate(post.postdate)}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4 p-4">
                <p className="text-[11.5px] font-semibold tracking-widest text-muted uppercase">등록 정보</p>

                <AdField label="이름">
                    <AdInput value={form.name} onChange={(e) => set('name', e.target.value)} />
                </AdField>

                <div className="grid grid-cols-2 gap-3">
                    <AdField label="동네">
                        <AreaSelect variant="field" allowAll={false} value={form.area}
                            onChange={(id) => set('area', id as AreaId)} areas={areas} regions={regions} />
                    </AdField>
                    <AdField label="카테고리">
                        <select value={form.category} onChange={(e) => set('category', e.target.value as CategoryId)}
                            className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-[13.5px] text-surface-foreground">
                            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </AdField>
                </div>

                <AdField label="주소">
                    <AdInput value={form.address} onChange={(e) => set('address', e.target.value)} />
                </AdField>

                <div className="grid grid-cols-2 gap-3">
                    <AdField label="전화번호">
                        <AdInput value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                    </AdField>
                    <AdField label="표시 순서">
                        <AdInput value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} inputMode="numeric" />
                    </AdField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <AdField label="시작 월령">
                        <AdInput value={form.ageRangeStart} onChange={(e) => set('ageRangeStart', e.target.value)} placeholder="예: 6" inputMode="numeric" />
                    </AdField>
                    <AdField label="끝 월령">
                        <AdInput value={form.ageRangeEnd} onChange={(e) => set('ageRangeEnd', e.target.value)} placeholder="없으면 빈칸" inputMode="numeric" />
                    </AdField>
                </div>

                <AdField label="한 줄 설명">
                    <AdTextarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)}
                        placeholder="블로그 후기를 참고해서 한 줄로 정리해주세요" />
                </AdField>

                <AdField label="편의시설" hint="다중 선택">
                    <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity: any) => {
                            const on = form.amenities.includes(amenity.id);
                            return (
                                <label key={amenity.id} className={cn(
                                    'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-colors',
                                    on ? 'border-primary-500 bg-primary-50 font-medium text-primary-700'
                                       : 'border-border bg-surface text-neutral-700 hover:bg-neutral-50'
                                )}>
                                    <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleAmenity(amenity.id)} />
                                    <span className={cn('inline-flex h-4 w-4 items-center justify-center rounded',
                                        on ? 'bg-primary-600 text-white' : 'border-[1.5px] border-neutral-300 text-transparent')}>
                                        <Icon name="check" size={11} stroke={3} />
                                    </span>
                                    <Icon name={amenity.icon as IconName} size={14} stroke={1.8} />
                                    {amenity.short}
                                </label>
                            );
                        })}
                    </div>
                </AdField>

                <Button onClick={onSave} disabled={saving} className="w-full">
                    {saving ? '저장 중…' : '장소 등록하기'}
                </Button>
            </div>
        </div>
    );
}

// ── AdminPlaceFinder ──────────────────────────────────────────────────────────

export const AdminPlaceFinder = () => {
    const router = useRouter();
    const regions = useCatalog((s) => s.regions);
    const areas = useCatalog((s) => s.areas);
    const categories = useCatalog((s) => s.categories);
    const amenities = useCatalog((s) => s.amenities);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const selectedMarkerRef = useRef<any>(null);
    const handleSelectRef = useRef<(place: NaverLocalItem) => void>(() => {});

    const [mapReady, setMapReady] = useState(false);
    const [query, setQuery] = useState('');
    const [catFilter, setCatFilter] = useState<'all' | 'cafe' | 'rest'>('all');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<NaverLocalItem[]>([]);
    const [selected, setSelected] = useState<NaverLocalItem | null>(null);
    const [blogPosts, setBlogPosts] = useState<NaverBlogItem[]>([]);
    const [blogLoading, setBlogLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<FormState>({
        name: '', area: '' as AreaId, category: 'rest' as CategoryId,
        address: '', phone: '', ageRangeStart: '', ageRangeEnd: '',
        sortOrder: '0', description: '', amenities: []
    });

    // 지도 초기화
    useEffect(() => {
        if (!mapReady || !mapContainerRef.current || mapRef.current) return;
        mapRef.current = new kakao.maps.Map(mapContainerRef.current, {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 5
        });
    }, [mapReady]);

    // 검색 결과 → 마커 업데이트
    useEffect(() => {
        if (!mapRef.current) return;
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        selectedMarkerRef.current?.setMap(null);
        selectedMarkerRef.current = null;

        if (results.length === 0) return;

        const bounds = new kakao.maps.LatLngBounds();
        results.forEach((place) => {
            const [lat, lng] = toLatLng(place.mapx, place.mapy);
            const position = new kakao.maps.LatLng(lat, lng);
            bounds.extend(position);

            const marker = new kakao.maps.Marker({ position, map: mapRef.current });
            kakao.maps.event.addListener(marker, 'click', () => handleSelectRef.current(place));
            markersRef.current.push(marker);
        });

        mapRef.current.setBounds(bounds);
    }, [results]);

    const handleSelect = async (place: NaverLocalItem) => {
        const name = stripHtml(place.title);
        const area = detectArea(place.roadAddress) as AreaId;
        setSelected(place);
        setForm({
            name,
            area: area || (areas[0]?.id ?? ('' as AreaId)),
            category: detectCategory(place.category) as CategoryId,
            address: place.roadAddress || place.address,
            phone: place.telephone,
            ageRangeStart: '', ageRangeEnd: '', sortOrder: '0', description: '', amenities: []
        });

        if (mapRef.current) {
            const [lat, lng] = toLatLng(place.mapx, place.mapy);
            const position = new kakao.maps.LatLng(lat, lng);
            selectedMarkerRef.current?.setMap(null);
            selectedMarkerRef.current = new kakao.maps.Marker({ position, map: mapRef.current });
            mapRef.current.setCenter(position);
            mapRef.current.setLevel(3);
        }

        setBlogLoading(true);
        setBlogPosts([]);
        try {
            const res = await fetch(`/api/naver/blog?query=${encodeURIComponent(name + ' 아기 후기')}`);
            if (res.ok) setBlogPosts((await res.json()).items ?? []);
        } finally {
            setBlogLoading(false);
        }
    };

    handleSelectRef.current = handleSelect;

    const handleSearch = async () => {
        const q = query.trim();
        if (!q) return;
        setSearching(true);
        setSelected(null);
        try {
            const res = await fetch(`/api/naver/local?query=${encodeURIComponent(q)}&display=20`);
            if (!res.ok) { toast('검색에 실패했어요'); return; }
            setResults((await res.json()).items ?? []);
        } finally {
            setSearching(false);
        }
    };

    const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    const toggleAmenity = (id: AmenityId) =>
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id]
        }));

    const handleSave = async () => {
        if (!form.name.trim()) { toast('이름을 입력해주세요'); return; }
        if (!form.area) { toast('동네를 선택해주세요'); return; }
        setSaving(true);
        try {
            await createPlace({
                area: form.area, category: form.category,
                name: form.name.trim(), address: form.address.trim(),
                phone: form.phone.trim(),
                ageRange: buildAgeRange(form.ageRangeStart, form.ageRangeEnd),
                description: form.description.trim(),
                amenities: form.amenities,
                sortOrder: Number(form.sortOrder) || 0
            });
            toast('장소를 저장했어요');
            setSelected(null);
            setBlogPosts([]);
            router.refresh();
        } catch {
            toast('저장에 실패했어요');
        } finally {
            setSaving(false);
        }
    };

    const displayResults = catFilter === 'all' ? results : results.filter((r) => detectCategory(r.category) === catFilter);

    return (
        <>
            <Script
                src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false`}
                strategy="afterInteractive"
                onLoad={() => kakao.maps.load(() => setMapReady(true))}
            />

            <div className="flex h-screen flex-col">
                {/* Header */}
                <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-6 py-3">
                    <span className="shrink-0 text-[15px] font-bold tracking-tight text-surface-foreground">장소 찾기</span>
                    <div className="relative max-w-[480px] flex-1">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">
                            <Icon name="search" size={14} />
                        </span>
                        <AdInput
                            className="h-9 pl-9 text-[13.5px]"
                            placeholder="지역 + 장소 유형으로 검색  예: 강남 카페, 잠실 뷔페"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="flex gap-1.5">
                        {(['all', 'cafe', 'rest'] as const).map((v) => (
                            <button key={v} type="button" onClick={() => setCatFilter(v)}
                                className={cn('h-8 rounded-full px-3.5 text-[12.5px] font-medium transition-colors',
                                    catFilter === v ? 'bg-primary-600 text-white'
                                                    : 'border border-border bg-surface text-neutral-700 hover:bg-neutral-50')}>
                                {v === 'all' ? '전체' : v === 'cafe' ? '카페' : '식당'}
                            </button>
                        ))}
                    </div>
                    <Button size="sm" onClick={handleSearch} disabled={searching}>
                        {searching ? '검색 중…' : '검색'}
                    </Button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    <div className="relative flex-1">
                        <div ref={mapContainerRef} className="h-full w-full" />
                        {!mapReady && (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-[13px] text-muted">
                                지도 로딩 중…
                            </div>
                        )}
                    </div>
                    <div className="flex w-[440px] shrink-0 flex-col overflow-y-auto border-l border-border bg-surface">
                        {selected ? (
                            <DetailPanel
                                selected={selected} blogPosts={blogPosts} blogLoading={blogLoading}
                                form={form} set={set} toggleAmenity={toggleAmenity}
                                saving={saving}
                                onBack={() => {
                                    setSelected(null);
                                    selectedMarkerRef.current?.setMap(null);
                                    selectedMarkerRef.current = null;
                                }}
                                onSave={handleSave}
                                areas={areas} regions={regions} categories={categories} amenities={amenities}
                            />
                        ) : (
                            <ResultsList results={displayResults} searching={searching} onSelect={handleSelect} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
