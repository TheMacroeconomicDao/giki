/**
 * API для аутентификации (FSD)
 */
import {
  login,
  refreshTokenHandler,
  verify,
  me,
  logout
} from './handlers';
import type {
  AuthSignatureData,
  VerifyTokenData,
  CurrentUserData,
  AuthResponse,
  MeResponse,
  RefreshTokenData
} from './types';

export {
  // Обработчики
  login,
  refreshTokenHandler,
  verify,
  me,
  logout,
  
  // Типы
  type AuthSignatureData,
  type VerifyTokenData,
  type CurrentUserData,
  type AuthResponse,
  type MeResponse,
  type RefreshTokenData
}; 