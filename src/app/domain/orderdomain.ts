import DomainResult from '@domain/types/domainresult';
import BitFlyerAPIClient from '@infrastructure/repository/bitflyer/api/client';
import {
  CancelAllChildOrdersRequest,
  SendChildOrderRequest,
  SendChildOrderResponse,
  SendParentOrderRequest,
  SendParentOrderResponse,
} from '@infrastructure/repository/bitflyer/api/types/api';

/**
 * OrderDomain は注文に関する機能を表す。
 */
export default class OrderDomain {
  /**
   * コンストラクタ
   * @param setting このクラスの設定を表す。
   */
  constructor(private readonly apiClient: BitFlyerAPIClient) {}

  /**
   * cancelAllChildOrders は全てのオーダーをキャンセルする。
   * @param req リクエストを表す。
   */
  public cancelAllChildOrders(
    req: CancelAllChildOrdersRequest,
  ): Promise<DomainResult<string>> {
    return this.apiClient
      .cancelAllChildOrders(req)
      .then(resp => DomainResult.fromAPIResult(resp));
  }

  /**
   * sendChildOrder は新規注文を出す。
   * @param req リクエストを表す。
   */
  public sendChildOrder(
    req: SendChildOrderRequest,
  ): Promise<DomainResult<SendChildOrderResponse>> {
    return this.apiClient
      .sendChildOrder(req)
      .then(resp => DomainResult.fromAPIResult(resp));
  }

  /**
   * sendParentOrder は新規注文を出す。
   * @param req リクエストを表す。
   */
  public sendParentOrder(
    req: SendParentOrderRequest,
  ): Promise<DomainResult<SendParentOrderResponse>> {
    return this.apiClient
      .sendParentOrder(req)
      .then(resp => DomainResult.fromAPIResult(resp));
  }
}
