import {
  ConditionType,
  Side,
} from '@infrastructure/repository/bitflyer/api/types/api';

/** sideKey はオーダータイプのキーを表す。 */
const sideKey = 'BITFLYER_SIDE';

/** conditionTypeKey は注文執行条件のキーを表す。 */
const conditionTypeKey = 'BITFLYER_CONDITION_TYPE';

/** sizeKey は数量のキーを表す。 */
const sizeKey = 'BITFLYER_SIZE';

/**
 * ChromeStorage はクロームのストレージを扱うクラスを表す。。
 */
export default class ChromeStorage {
  /**
   * setSide はオーダータイプをセットする。
   * @param side オーダーのタイプを表す。
   */
  public static setSide(side: Side): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.sync.set({ [sideKey]: side }, () => resolve());
    });
  }

  /**
   * getSide はオーダーのタイプを取得する。。
   */
  public static getSide(): Promise<Side | null> {
    return new Promise(resolve => {
      chrome.storage.sync.get(sideKey, items =>
        resolve(items[sideKey] ? items[sideKey] : null),
      );
    });
  }

  /**
   * setConditionType はオーダータイプをセットする。
   * @param conditionType 執行条件のタイプを表す。
   */
  public static setConditionType(conditionType: ConditionType): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.sync.set({ [conditionTypeKey]: conditionType }, () =>
        resolve(),
      );
    });
  }

  /**
   * getConditionType はオーダータイプを取得する。。
   */
  public static getConditionType(): Promise<ConditionType | null> {
    return new Promise(resolve => {
      chrome.storage.sync.get(conditionTypeKey, items =>
        resolve(items[conditionTypeKey] ? items[conditionTypeKey] : null),
      );
    });
  }

  /**
   * setSize は数量をセットする。
   * @param size 数量を表す。
   */
  public static setSize(size: string): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.sync.set({ [sizeKey]: size }, () => resolve());
    });
  }

  /**
   * getSize は数量を取得する。。
   */
  public static getSize(): Promise<string | null> {
    return new Promise(resolve => {
      chrome.storage.sync.get(sizeKey, items =>
        resolve(items[sizeKey] ? items[sizeKey] : null),
      );
    });
  }
}
