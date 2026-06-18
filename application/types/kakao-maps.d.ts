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
            getProjection(): MapProjection;
            relayout(): void;
        }

        /** 좌표 ↔ 컨테이너 픽셀 변환 — 줌별 미터당 px 실측에 쓴다. */
        interface MapProjection {
            containerPointFromCoords(latlng: LatLng): Point;
            coordsFromContainerPoint(point: Point): LatLng;
        }

        class Size {
            constructor(width: number, height: number);
        }

        class Point {
            constructor(x: number, y: number);
            x: number;
            y: number;
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
            setPosition(position: LatLng): void;
            getPosition(): LatLng;
        }

        /** 지도/마커 클릭 등에서 콜백으로 넘어오는 마우스 이벤트 */
        interface MouseEvent {
            latLng: LatLng;
        }

        namespace event {
            // 핸들러는 클릭류 이벤트에서 MouseEvent를 받는다. 인자 없는 핸들러(()=>void)도 할당 가능.
            function addListener<T extends object>(target: T, type: string, handler: (mouseEvent: MouseEvent) => void): void;
            function removeListener<T extends object>(target: T, type: string, handler: (mouseEvent: MouseEvent) => void): void;
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
                /** 카테고리 그룹 코드(예: 'FD6') — 카테고리 검색 시 채워짐 */
                category_group_code?: string;
                /** 카테고리 그룹명(예: '음식점') */
                category_group_name?: string;
                phone: string;
                address_name: string;
                road_address_name: string;
                x: string;
                y: string;
                place_url: string;
                /** 기준 좌표(location/x·y)로부터의 거리(m) — 좌표 기반 검색 시에만 */
                distance?: string;
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

            /** 카테고리 그룹 검색 — keyword 없이 좌표 주변 POI를 카테고리로 훑는다 */
            interface CategorySearchOptions {
                location?: LatLng;
                /** 반경(m), location 또는 x·y와 함께 사용 */
                radius?: number;
                /** 거리 정렬 기준점 경도 */
                x?: string;
                /** 거리 정렬 기준점 위도 */
                y?: string;
                /** 사각형 검색 영역: "SW_LNG,SW_LAT,NE_LNG,NE_LAT" */
                rect?: string;
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
                categorySearch(
                    code: string,
                    callback: (result: PlacesSearchDocument[], status: Status, pagination: Pagination) => void,
                    options?: CategorySearchOptions
                ): void;
            }

            /** 좌표 → 주소 변환 결과의 주소 객체 */
            interface Coord2AddressDocument {
                address: {
                    address_name: string;
                    region_1depth_name: string;
                    region_2depth_name: string;
                    region_3depth_name: string;
                } | null;
                road_address: {
                    address_name: string;
                    /** 건물명 — 대형 건물/몰의 대표 장소명 후보 */
                    building_name: string;
                } | null;
            }

            class Geocoder {
                constructor();
                /** 좌표(경도 x, 위도 y) → 주소. building_name 후보 확보용 */
                coord2Address(
                    x: number,
                    y: number,
                    callback: (result: Coord2AddressDocument[], status: Status) => void
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
