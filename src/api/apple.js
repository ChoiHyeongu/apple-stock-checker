import request from '../request/index.js';

/**
 * 현장 재고 정보 가져오기
 * @param {*} productCode 상품 코드
 * @param {*} location 우편번호
 * @returns
 */
export function getStock({ productCode, location }) {
  return request.get(`shop/fulfillment-messages?pl=true&mts.0=regular&parts.0=${productCode}&location=${location}`);
}
