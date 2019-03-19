import { APIError } from '@infrastructure/repository/bitflyer/api/types/apiError';

/**
 * DomainError は domain のエラーを表す。
 */
export interface DomainError {
  /**  apiError は API のエラーを表す。 */
  apiError: APIError;
}
