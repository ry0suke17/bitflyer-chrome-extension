import { APIError } from '@infrastructure/repository/bitflyer/api/types/apiError';

/**
 * APIResult API の結果を表す。
 */
export default class APIResult<T> {
  /**
   * getSucceeded は成功した場合の結果を返す。
   * @param s 成功した場合の結果を表す。
   */
  public static getSucceeded<T>(s: T): APIResult<T> {
    return new APIResult(s);
  }

  /**
   * getFailed は失敗した場合の結果を返す。
   * @param e 失敗した場合のエラーを表す。
   */
  public static getFailed(e: APIError): APIResult<any> {
    return new APIResult(null, e);
  }

  /**
   * 内部コンストラクタ
   * @param succeeded 成功した場合の結果を表す。
   * @param failed 失敗した場合のエラーを表す。
   */
  private constructor(
    public readonly succeeded?: T,
    public readonly failed?: APIError,
  ) {}
}
