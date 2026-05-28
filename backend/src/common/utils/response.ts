// Location: backend/src/common/utils/response.ts
// Purpose: Utility functions to create consistent API response objects.
//          All controllers should return these shapes for a uniform API.

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Create a success response envelope.
 */
export function successResponse<T>(
  data: T,
  message = 'Request successful',
): ApiResponse<T> {
  return { success: true, message, data };
}

/**
 * Create an error response envelope.
 */
export function errorResponse(
  message: string,
  error?: string,
): ApiResponse<null> {
  return { success: false, message, error };
}
