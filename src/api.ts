import type {
  AuthState,
  CertificateData,
  EngineerFormData,
  EngineerProfile,
  SavedCertificate,
} from './types'

const API_BASE = '/api'
const TOKEN_KEY = 'gas_cert_token'
const REQUEST_TIMEOUT_MS = 10000

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Server not responding. Run: npm run dev (and start MongoDB).')
    }
    throw new Error('Cannot connect to backend. Run: npm run dev')
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const error = new Error(body.error ?? `Request failed (${response.status})`) as Error & {
      code?: string
      userId?: string
    }
    error.code = body.code
    error.userId = body.userId
    throw error
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const api = {
  healthCheck: () =>
    request<{ ok: boolean; db: boolean; message: string }>('/health'),

  getAdminStatus: () =>
    request<{ username: string; pinSet: boolean }>('/auth/admin/status'),

  setAdminPin: (pin: string, confirmPin: string) =>
    request<{ token: string; role: 'admin'; username: string }>('/auth/admin/set-pin', {
      method: 'POST',
      body: JSON.stringify({ pin, confirmPin }),
    }),

  adminLogin: (pin: string) =>
    request<{ token: string; role: 'admin'; username: string }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    }),

  checkEngineerUser: (userId: string) =>
    request<{ userId: string; pinSet: boolean }>('/auth/engineer/check-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  setEngineerPin: (userId: string, pin: string, confirmPin: string) =>
    request<AuthState & { token: string }>('/auth/engineer/set-pin', {
      method: 'POST',
      body: JSON.stringify({ userId, pin, confirmPin }),
    }),

  engineerLogin: (userId: string, pin: string) =>
    request<AuthState & { token: string }>('/auth/engineer/login', {
      method: 'POST',
      body: JSON.stringify({ userId, pin }),
    }),

  getMe: () => request<AuthState>('/auth/me'),

  getEngineerProfile: () => request<EngineerProfile>('/engineer/profile'),

  updateEngineerProfile: (data: EngineerFormData) =>
    request<EngineerProfile>('/engineer/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getCertificates: () => request<SavedCertificate[]>('/certificates'),

  getCertificate: (id: string) => request<SavedCertificate>(`/certificates/${id}`),

  saveCertificate: (certificateRef: string, data: CertificateData) =>
    request<SavedCertificate>('/certificates', {
      method: 'POST',
      body: JSON.stringify({ certificateRef, data }),
    }),

  updateCertificate: (id: string, certificateRef: string, data: CertificateData) =>
    request<SavedCertificate>(`/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ certificateRef, data }),
    }),

  deleteCertificate: (id: string) =>
    request<void>(`/certificates/${id}`, { method: 'DELETE' }),

  adminGetEngineers: () => request<EngineerProfile[]>('/admin/engineers'),

  adminCheckUserId: (userId: string) =>
    request<{ userId: string; available: boolean; error: string | null }>(
      `/admin/engineers/check/${encodeURIComponent(userId)}`,
    ),

  adminCreateEngineer: (data: { userId: string }) =>
    request<EngineerProfile>('/admin/engineers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  adminDeleteEngineer: (id: string) =>
    request<void>(`/admin/engineers/${id}`, { method: 'DELETE' }),
}
