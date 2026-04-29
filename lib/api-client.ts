type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
};

/**
 * Make authenticated API request with automatic token refresh
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
  } = options;

  try {
    // Get access token from localStorage
    const accessToken = typeof window !== 'undefined' 
      ? localStorage.getItem('accessToken')
      : null;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    // Make request
    const response = await fetch(endpoint, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      // If token expired, try to refresh
      if (response.status === 401 && accessToken) {
        const refreshResponse = await fetch('/api/auth/refresh-token', {
          method: 'POST',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('accessToken', refreshData.accessToken);

          // Retry original request with new token
          requestHeaders['Authorization'] = `Bearer ${refreshData.accessToken}`;
          const retryResponse = await fetch(endpoint, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
          });

          const retryData = await retryResponse.json();

          return {
            success: retryResponse.ok,
            data: retryResponse.ok ? retryData : undefined,
            error: !retryResponse.ok ? retryData.error : undefined,
            status: retryResponse.status,
          };
        }
      }

      return {
        success: false,
        error: data.error || 'Request failed',
        status: response.status,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

/**
 * Get request
 */
export function apiGet<T = any>(endpoint: string, headers?: Record<string, string>) {
  return apiCall<T>(endpoint, { method: 'GET', headers });
}

/**
 * Post request
 */
export function apiPost<T = any>(
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
) {
  return apiCall<T>(endpoint, { method: 'POST', body, headers });
}

/**
 * Put request
 */
export function apiPut<T = any>(
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
) {
  return apiCall<T>(endpoint, { method: 'PUT', body, headers });
}

/**
 * Patch request
 */
export function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
) {
  return apiCall<T>(endpoint, { method: 'PATCH', body, headers });
}

/**
 * Delete request
 */
export function apiDelete<T = any>(endpoint: string, headers?: Record<string, string>) {
  return apiCall<T>(endpoint, { method: 'DELETE', headers });
}
