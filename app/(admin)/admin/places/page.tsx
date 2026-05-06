import Link from 'next/link';

import { listPlacesController } from '@/server/controllers/place';
import { createSupabaseAdmin } from '@/server/db/supabase';

export default async function AdminPlacesPage() {
    const supabase = createSupabaseAdmin();
    const { items } = await listPlacesController(supabase, { limit: 50 });

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">장소 관리</h1>
                    <p className="mt-2 text-sm text-neutral-600">등록된 장소를 확인하고 신규 장소를 추가합니다.</p>
                </div>
                <Link
                    className="rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-orange-700"
                    href="/admin/places/new"
                >
                    신규 장소 등록
                </Link>
            </div>

            <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-200 px-6 py-4 text-sm font-bold text-neutral-800">목록</div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-neutral-50 text-left text-xs font-bold text-neutral-600">
                            <tr>
                                <th className="px-6 py-3">이름</th>
                                <th className="px-6 py-3">카테고리</th>
                                <th className="px-6 py-3">지역코드</th>
                                <th className="px-6 py-3">세부지역</th>
                                <th className="px-6 py-3">생성일</th>
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
                                        <td className="px-6 py-4">{p.kind}</td>
                                        <td className="px-6 py-4">{p.regionCode}</td>
                                        <td className="px-6 py-4">{p.subRegion}</td>
                                        <td className="px-6 py-4 text-neutral-600">{p.createdAt ?? '-'}</td>
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

