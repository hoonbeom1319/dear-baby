import Link from 'next/link';

import { listPlacesController } from '@/server/controllers/place';
import { listRegionsController } from '@/server/controllers/regions';
import { createSupabaseAdmin } from '@/server/db/supabase';
import { listPlaceCatalog } from '@/server/dao/place-catalog';

export const dynamic = 'force-dynamic';

/** 관리자 목록에서 시설을 한눈에 보이게 할 이모지 (코드 → 이모지) */
const AMENITY_EMOJI: Record<string, string> = {
    baby_chair: '🪑',
    stroller_aisle: '🛞',
    nursing_room: '🤱',
    diaper_table: '🧷',
    microwave: '📟',
    floor_seating: '🧘',
    kids_menu: '🍽️',
    free_parking: '🅿️'
};

export default async function AdminPlacesPage() {
    const supabase = createSupabaseAdmin();
    const [{ items }, { items: regionItems }, { amenities }] = await Promise.all([
        listPlacesController(supabase, { limit: 50 }),
        listRegionsController(),
        listPlaceCatalog(supabase)
    ]);

    const regionLabel = new Map<string, string>();
    for (const r of regionItems) {
        regionLabel.set(r.code.trim(), r.displayName);
        for (const s of r.sub) {
            regionLabel.set(s.code.trim(), s.displayName);
        }
    }

    const amenityLabel = new Map(amenities.map((a) => [a.code, a.display_name]));

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">장소 관리</h1>
                    <p className="mt-2 text-sm text-neutral-600">등록된 장소를 확인하고 신규 장소를 추가합니다.</p>
                </div>
                <Link className="rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-orange-700" href="/admin/places/new">
                    신규 장소 등록
                </Link>
            </div>

            <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-200 px-6 py-4 text-sm font-bold text-neutral-800">목록</div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="text-left text-xs font-bold text-neutral-600">
                            <tr>
                                <th className="px-6 py-3">이름</th>
                                <th className="px-6 py-3">카테고리</th>
                                <th className="px-6 py-3">시·도</th>
                                <th className="px-6 py-3">시·군·구</th>
                                <th className="px-6 py-3">갖춘 시설</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-neutral-800">
                            {items.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-10 text-neutral-500" colSpan={5}>
                                        아직 등록된 장소가 없습니다. “신규 장소 등록”으로 첫 데이터를 추가해 주세요.
                                    </td>
                                </tr>
                            ) : (
                                items.map((p) => (
                                    <tr key={p.id} className="border-t border-neutral-100">
                                        <td className="px-6 py-4 font-bold">{p.name}</td>
                                        <td className="px-6 py-4">{p.categoryCode}</td>
                                        <td className="px-6 py-4">{regionLabel.get(p.regionCode) ?? p.regionCode}</td>
                                        <td className="px-6 py-4">{regionLabel.get(p.subRegionCode) ?? p.subRegionCode}</td>
                                        <td className="px-6 py-4">
                                            {p.amenityCodes.length === 0 ? (
                                                <span className="text-neutral-400">없음</span>
                                            ) : (
                                                <div
                                                    className="grid w-full max-w-[260px] grid-cols-[repeat(auto-fit,minmax(2.25rem,1fr))] gap-2 rounded-2xl border border-orange-100/90 bg-linear-to-br from-orange-50 via-white to-amber-50/70 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                                                    title={p.amenityCodes.map((c) => amenityLabel.get(c) ?? c).join(', ')}
                                                >
                                                    {p.amenityCodes.map((code) => (
                                                        <span
                                                            key={code}
                                                            className="inline-flex size-9 shrink-0 items-center justify-center justify-self-center rounded-full bg-white/95 text-xl leading-none text-neutral-800 shadow-sm ring-1 ring-orange-100/80"
                                                            title={amenityLabel.get(code) ?? code}
                                                        >
                                                            {AMENITY_EMOJI[code] ?? '✓'}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
