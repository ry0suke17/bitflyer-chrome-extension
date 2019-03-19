import DomainResult from '@domain/types/domainresult';
import {
  CancelAllChildOrdersRequest,
  SendChildOrderRequest,
  SendChildOrderResponse,
  SendParentOrderRequest,
  SendParentOrderResponse,
} from '@infrastructure/repository/bitflyer/api/types/api';

/**
 * SendMessageParam は messaging API で送るリクエストを表す。
 */
export interface SendMessageRequest {
  /** query は呼び出す対象を識別するクエリーを表す。 */
  query: string;
  /** req はリクエストを表す。 */
  req: any;
}

/**
 *  sendMessageCancelAllChildOrders は cancelAllChildOrders を実行する。
 * @param req リクエストを表す。
 */
export function sendMessageCancelAllChildOrders(
  req: CancelAllChildOrdersRequest,
): Promise<DomainResult<string>> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      {
        query: 'cancelAllChildOrders',
        req,
      },
      resp => {
        resolve(resp as DomainResult<string>);
      },
    );
  });
}

/**
 *  sendMessageSendChildOrder は sendChildOrder を実行する。
 * @param req リクエストを表す。
 */
export function sendMessageSendChildOrder(
  req: SendChildOrderRequest,
): Promise<DomainResult<SendChildOrderResponse>> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      {
        query: 'sendChildOrder',
        req,
      },
      resp => {
        resolve(resp as DomainResult<SendChildOrderResponse>);
      },
    );
  });
}

/**
 *  sendMessageSendParentOrder は sendParentOrder を実行する。
 * @param req リクエストを表す。
 */
export function sendMessageSendParentOrder(
  req: SendParentOrderRequest,
): Promise<DomainResult<SendParentOrderResponse>> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      {
        query: 'sendParentOrder',
        req,
      },
      resp => {
        resolve(resp as DomainResult<SendParentOrderResponse>);
      },
    );
  });
}
