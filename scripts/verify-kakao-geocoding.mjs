// 카카오 역지오코딩 정확도 검증 (PRD §8.1-2 / 가정 2 — 가장 위험한 미검증 가정)
//
// 검증 질문: 사진 EXIF의 GPS 좌표를 "쓸 만한 장소명 후보"로 바꿀 수 있는가?
//   특히 대형건물·실내(몰 안 매장 등)에서 무너지지 않는가?
//
// 카카오엔 "좌표→POI명" 단일 API가 없으므로 두 경로를 함께 본다:
//   (A) coord2address  — 주소 + 도로명주소의 building_name (건물명 후보)
//   (B) 카테고리검색+좌표 — 좌표 주변 POI를 거리순으로 (실제 '장소명 제안'의 본체)
//
// 절차: 대표 장소를 키워드검색해 실제 좌표를 얻고 → 그 좌표를 거꾸로 돌려
//       이름을 복원하는지, EXIF 오차를 흉내 낸 ±40m 이동 후에도 견디는지 측정.
//
// 실행: KAKAO_REST_API_KEY=$(grep ^KAKAO_REST_API_KEY .env | cut -d= -f2 | tr -d ' ') \
//         node scripts/verify-kakao-geocoding.mjs

const KEY = process.env.KAKAO_REST_API_KEY;
if (!KEY) {
    console.error('환경변수 KAKAO_REST_API_KEY 가 없습니다.');
    process.exit(1);
}

const BASE = 'https://dapi.kakao.com/v2/local';

// 좌표 주변 "아무 POI"를 찾기 위해 쓸어담을 카테고리 그룹 코드
// (카카오 카테고리검색은 category_group_code 가 필수라 대표군을 순회한다)
const CATEGORY_CODES = ['MT1', 'CT1', 'AT4', 'AD5', 'FD6', 'CE7', 'CS2', 'HP8', 'PK6', 'PO3', 'SC4', 'CT1'];

