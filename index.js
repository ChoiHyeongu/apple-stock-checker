import api from './src/api/index.js';
import { helper } from './src/utils/index.js';
import db from './src/db/index.js';

async function fetchStockInfo(code, location) {
  const response = await api.apple.getStock({ productCode: code, location });

  const {
    body: {
      content: { deliveryMessage, pickupMessage },
    },
  } = response;

  return deliveryMessage[code];
}

async function fetchStockInfos(models, location) {
  const result = await Promise.all(
    Object.entries(models).map(async ([code, spec]) => {
      const isBuyable = await fetchStockInfo(code, location);
      return { result: isBuyable, data: { code, spec } };
    })
  );
  return result;
}

async function run() {
  while (true) {
    for (const [kind, models] of Object.entries(db)) {
      const now = helper.now('YYYY.M.D HH:mm:ss');
      console.log(`<${kind}>`, now);
      const buyableList = await fetchStockInfos(models, '05803');
      buyableList.forEach(({ result, data }) => {
        const { code, spec } = data;
        console.log(`  - [${code}] ${spec.size}-${spec.color}-${spec.storage}: ${result ? '구매 가능' : '재고 없음'}`);
      });
      console.log('');
    }
    await helper.delay(3000);
  }
}

run();
