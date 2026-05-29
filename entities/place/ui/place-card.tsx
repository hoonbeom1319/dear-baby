import { useCatalog } from '@/application/providers';
import { cn } from '@/shared/lib';
import { AmenityBadge, Card, Icon, type IconName, PlaceImage } from '@/shared/ui';

import type { Place } from '../model/types';

type PlaceCardProps = {
    place: Place;
    isFavorite?: boolean;
    onToggleFavorite?: (placeId: string) => void;
    onSelect?: (placeId: string) => void;
    /** Course-stop ordinal (①②③) when reused inside a course. */
    stopNumber?: number;
};

const Dot = () => <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />;

/**
 * 첫 화면 · 즐겨찾기 · 코스 상세에서 공통으로 재사용하는 장소 카드. (PRD 8.3)
 * 즐겨찾기/이동 같은 상호작용은 콜백으로 위에서 주입받는다.
 */
export const PlaceCard = ({ place, isFavorite = false, onToggleFavorite, onSelect, stopNumber }: PlaceCardProps) => {
    const getArea = useCatalog((s) => s.getArea);
    const getCategory = useCatalog((s) => s.getCategory);
    const getAmenity = useCatalog((s) => s.getAmenity);
    const category = getCategory(place.category);
    const area = getArea(place.area);

    return (
        <Card interactive onClick={() => onSelect?.(place.id)}>
            <div className="flex items-stretch gap-3 p-3">
                {stopNumber != null && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-full bg-primary-600 text-xs font-semibold tabular-nums text-white">
                        {stopNumber}
                    </div>
                )}
                <PlaceImage className="h-[84px] w-[84px] shrink-0 rounded-[10px]" iconSize={26} />
                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-[15px] font-semibold leading-tight tracking-[-0.005em] text-surface-foreground">
                                {place.name}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                                <span>{category?.name}</span>
                                <Dot />
                                <span>{area?.name}</span>
                                <Dot />
                                <span>{place.ageRange}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
                            onClick={(event) => {
                                event.stopPropagation();
                                onToggleFavorite?.(place.id);
                            }}
                            className={cn(
                                '-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100',
                                isFavorite ? 'text-amber-500' : 'text-neutral-700'
                            )}>
                            <Icon name={isFavorite ? 'star-fill' : 'star'} size={18} stroke={2} />
                        </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {place.amenities.map((id) => {
                            const amenity = getAmenity(id);
                            return amenity ? <AmenityBadge key={id} icon={amenity.icon as IconName} label={amenity.short} /> : null;
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
};
