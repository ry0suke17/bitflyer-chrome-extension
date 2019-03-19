import {
  CancelAllChildOrdersRequest,
  SendChildOrderRequest,
  SendChildOrderResponse,
  SendParentOrderRequest,
  SendParentOrderResponse,
} from '@infrastructure/repository/bitflyer/api/types/api';
import { APIError } from '@infrastructure/repository/bitflyer/api/types/apiError';
import APIResult from '@infrastructure/repository/bitflyer/api/types/apiResult';
import crypto from 'crypto';

/**
 * ClientConfig はクライアントの設定を表す。
 */
export interface ClientConfig {
  /** baseURL はベースとなる URL を表す。 */
  baseURL: string;
  /** apiKey は API アクセスの時に必要なキーを表す。 */
  apiKey: string;
  /** apiSecret は API アクセスに必要なシークレットを表す。 */
  apiSecret: string;
}

/**
 * Client は bitFlyer の HTTP API のクライアントを表す。
 */
export default class BitFlyerAPIClient {
  /**
   * コンストラクタ
   * @param conf: クライアントの設定を表す。
   */
  constructor(private readonly conf: ClientConfig) {}

  /**
   * cancelAllChildOrders は全ての注文をキャンセルする。
   * @param req: リクエストを表す。
   */
  public cancelAllChildOrders(
    req: CancelAllChildOrdersRequest,
  ): Promise<APIResult<string>> {
    const timestamp = this.generateTimestamp();
    const method = 'POST';
    const path = '/v1/me/cancelallchildorders';
    const body = JSON.stringify(req);
    const sign = this.generateSign(timestamp, method, path, body);

    return new Promise(resolve => {
      fetch(
        this.generateRequestURL(path),
        this.generateRequestInit(method, body, timestamp, sign),
      ).then(res => {
        // res.json() を利用すると何もレスポンスがなかった時にエラーとなるので res.text() を使用する。
        // bitFlyer 側が何も返していない。
        // ref. https://github.com/github/fetch/issues/268 {
        res.text().then(text => {
          if (!res.ok) {
            resolve(APIResult.getFailed(this.handleError(text)));
            return;
          }

          // 成功した時に API の結果として null が帰ってくるが、成功したがわかるように null は入れない。
          // とりあえず success の文字列を入れておく。 {
          resolve(APIResult.getSucceeded('success'));
          // }
        });
        // }
      });
    });
  }

  /**
   * sendChildOrder は新規注文を出す。
   * @param req リクエストを表す。
   */
  public sendChildOrder(
    req: SendChildOrderRequest,
  ): Promise<APIResult<SendChildOrderResponse>> {
    const timestamp = this.generateTimestamp();
    const method = 'POST';
    const path = '/v1/me/sendchildorder';
    const body = JSON.stringify(req);
    const sign = this.generateSign(timestamp, method, path, body);

    return new Promise(resolve => {
      fetch(
        this.generateRequestURL(path),
        this.generateRequestInit(method, body, timestamp, sign),
      ).then(res => {
        res.text().then(text => {
          if (!res.ok) {
            resolve(APIResult.getFailed(this.handleError(text)));
            return;
          }

          const resp = JSON.parse(text) as SendChildOrderResponse;
          resolve(APIResult.getSucceeded(resp));
        });
      });
    });
  }

  /**
   * sendParentOrder は新規注文を出す。
   * @param req リクエストを表す。
   */
  public sendParentOrder(
    req: SendParentOrderRequest,
  ): Promise<APIResult<SendParentOrderResponse>> {
    const timestamp = this.generateTimestamp();
    const method = 'POST';
    const path = '/v1/me/sendparentorder';
    const body = JSON.stringify(req);
    const sign = this.generateSign(timestamp, method, path, body);

    return new Promise((resolve, reject) => {
      fetch(
        this.generateRequestURL(path),
        this.generateRequestInit(method, body, timestamp, sign),
      ).then(res => {
        res.text().then(text => {
          if (!res.ok) {
            resolve(APIResult.getFailed(this.handleError(text)));
            return;
          }

          const resp = JSON.parse(text) as SendParentOrderResponse;
          resolve(APIResult.getSucceeded(resp));
        });
      });
    });
  }

  /**
   * createURL は URL を生成する。
   * @param path: API のパスを表す。
   */
  private generateRequestURL(path: string): string {
    return `${this.conf.baseURL}${path}`;
  }

  /**
   * generateRequestInit は RequestInit を生成する。
   * @param method リクエストのメソッドを表す。
   * @param body リクエストのボディーを表す。JSON の文字列である必要がある。
   * @param timestamp タイムスタンプを表す。
   * @param sign 署名を表す。
   */
  private generateRequestInit(
    method: string,
    body: string,
    timestamp: string,
    sign: string,
  ): RequestInit {
    return {
      method,
      body,
      headers: {
        'ACCESS-KEY': this.conf.apiKey,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-SIGN': sign,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  /**
   * generateSign は署名を生成する。
   * @param timestamp: タイムスタンプを表す。
   * @param method: リクエストのメソッドを表す。
   * @param path: リクエストのパスを表す。
   * @param body: リクエストのボディーを表す。json の文字列であることに注意する。
   */
  private generateSign(
    timestamp: string,
    method: string,
    path: string,
    body: string,
  ): string {
    const text = timestamp + method + path + body;
    return crypto
      .createHmac('sha256', this.conf.apiSecret)
      .update(text)
      .digest('hex');
  }

  /**
   * getTimestamp はタイムスタンプを取得する
   */
  private generateTimestamp(): string {
    return Date.now().toString();
  }

  /**
   * handleError はエラーをハンドリングする。
   * @param text はレスポンスの JSON のテキストを表す。
   */
  private handleError(text: string): APIError {
    try {
      return JSON.parse(text) as APIError;
    } catch (err) {
      throw Error(`failed to convert APIError. text: ${text}`);
    }
  }
}
