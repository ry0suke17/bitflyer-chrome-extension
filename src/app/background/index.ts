import { SendMessageRequest } from '@contentscript/chrome/message';
import OrderDomain from '@domain/orderdomain';
import {
  bitFlyerAPIBaseURL,
  bitFlyerAPIKey,
  bitFlyerAPISecret,
} from '@infrastructure/config/config';
import { watchChanges } from '@infrastructure/devel/hotreload';
import BitFlyerAPIClient from '@infrastructure/repository/bitflyer/api/client';

/**
 * handleError はエラーハンドリングを表す。
 * @param error エラー表す。
 */
const handleError = (error: Error, sender?: chrome.runtime.MessageSender) => {
  if (sender && sender.tab && sender.tab.id) {
    chrome.tabs.sendMessage(
      sender.tab.id,
      {
        contentScriptQuery: 'error',
        error: error.message,
      },
      res => console.error(res),
    );
    console.error(error);
  } else {
    // タブIDがない {
    console.error(`tab id is not defined. err: ${error}`);
    // }
  }
};

/**
 * bitFlyerAPIClient は bitFlyer の API クライアントを表す。
 */
const bitFlyerAPIClient = new BitFlyerAPIClient({
  baseURL: bitFlyerAPIBaseURL,
  apiKey: bitFlyerAPIKey,
  apiSecret: bitFlyerAPISecret,
});

/**
 * orderDomain は注文に関する機能を表す。
 */
const orderDomain = new OrderDomain(bitFlyerAPIClient);

/**
 * ホットリロードの設定
 */
chrome.management.getSelf(self => {
  if (self.installType === 'development') {
    chrome.runtime.getPackageDirectoryEntry(dir => {
      // dist ディレクトリだけ関しするようにする {
      dir.getDirectory(
        'dist',
        undefined,
        distDir => {
          watchChanges(distDir);
        },
        err => {
          console.error(err);
        },
      );
      // }
    });
  }
});

/**
 * messaging API を利用して bitFlyer の API にアクセスする。
 * ref. http://dev.chromium.org/Home/chromium-security/extension-content-script-fetches
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    const req = request as SendMessageRequest;

    switch (req.query) {
      case 'cancelAllChildOrders':
        orderDomain.cancelAllChildOrders(request.req).then(resp => {
          // messaging API でエラーを送ると content script 側で受信した時に resp.failed が
          // Object 型になってしまう。詳しい原因はわからないが、おそらくエラーはスタックトレース
          // とかを持っているのでそれを無効にするとかで Object に書き換えられているのかも。
          // resp.failed そエラー型にしないようにして送るようにした。 {
          sendResponse(resp);
          // }
        });
        break;
      case 'sendChildOrder':
        orderDomain
          .sendChildOrder(request.req)
          .then(resp => sendResponse(resp));
        break;
      case 'sendParentOrder':
        orderDomain
          .sendParentOrder(request.req)
          .then(resp => sendResponse(resp));
        break;
      default:
        throw new Error(
          `not found query. query: ${req.query}, req: ${req.req}`,
        );
    }
  } catch (err) {
    handleError(err, sender);
    return true;
  }

  // 非同期で呼び出す。
  // ref. https://developer.chrome.com/extensions/messaging#simple {
  return true; // Will respond asynchronously.
  // }
});
