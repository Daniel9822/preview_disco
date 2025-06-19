/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T> {
  data: T | null;
  error: boolean;
  message: string;
}

export interface ApiRequest {
  <T>(url: string, options?: RequestInit, loadingToastId?: any): Promise<ApiResponse<T>>;
}