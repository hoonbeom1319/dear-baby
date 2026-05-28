/**
 * 앱 전역 카탈로그 타입 정의.
 * 실제 값은 Supabase areas / categories / amenities 테이블에서 관리된다.
 * 런타임 데이터는 useCatalog() (shared/lib)를 통해 접근한다.
 */

export type AreaId = string;
export type CategoryId = string;
export type AmenityId = string;

export type Area     = { id: AreaId;     name: string };
export type Category = { id: CategoryId; name: string };
export type Amenity  = { id: AmenityId;  short: string; icon: string };
