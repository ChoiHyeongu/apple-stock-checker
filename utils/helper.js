import dayjs from 'dayjs';

/**
 * ms만큼 기다리기
 * @param {*} ms 밀리세컨드
 * @param {*} message 메세지
 * @returns
 */
export async function delay(ms, message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(message);
    }, ms);
  });
}

export function now(format) {
  const today = dayjs().format(format);
  return today;
}
