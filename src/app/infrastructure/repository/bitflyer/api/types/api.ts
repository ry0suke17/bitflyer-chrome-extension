/** ProductCode は bitFlyer で扱っている通過のコードの型を表す。 */
type ProductCode = 'FX_BTC_JPY';

/** ChildOrderType はオーダータイプの型を表す。 */
type ChildOrderType = 'LIMIT' | 'MARKET';

/**
 * TimeInForce 執行数量条件を表す。詳細は以下参照。
 * ref. https://lightning.bitflyer.com/docs/specialorder#%E5%9F%B7%E8%A1%8C%E6%95%B0%E9%87%8F%E6%9D%A1%E4%BB%B6
 */
type TimeInForce = 'GTC' | 'IOC' | 'FOK';

/**
 * OrderMethod は特殊注文の種類を表す。
 * とりあえず SIMPLE のみの対応とする。
 */
// type OrderMethod = 'SIMPLE' | 'IFD' | 'OCO' | 'IFDOCO';
type OrderMethod = 'SIMPLE';

/**
 * OrderParameter は特殊注文のパラメーターを表す。
 */
interface OrderParameter {
  /** product_code は対象の暗号通過のコードを表す。 */
  product_code: ProductCode;
  /** condition_type は注文の執行条件を表す。 */
  condition_type: ConditionType;
  /** side は売買方法を表す。 */
  side: Side;
  /** price は注文する時の価格を表す。condition_type に "LIMIT" または "STOP_LIMIT" を選んだ場合は必須 */
  price?: number;
  /** size は枚数を表す。 */
  size: number;
  /** trigger_price はストップ注文のトリガー価格を表す。 condition_type に "STOP" または "STOP_LIMIT" を選んだ場合は必須 */
  trigger_price?: number;
  /** トレーリング・ストップ注文のトレール幅を表す。condition_type に "TRAIL" を選んだ場合は必須。 */
  offset?: number;
}

/**
 * ConditionYype は注文の執行条件を表す。
 * とりあえず LIMIT と STOP_LIMIT のみ対応する。
 */
// export type ConditionType =
//   | 'LIMIT'
//   | 'MARKET'
//   | 'STOP'
//   | 'STOP_LIMIT'
//   | 'TRAIL';
export type ConditionType = 'LIMIT' | 'STOP_LIMIT';

/** Side は売買の型を表す。 */
export type Side = 'BUY' | 'SELL';

/**
 * CancelChildOrderRequest はすべての注文をキャンセルする時にリクエストを表す。
 */
export interface CancelAllChildOrdersRequest {
  /** product_code は対象の暗号通過のコードを表す。 */
  product_code: ProductCode;
}

/**
 * SendChildOrderRequest は新規の注文をだすリクエストを表す。
 */
export interface SendChildOrderRequest {
  /** product_code は対象の暗号通過のコードを表す。 */
  product_code: ProductCode;
  /** child_order_type はオーダーのタイプを表す。 */
  child_order_type: ChildOrderType;
  /** side は売買方法を表す。 */
  side: Side;
  /** price は注文する時の価格を表す。child_order_type に LIMIT を指定した場合は必須。 */
  price?: number;
  /** size は枚数を表す。 */
  size: number;
  /** minute_to_expire 期限切れまでの分を表す。指定がない時はは 43200 （３０日間）。 */
  minute_to_expire?: number;
  /** time_in_force は執行数量条件を表す。指定がない時は GTC */
  time_in_force?: TimeInForce;
}

/**
 * SendChildOrderResponse は新規の注文を出した後のレスポンスを表す。
 */
export interface SendChildOrderResponse {
  /** child_order_acceptance_id はオーダーidを表す。 */
  child_order_acceptance_id: string;
}

/**
 * SendParentOrderRequest は特殊注文を出す時のリクエストを表す。
 */
export interface SendParentOrderRequest {
  /** order_method は特殊注文の種類を表す。 */
  order_method: OrderMethod;
  /** minute_to_expire 期限切れまでの分を表す。指定がない時はは 43200 （３０日間）。 */
  minute_to_expire?: number;
  /** time_in_force は執行数量条件を表す。指定がない時は GTC */
  time_in_force?: TimeInForce;
  /** parameters は注文のパラメーターを表す。 */
  parameters: OrderParameter[];
}

/**
 * SendParentOrderResponse は特殊注文を出した後のレスポンスを表す。
 */
export interface SendParentOrderResponse {
  /** parent_order_acceptance_id はオーダーidを表す。 */
  parent_order_acceptance_id: string;
}
