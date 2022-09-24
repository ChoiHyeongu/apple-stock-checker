import api from './src/api/index.js';
import { helper } from './src/utils/index.js';
import db from './src/db/index.js';

const LOCATION = '05803';
const CHECK_CYCLE = 3000;
const PROCESS = {
  START: 0,
  STOP: 1,
};

async function fetchDeliveryInfo(sku, location) {
  const response = await api.apple.getStock({ productCode: sku, location });

  const {
    body: {
      content: { deliveryMessage },
    },
  } = response;

  return deliveryMessage[sku].regular;
}

async function logKindOfModel(kind) {
  const now = helper.now('YYYY.M.D HH:mm:ss');
  console.log(`<${kind}>`, now);
}

async function logStockInfo(deliveryInfo) {
  const buyableMessage = deliveryInfo.isBuyable ? '구매 가능' : '재고 없음';
  console.log(` - ${deliveryInfo.subHeader} - ${buyableMessage}`);
}

async function logStockInfos(stockInfos) {
  stockInfos.forEach(logStockInfo);
}

async function getModelsDeliveryInfo(models, location) {
  const result = await Promise.all(
    Object.keys(models).map(async (sku) => {
      const result = await fetchDeliveryInfo(sku, location);
      return result;
    })
  );
  return result;
}

async function checkDeliveryStocks(kind, models) {
  try {
    logKindOfModel(kind);
    const stockInfos = await getModelsDeliveryInfo(models, LOCATION);
    logStockInfos(stockInfos);
  } catch (err) {}
}

async function run() {
  const status = PROCESS.START;

  while (status) {
    for (const [kind, models] of Object.entries(db)) {
      await checkDeliveryStocks(kind, models);
    }
    console.log('');
    await helper.delay(CHECK_CYCLE);

    //TODO: 특정 조건을 만족하면 프로세스 종료
    // status = PROCESS.STOP
  }
}

run();
