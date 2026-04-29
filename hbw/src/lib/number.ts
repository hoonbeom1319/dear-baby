/**
 * 숫자로 변환
 * @param number 변환할 문자열 또는 숫자
 * @returns 변환된 숫자
 */

export const toNumber = (number: null | undefined | string | number) => {
    const type = typeof number;

    switch (type) {
        case 'number':
            return Number.isFinite(number as number) ? (number as number) : 0;
        case 'string':
            return +((number as string).replace(/,/g, '').match(/-?\d+(\.\d+)?/)?.[0] || 0);
        case 'undefined':
            return 0;
        default:
            return 0;
    }
};
