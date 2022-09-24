import request from '../request/index.js';
import { sku } from '../db/sku.js';

/**
 * 현장 재고 정보 가져오기
 * @param {*} productCode 상품 코드
 * @param {*} location 우편번호
 * @returns
 */
export function getStock({ productCode, location }) {
  const url = createURL();
  return request.get(url);
  // return request.get(`shop/fulfillment-messages?pl=true&mts.0=regular&parts.0=${productCode}&location=${location}`);
}

const createURL = () => {
  let url = 'shop/fulfillment-messages?pl=true&mts.0=regular';

  sku.slice(0, 10).forEach((v, i) => {
    url = url + `&parts.${i}=${v}KH/A`;
  });

  return url;
};
