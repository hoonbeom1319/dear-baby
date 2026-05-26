import { AMENITIES } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui';

import type { Place } from '../model/types';

/**
 * 장소 상세의 편의시설 전체 표시. (PRD F-6 · 4번 영역)
 * 운영 중인 모든 편의시설을 나열하되, 있는 것은 컬러 / 없는 것은 흑백으로
 * "무엇이 있고 없는지"를 한눈에 비교하게 한다.
 */
export const AmenityGrid = ({ place }: { place: Place }) => (
    <div className="grid grid-cols-5 gap-3">
        {AMENITIES.map((amenity) => {
            const has = place.amenities.includes(amenity.id);
            return (
                <div key={amenity.id} className="flex flex-col items-center gap-1.5 text-center">
                    <div
                        className={cn(
                            'inline-flex h-11 w-11 items-center justify-center rounded-xl border',
                            has ? 'border-primary-100 bg-primary-50 text-primary-600' : 'border-slate-200 bg-slate-50 text-slate-300'
                        )}>
                        <Icon name={amenity.icon} size={20} stroke={1.8} />
                    </div>
                    <div className={cn('text-[11px] font-medium', has ? 'text-slate-700' : 'text-slate-400')}>
                        {amenity.short}
                    </div>
                </div>
            );
        })}
    </div>
);