// 대표 테스트 장소 — 실내몰 / 야외공원 / 건물 내부 시설 / 카페 / 문화시설 다양화
const TEST_PLACES = [
    '스타필드 하남', // 대형 실내몰
    '롯데월드 어드벤처', // 실내 테마파크(건물 내부)
    '코엑스 아쿠아리움', // 코엑스 건물 내부 시설 — 실내 약점 유발
    '서울숲', // 야외 공원
    '어린이대공원', // 야외, 넓은 부지
    '국립중앙박물관', // 대형 문화시설
    '롯데마트 잠실점', // 대형마트(건물)
    '양재 시민의숲', // 야외 공원
    '스타벅스 더종로점', // 도심 건물 내 카페
    '하남 미사경정공원' // 야외, 외곽
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function kakao(path, params) {
    const url = new URL(`${BASE}/${path}`);
    Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, String(v)));
    const res = await fetch(url, { headers: { Authorization: `KakaoAK ${KEY}` } });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status} ${path} :: ${body.slice(0, 200)}`);
    }
    return res.json();
}

// 키워드검색 → 첫 결과(장소명 + 좌표)
async function keywordSearch(query) {
    const data = await kakao('search/keyword.json', { query, size: 1 });
    const doc = data.documents?.[0];
    if (!doc) return null;
    return {
        name: doc.place_name,
        x: Number(doc.x),
        y: Number(doc.y),
        category: doc.category_group_name || doc.category_name,
        road: doc.road_address_name,
        addr: doc.address_name
    };
}

// 좌표 → 주소 (+ 도로명주소의 building_name)
async function coord2address(x, y) {
    const data = await kakao('geo/coord2address.json', { x, y });
    const doc = data.documents?.[0];
    if (!doc) return null;
    return {
        address: doc.address?.address_name ?? null,
        roadAddress: doc.road_address?.address_name ?? null,
        buildingName: doc.road_address?.building_name || null // 핵심: 건물명 후보
    };
}

// 좌표 주변 POI를 카테고리 순회로 쓸어담아 거리순 상위 N
async function nearbyPOIs(x, y, radius, topN = 5) {
    const seen = new Map();
    for (const code of new Set(CATEGORY_CODES)) {
        let data;
        try {
            data = await kakao('search/category.json', { category_group_code: code, x, y, radius, sort: 'distance', size: 5 });
        } catch {
            continue;
        }
        for (const d of data.documents ?? []) {
            if (!seen.has(d.id)) {
                seen.set(d.id, { name: d.place_name, category: d.category_group_name, distance: Number(d.distance) });
            }
        }
        await sleep(30);
    }
    return [...seen.values()].sort((a, b) => a.distance - b.distance).slice(0, topN);
}

// 이름 느슨한 매칭 — 공백 제거 후 한쪽이 다른 쪽 핵심 토큰을 포함하는가
function looseMatch(canonical, candidate) {
    if (!candidate) return false;
    const norm = (s) => s.replace(/\s+/g, '');
    const c = norm(canonical);
    const x = norm(candidate);
    if (c.includes(x) || x.includes(c)) return true;
    // 핵심 토큰(가장 긴 단어) 일부 일치도 인정
    const core = canonical.split(/\s+/).sort((a, b) => b.length - a.length)[0];
    return core && core.length >= 2 && x.includes(core);
}

// ±40m 오프셋 (EXIF 오차 흉내)
function offset(x, y, meters) {
    const dLat = meters / 111000;
    const dLng = meters / (111000 * Math.cos((y * Math.PI) / 180));
    return { x: x + dLng, y: y + dLat };
}

async function main() {
    console.log('카카오 역지오코딩 정확도 검증\n' + '='.repeat(60));
    const summary = { total: 0, addrOk: 0, buildingMatch: 0, poiTop1Match: 0, poiAnyMatch: 0, poiMatchAfterOffset: 0 };

    for (const place of TEST_PLACES) {
        summary.total++;
        console.log(`\n▶ ${place}`);
        const hit = await keywordSearch(place);
        if (!hit) {
            console.log('  키워드검색 결과 없음 — 스킵');
            continue;
        }
        console.log(`  좌표: (${hit.y.toFixed(6)}, ${hit.x.toFixed(6)})  카카오 표기명: "${hit.name}" [${hit.category}]`);

        // (A) coord2address
        const addr = await coord2address(hit.x, hit.y);
        if (addr?.roadAddress || addr?.address) summary.addrOk++;
        const buildingMatched = looseMatch(hit.name, addr?.buildingName);
        if (buildingMatched) summary.buildingMatch++;
        console.log(`  [A] 주소: ${addr?.roadAddress ?? addr?.address ?? '없음'}`);
        console.log(`      건물명: ${addr?.buildingName ?? '(없음)'} ${addr?.buildingName ? (buildingMatched ? '✓일치' : '✗불일치') : ''}`);

        // (B) 좌표 주변 POI (radius 50 → 없으면 200)
        let pois = await nearbyPOIs(hit.x, hit.y, 50);
        if (pois.length === 0) pois = await nearbyPOIs(hit.x, hit.y, 200);
        const top1 = pois[0];
        const top1Match = looseMatch(hit.name, top1?.name);
        const anyMatch = pois.some((p) => looseMatch(hit.name, p.name));
        if (top1Match) summary.poiTop1Match++;
        if (anyMatch) summary.poiAnyMatch++;
        console.log(`  [B] 좌표 주변 POI (거리순):`);
        if (pois.length === 0) console.log('      (없음)');
        pois.forEach((p, i) => {
            const m = looseMatch(hit.name, p.name) ? '  ← 일치' : '';
            console.log(`      ${i + 1}. ${p.name} [${p.category}] ${p.distance}m${m}`);
        });
        console.log(`      → top1 ${top1Match ? '✓일치' : '✗불일치'}, 후보 내 ${anyMatch ? '✓있음' : '✗없음'}`);

        // (C) EXIF 오차 흉내: +40m 이동 후 top1
        const off = offset(hit.x, hit.y, 40);
        let poisOff = await nearbyPOIs(off.x, off.y, 60);
        if (poisOff.length === 0) poisOff = await nearbyPOIs(off.x, off.y, 250);
        const offMatch = poisOff.some((p) => looseMatch(hit.name, p.name));
        if (offMatch) summary.poiMatchAfterOffset++;
        console.log(`  [C] +40m 이동 후 후보 내 일치: ${offMatch ? '✓' : '✗'} (top1: ${poisOff[0]?.name ?? '없음'})`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('요약 (n=' + summary.total + ')');
    console.log(`  주소 반환 성공          : ${summary.addrOk}/${summary.total}`);
    console.log(`  건물명이 장소명과 일치   : ${summary.buildingMatch}/${summary.total}`);
    console.log(`  주변POI top1 일치       : ${summary.poiTop1Match}/${summary.total}`);
    console.log(`  주변POI 후보 내 일치     : ${summary.poiAnyMatch}/${summary.total}`);
    console.log(`  +40m 후에도 후보 내 일치 : ${summary.poiMatchAfterOffset}/${summary.total}`);
    console.log('='.repeat(60));
}

main().catch((e) => {
    console.error('실패:', e.message);
    process.exit(1);
});
