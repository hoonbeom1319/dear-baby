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

        class Size {
            constructor(width: number, height: number);
        }

        class Point {
            constructor(x: number, y: number);
        }

        class MarkerImage {
            constructor(src: string, size: Size, options?: { offset?: Point });
        }

        interface MarkerOptions {
            position: LatLng;
            map?: Map | null;
            image?: MarkerImage;
            zIndex?: number;
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
                id: string;
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
                /** 사각형 검색 영역: "SW_LNG,SW_LAT,NE_LNG,NE_LAT" */
                rect?: string;
                /** 거리 정렬 기준점 경도 */
                x?: string;
                /** 거리 정렬 기준점 위도 */
                y?: string;
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

        interface CustomOverlayOptions {
            content: string | HTMLElement;
            position: LatLng;
            xAnchor?: number;
            yAnchor?: number;
            zIndex?: number;
            clickable?: boolean;
        }

        class CustomOverlay {
            constructor(options: CustomOverlayOptions);
            setMap(map: Map | null): void;
            setPosition(position: LatLng): void;
            setContent(content: string | HTMLElement): void;
            setZIndex(zIndex: number): void;
        }

        // ── 아직 미사용 — 필요할 때 추가 ──────────────────────────────
        // AbstractOverlay, Circle, InfoWindow
        // Polygon, Polyline, Rectangle, Roadview, RoadviewClient
        // StaticMap, Tileset, ZoomControl, MapTypeControl, MapTypeId
        // MarkerClusterer, services.Geocoder, services.categorySearch …
    }
}
