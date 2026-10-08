const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"
).replace(/\/$/, "");
const TOKEN_KEY = "ems_token";

// NOTE: localStorage is simple but readable by scripts. If Frontend 1 / Backend 1
// move the token to an httpOnly cookie, only this file needs to change.
export const tokenStore = {
  get: (): string | null =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export interface FieldError {
  field: string;
  message: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiRequestError extends Error {
  status: number;
  errors: FieldError[];

  constructor(status: number, message: string, errors: FieldError[] = []) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

export interface ApiResult<T> {
  data: T;
  meta?: PageMeta;
}

type Options = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Do not redirect to /unauthorized on 401 (used for login and /auth/me). */
  skipAuthRedirect?: boolean;
};

export async function apiClient<T = unknown>(
  path: string,
  options: Options = {},
): Promise<ApiResult<T>> {
  const { body, skipAuthRedirect, headers, ...rest } = options;
  const token = tokenStore.get();

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string> | undefined),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError(0, "Cannot reach the server. Please try again.");
  }

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    // 401: not authenticated -> clear token and send to the login/unauthorized page
    if (res.status === 401 && !skipAuthRedirect) {
      tokenStore.clear();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/unauthorized"
      ) {
        window.location.replace("/unauthorized");
      }
    }
    throw new ApiRequestError(
      res.status,
      payload.message ?? "Request failed",
      payload.errors ?? [],
    );
  }

  return { data: payload.data as T, meta: payload.meta };
}

/** Safe, user-facing message for any error. 403 never exposes backend details. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) {
    if (err.status === 403)
      return "You do not have permission to perform this action.";
    if (err.status === 401)
      return "Your session has expired. Please sign in again.";
    if (err.status >= 500)
      return "Something went wrong on the server. Please try again later.";
    return err.message;
  }
  return "Something went wrong. Please try again.";
}
