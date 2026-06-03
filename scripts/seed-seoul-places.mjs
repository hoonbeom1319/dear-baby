/**
 * 서울 장소 RAW 데이터 일괄 등록
 * createPlace / insertPlace 와 동일한 CreatePlaceInput 형식으로 insert
 *
 * 실행: node --env-file=.env scripts/seed-seoul-places.mjs
 * dry-run: node --env-file=.env scripts/seed-seoul-places.mjs --dry-run
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes('--dry-run');

const AREA_BY_NAME = {
    강남구: 'gangnam',
    강북구: 'gangbuk',
    강동구: 'gangdong',
    강서구: 'gangseo',
    관악구: 'gwanak',
    광진구: 'gwangjin',
    구로구: 'guro',
    금천구: 'geumcheon',
    노원구: 'nowon',
    도봉구: 'dobong',
    동대문구: 'dongdaemun',
    동작구: 'dongjak',
    마포구: 'mapo',
    서대문구: 'seodaemun',
    서초구: 'seocho',
    성동구: 'seongdong',
    성북구: 'seongbuk',
    송파구: 'songpa',
    양천구: 'yangcheon',
    영등포구: 'yeongdeungpo',
    용산구: 'yongsan',
    은평구: 'eunpyeong',
    종로구: 'jongno',
    중구: 'jung',
    중랑구: 'jungnang'
};

const CATEGORY_BY_NAME = {
    카페: 'cafe',
    식당: 'rest'
};

const AMENITY_COLS = ['nurse', 'diaper', 'chair', 'stroll', 'park'];

function mustGetEnv(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

function buildAgeRange(start, end) {
    const s = String(start ?? '').trim();
    const e = String(end ?? '').trim();
    if (!s && !e) return '전 연령';
    if (s && !e) return `${s}개월~`;
    if (s && e) return `${s}~${e}개월`;
    return '';
}

function parseAmenities(flags) {
    return AMENITY_COLS.filter((_, i) => flags[i] === 'O');
}

/** admin-places handleSave 와 동일한 input */
function toCreatePlaceInput(row, sortOrder) {
    const [name, areaName, categoryName, address, ageStart, ageEnd, description, ...amenityFlags] = row;

    const area = AREA_BY_NAME[areaName];
    if (!area) throw new Error(`Unknown area: ${areaName} (${name})`);

    const category = CATEGORY_BY_NAME[categoryName];
    if (!category) throw new Error(`Unknown category: ${categoryName} (${name})`);

    return {
        area,
        category,
        name: name.trim(),
        address: address.trim(),
        phone: '',
        ageRange: buildAgeRange(ageStart, ageEnd === 'NULL' || ageEnd === '' ? '' : ageEnd),
        description: description.trim(),
        amenities: parseAmenities(amenityFlags),
        sortOrder
    };
}

async function insertPlace(supabase, input) {
    const { data, error } = await supabase
        .from('places')
        .insert({
            area: input.area,
            category: input.category,
            name: input.name,
            address: input.address,
            phone: input.phone,
            age_range: input.ageRange,
            description: input.description,
            sort_order: input.sortOrder,
            status: 'review'
        })
        .select('id')
        .single();

    if (error) throw new Error(error.message);

    if (input.amenities.length > 0) {
        const { error: amenityError } = await supabase.from('place_amenities').insert(
            input.amenities.map((amenity_id) => ({ place_id: data.id, amenity_id }))
        );
        if (amenityError) throw new Error(amenityError.message);
    }
}

function loadRows() {
    const tsv = readFileSync(join(__dirname, 'seoul-places.tsv'), 'utf8');
    return tsv
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split('\t'));
}

async function main() {
    const rows = loadRows();
    console.log(`Loaded ${rows.length} rows from seoul-places.tsv`);

    if (DRY_RUN) {
        const sample = toCreatePlaceInput(rows[0], 1);
        console.log('Sample input:', JSON.stringify(sample, null, 2));
        console.log('Last row name:', rows[rows.length - 1][0]);
        return;
    }

    const supabase = createClient(mustGetEnv('NEXT_PUBLIC_SUPABASE_URL'), mustGetEnv('SUPABASE_SERVICE_ROLE_KEY'), {
        auth: { persistSession: false, autoRefreshToken: false }
    });

    let ok = 0;
    let skip = 0;
    let fail = 0;

    for (let i = 0; i < rows.length; i++) {
        const input = toCreatePlaceInput(rows[i], i + 1);
        const label = `[${i + 1}/${rows.length}] ${input.name}`;

        const { data: existing } = await supabase
            .from('places')
            .select('id')
            .eq('name', input.name)
            .eq('address', input.address)
            .maybeSingle();

        if (existing) {
            console.log(`${label} — skip (already exists)`);
            skip++;
            continue;
        }

        try {
            await insertPlace(supabase, input);
            console.log(`${label} — ok`);
            ok++;
        } catch (e) {
            console.error(`${label} — FAIL:`, e.message);
            fail++;
        }
    }

    console.log(`\nDone: ${ok} inserted, ${skip} skipped, ${fail} failed`);
    if (fail > 0) process.exit(1);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
