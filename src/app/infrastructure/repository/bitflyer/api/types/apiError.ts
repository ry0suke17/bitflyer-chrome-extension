/**
 * APIError は API のエラーを表す。
 */
export interface APIError {
  /** status はステータスコードを表す。 */
  status: number;
  /** error_message はエラーメッセージを表す。 */
  error_message: string;
  /** data はデータを表す。実際試してみて null 以外が入ってきたことがないのでとりあえず string にしている。 */
  data: string | null;
}

/**
 * message は利用者にわかりやすいエラーメッセージを返す。
 * @param apiError API のエラーを表す。
 */
export function errorMessage(apiError: APIError) {
  switch (apiError.status) {
    case -106:
      // 高すぎたり、低すぎたり、必須なのに指定されていない場合に発生する。
      return '無効な注文価格が指定されています。';
    case -125:
      return '無効なオフセット、トリガー価格が指定されています。';
    default:
      return `status: ${apiError.status}, message: ${apiError.error_message}`;
  }
}
