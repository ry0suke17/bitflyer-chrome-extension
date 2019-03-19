import { DomainError } from '@domain/types/domainerror';
import APIResult from '@infrastructure/repository/bitflyer/api/types/apiResult';

/**
 * DomainResult はドメインメソッドの結果を表す。
 */
export default class DomainResult<T> {
  /**
   * getSucceeded は成功した場合の結果を返す。
   * @param s 成功した場合の結果を表す。
   */
  public static getSucceeded<T>(s: T): DomainResult<T> {
    return new DomainResult(s);
  }

  /**
   * getFailed は失敗した場合の結果を返す。
   * @param e 失敗した場合のエラーを表す。
   */
  public static getFailed(e: DomainError): DomainResult<any> {
    return new DomainResult(null, e);
  }

  /**
   * fromAPIResult は API の結果をドメイン結果に変換する。
   * 利用者が限定的な間は機械的に変換するが、将来的には利用者にわかるエラーメッセージを生成することが想定される。
   * @param value Support API の結果を表す。
   */
  public static fromAPIResult<T>(value: APIResult<T>): DomainResult<T> {
    if (value.failed) {
      return DomainResult.getFailed({ apiError: value.failed });
    }
    return DomainResult.getSucceeded(value.succeeded!);
  }

  /**
   * 内部コンストラクタ
   * @param succeeded 成功した場合の結果を表す。
   * @param failed 失敗した場合のエラーを表す。
   */
  private constructor(
    public readonly succeeded?: T,
    public readonly failed?: DomainError,
  ) {}

  /**
   * merge は 2 つの結果をマージした結果を返す。両方にエラーがある場合は m のエラーは無視される。
   * @param m マージする結果を表す。
   */
  public merge<M>(m: DomainResult<M>): DomainResult<[T, M]> {
    if (this.failed) {
      return DomainResult.getFailed(this.failed);
    }
    if (m.failed) {
      return DomainResult.getFailed(m.failed);
    }
    const merged: [T, M] = [this.succeeded!, m.succeeded!];
    return DomainResult.getSucceeded(merged);
  }

  /**
   * map は成功した場合の結果があれば、それに関数を適用する。
   * @param callbackfn 成功した場合の結果に適用する関数を表す。
   */
  public map<M>(callbackfn: (v: T) => M): DomainResult<M> {
    if (this.failed) {
      return DomainResult.getFailed(this.failed);
    }
    return DomainResult.getSucceeded(callbackfn(this.succeeded!));
  }
}
