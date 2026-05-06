import Link from 'next/link';

import NewPlaceForm from './ui/new-place-form';

export default function NewPlacePage() {
    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-sm font-semibold text-neutral-500">
                        <Link className="hover:underline" href="/admin/places">
                            장소 관리
                        </Link>{' '}
                        / 신규 등록
                    </div>
                    <h1 className="mt-2 text-2xl font-black tracking-tight">신규 장소 등록</h1>
                    <p className="mt-2 text-sm text-neutral-600">REGIONS 필터링에 사용할 장소 데이터를 등록합니다.</p>
                </div>
                <Link className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-bold hover:bg-neutral-100" href="/admin/places">
                    목록으로
                </Link>
            </div>

            <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <NewPlaceForm />
            </section>
        </div>
    );
}

