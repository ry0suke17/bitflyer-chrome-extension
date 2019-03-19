import {
  testBitFlyerAPIBaseURL,
  testBitFlyerAPIKey,
  testBitFlyerAPISecret,
} from '@infrastructure/config/test/config';
import Client from '@infrastructure/repository/bitflyer/api/client';
import { SendChildOrderResponse } from '@infrastructure/repository/bitflyer/api/types/api';
import APIResult from '@infrastructure/repository/bitflyer/api/types/apiResult';

/**
 * 成功するリクエストのテストはコメントアウトしておく。理由は約定、注文に関わるため。
 * 本当はモックを作成してテストを書くのが望ましいが、そこまでは今の所しない。
 */

describe('API Client のテスト', () => {
  const client = new Client({
    baseURL: testBitFlyerAPIBaseURL,
    apiKey: testBitFlyerAPIKey,
    apiSecret: testBitFlyerAPISecret,
  });

  /*
  it('全ての注文のキャンセルができる', () => {
    return client.cancelAllChildOrders({
      product_code: 'FX_BTC_JPY',
    });
  });
  */

  /*
  it('指値の買い注文ができる', () => {
    return client.sendChildOrder({
      product_code: 'FX_BTC_JPY',
      child_order_type: 'LIMIT',
      side: 'BUY',
      price: 250000,
      size: 0.01,
    });
  });
  */

  it('指値の売り注文を出すが価格が指定されていないので失敗する', () => {
    return new Promise((resolve, reject) => {
      client
        .sendChildOrder({
          product_code: 'FX_BTC_JPY',
          child_order_type: 'LIMIT',
          side: 'SELL',
          size: 0.01,
        })
        .then(resp => {
          if (resp.failed) {
            resolve();
          } else {
            reject('success, but want error.');
          }
        });
    });
  });

  /*
  it('買いのストップリミット注文ができる', () => {
    return client.sendParentOrder({
      order_method: 'SIMPLE',
      parameters: [
        {
          product_code: 'FX_BTC_JPY',
          condition_type: 'STOP_LIMIT',
          side: 'BUY',
          size: 0.01,
          trigger_price: 799990,
          price: 800000,
        },
      ],
    });
  });
  */

  it('売りのトリガー価格が指定されていないのでストップリミット注文が失敗する', () => {
    return new Promise((resolve, reject) => {
      client
        .sendParentOrder({
          order_method: 'SIMPLE',
          parameters: [
            {
              product_code: 'FX_BTC_JPY',
              condition_type: 'STOP_LIMIT',
              side: 'SELL',
              size: 0.01,
              price: 250000,
            },
          ],
        })
        .then(resp => {
          if (resp.failed) {
            resolve();
          } else {
            reject('success, but want error.');
          }
        });
    });
  });

  it('買いの注文価格が指定されていないのでストップリミット注文が失敗する', () => {
    return new Promise((resolve, reject) => {
      client
        .sendParentOrder({
          order_method: 'SIMPLE',
          parameters: [
            {
              product_code: 'FX_BTC_JPY',
              condition_type: 'STOP_LIMIT',
              side: 'BUY',
              size: 0.01,
              trigger_price: 799990,
            },
          ],
        })
        .then(resp => {
          if (resp.failed) {
            resolve();
          } else {
            reject('success, but want error.');
          }
        });
    });
  });
});
