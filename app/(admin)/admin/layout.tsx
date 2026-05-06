import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh w-full bg-neutral-50 text-neutral-900">
            <aside className="w-72 shrink-0 border-r border-neutral-200 bg-white p-6">
                <div className="mb-10 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-orange-600 text-white">
                        <span className="text-sm font-black">DB</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-sm font-bold leading-none">육아똑똑 관리자</div>
                        <div className="mt-1 text-xs font-medium text-neutral-500">Admin Console</div>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <Link
                        className="rounded-xl px-4 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
                        href="/admin"
                    >
                        대시보드
                    </Link>
                    <Link
                        className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-900"
                        href="/admin/places"
                    >
                        장소 관리
                    </Link>
                </nav>

                <button
                    className="mt-10 w-full rounded-xl bg-neutral-100 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-200"
                    type="button"
                >
                    로그아웃
                </button>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-20 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-10">
                    <div className="text-sm font-semibold text-neutral-600">Admin</div>
                    <div className="text-sm font-bold text-neutral-900">관리자</div>
                </header>

                <main className="min-w-0 flex-1 overflow-y-auto bg-neutral-50 p-10">{children}</main>
            </div>
        </div>
    );
}

