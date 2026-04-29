/**
 * 숫자에 천 단위 구분자(쉼표) 추가
 * @param number 포맷팅할 숫자
 * @param group 그룹 단위 (기본값: 3)
 * @returns 쉼표가 추가된 문자열
 */
export const groupingDigitWithCommas = (number?: string | number | null, group = 3) => {
    if (number === null || number === undefined || number === '') return '';
    if (typeof number === 'number') number = number.toString();

    const [integer, decimal] = number.split('.');
    const int = integer.replace(new RegExp(`\\B(?=(\\d{${group}})+(?!\\d))`, 'g'), ',');
    const dec = decimal ? '.' + decimal : '';

    return int + dec;
};
