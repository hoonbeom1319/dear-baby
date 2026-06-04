/**
 * 카카오 Maps JavaScript SDK 타입 (직접 정의)
 * @see https://apis.map.kakao.com/web/documentation/
 *
 * SDK 전체 목록은 콘솔의 kakao.maps 참고.
 * 프로젝트에서 쓰는 API부터 하나씩 추가한다.
 */

declare namespace kakao {
    namespace maps {
        /** v3 스크립트 로드 완료 후 callback 실행 (autoload=false 일 때) */
        function load(callback: () => void): void;

        class LatLng {
            constructor(lat: number, lng: number);
            getLat(): number;
            getLng(): number;
        }

        class LatLngBounds {
            constructor();
            extend(latlng: LatLng): void;
            getSouthWest(): LatLng;
            getNorthEast(): LatLng;
        }

        interface MapOptions {
            center: LatLng;
            level?: number;
        }

        class Map {
            constructor(container: HTMLElement, options: MapOptions);
            getCenter(): LatLng;
            getBounds(): LatLngBounds;
            getLevel(): number;
            setCenter(latlng: LatLng): void;
            setLevel(level: number): void;
            setBounds(bounds: LatLngBounds, paddingTop?: number, paddingRight?: number, paddingBottom?: number, paddingLeft?: number): void;
            relayout(): void;
        }

        interface MarkerOptions {
            position: LatLng;
            map?: Map | null;
        }

        class Marker {
            constructor(options: MarkerOptions);
            setMap(map: Map | null): void;
            getPosition(): LatLng;
        }

        namespace event {
            function addListener<T extends object>(target: T, type: string, handler: () => void): void;
            function removeListener<T extends object>(target: T, type: string, handler: () => void): void;
        }

        namespace services {
            enum Status {
                OK = 'OK',
                ZERO_RESULT = 'ZERO_RESULT',
                ERROR = 'ERROR'
            }

            enum SortBy {
                ACCURACY = 'accuracy',
                DISTANCE = 'distance'
            }

            interface Pagination {
                current: number;
                hasNextPage: boolean;
                nextPage(): void;
            }

            interface PlacesSearchDocument {
                place_name: string;
                category_name: string;
                phone: string;
                address_name: string;
                road_address_name: string;
                x: string;
                y: string;
                place_url: string;
            }

            interface KeywordSearchOptions {
                useMapBounds?: boolean;
                location?: LatLng;
                sort?: SortBy;
                size?: number;
                page?: number;
            }

            class Places {
                constructor(map?: Map);
                keywordSearch(
                    keyword: string,
                    callback: (result: PlacesSearchDocument[], status: Status, pagination: Pagination) => void,
                    options?: KeywordSearchOptions
                ): void;
            }
        }

        // ── 아직 미사용 — 필요할 때 추가 ──────────────────────────────
        // AbstractOverlay, Circle, CustomOverlay, InfoWindow, MarkerImage
        // Point, Polygon, Polyline, Rectangle, Roadview, RoadviewClient
        // StaticMap, Tileset, ZoomControl, MapTypeControl, MapTypeId
        // MarkerClusterer, services.Geocoder, services.categorySearch …
    }
}
