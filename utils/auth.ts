// Magic Link Authentication Handler
// Exchanges a magic link token for a JWT using backend verification endpoint.
// Example: http://localhost:5173/#/patient-auth?token=magic_link_token

export interface JWTPayload {
  sub: string;        // User ID
  name?: string;      // User's name
  email?: string;     // User's email
  exp: number;        // Expiration timestamp
  iat: number;        // Issued at timestamp
  iss?: string;       // Issuer
  provider_id?: string; // Healthcare provider ID
  patient_id?: string;  // Patient ID in provider's system
}

export interface AuthSession {
  token: string;
  payload: JWTPayload;
  user?: VerifyLinkUser;
  patient?: VerifyLinkPatient;
  tokenType?: string;
  isValid: boolean;
  expiresAt: Date;
}

export interface VerifyLinkUser {
  id: string;
  email: string;
  is_doctor: boolean;
  is_active: boolean;
}

export interface VerifyLinkPatient {
  id: string;
  full_name: string;
}

interface VerifyLinkResponse {
  accessToken?: string;
  access_token?: string;
  token_type?: string;
  token?: string;
  jwt?: string;
  user?: VerifyLinkUser;
  patient?: VerifyLinkPatient;
  data?: {
    accessToken?: string;
    access_token?: string;
    token?: string;
    jwt?: string;
    token_type?: string;
    user?: VerifyLinkUser;
    patient?: VerifyLinkPatient;
  };
}

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const API_BASE_URL = viteEnv?.VITE_API_BASE_URL || 'https://chromapilot.onrender.com';
const STORAGE_SESSION_KEY = 'chromapilot_session';
const STORAGE_ACCESS_TOKEN_KEY = 'chromapilot_access_token';
const STORAGE_USER_KEY = 'chromapilot_user';
const STORAGE_PATIENT_KEY = 'chromapilot_patient';
const STORAGE_TOKEN_TYPE_KEY = 'chromapilot_token_type';
const STORAGE_AUTH_ERROR_KEY = 'chromapilot_auth_error';

// Temporary prototype mode: bypass live verify endpoint and use a stable test identity.
const MOCK_AUTH_ENABLED = (viteEnv?.VITE_MOCK_AUTH ?? 'true') !== 'false';

const setAuthError = (message: string): void => {
  localStorage.setItem(STORAGE_AUTH_ERROR_KEY, message);
};

export const getAuthError = (): string | null => {
  return localStorage.getItem(STORAGE_AUTH_ERROR_KEY);
};

export const clearAuthError = (): void => {
  localStorage.removeItem(STORAGE_AUTH_ERROR_KEY);
};

// Parse JWT without verification (client-side only)
// Note: Real verification should happen on the server
const parseJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Decode the payload (base64url)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (payload: JWTPayload): boolean => {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

// Extract token from URL query string
export const extractTokenFromURL = (): string | null => {
  // Check both hash and search params for token
  const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const searchParams = new URLSearchParams(window.location.search);

  return hashParams.get('token') || searchParams.get('token') || null;
};

const extractJWTFromVerifyResponse = (payload: VerifyLinkResponse): string | null => {
  return (
    payload.accessToken ||
    payload.access_token ||
    payload.token ||
    payload.jwt ||
    payload.data?.accessToken ||
    payload.data?.access_token ||
    payload.data?.token ||
    payload.data?.jwt ||
    null
  );
};

const extractTokenTypeFromVerifyResponse = (payload: VerifyLinkResponse): string => {
  return payload.token_type || payload.data?.token_type || 'bearer';
};

const extractUserFromVerifyResponse = (payload: VerifyLinkResponse): VerifyLinkUser | undefined => {
  return payload.user || payload.data?.user;
};

const extractPatientFromVerifyResponse = (payload: VerifyLinkResponse): VerifyLinkPatient | undefined => {
  return payload.patient || payload.data?.patient;
};

interface VerifyExchangeResult {
  accessToken: string;
  tokenType: string;
  user?: VerifyLinkUser;
  patient?: VerifyLinkPatient;
}

const persistSession = (session: AuthSession): void => {
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, session.token);
  localStorage.setItem(STORAGE_TOKEN_TYPE_KEY, session.tokenType || 'bearer');
  if (session.user) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(session.user));
  }
  if (session.patient) {
    localStorage.setItem(STORAGE_PATIENT_KEY, JSON.stringify(session.patient));
  }
};

const buildMockSession = (): AuthSession => {
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: '720d47e7-4e10-4c2d-a0f8-6d6750d22cc8',
    name: 'Test Patient',
    email: 'patient_b8a6e2fc@chromapilot.com',
    patient_id: 'b8a6e2fc-c674-4104-bf38-6e1fa8c00e93',
    iat: now,
    exp: now + 60 * 60 * 24 * 30,
    iss: 'chromapilot-mock',
  };

  return {
    token: 'mock-access-token',
    payload,
    user: {
      id: payload.sub,
      email: payload.email || 'patient_b8a6e2fc@chromapilot.com',
      is_doctor: false,
      is_active: true,
    },
    patient: {
      id: payload.patient_id || 'b8a6e2fc-c674-4104-bf38-6e1fa8c00e93',
      full_name: payload.name || 'Test Patient',
    },
    tokenType: 'bearer',
    isValid: true,
    expiresAt: new Date((now + 60 * 60 * 24 * 30) * 1000),
  };
};

export const ensureMockSession = (): AuthSession => {
  const current = getCurrentSession();
  if (current) return current;

  const mockSession = buildMockSession();
  persistSession(mockSession);
  clearAuthError();
  return mockSession;
};

const exchangeMagicLinkToken = async (token: string): Promise<VerifyExchangeResult | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-patient-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      let detail = '';
      try {
        const errorBody = (await response.json()) as { detail?: string };
        detail = errorBody?.detail || '';
      } catch {
        detail = '';
      }

      const message = detail || `Magic link verification failed (${response.status}).`;
      setAuthError(message);
      console.error(message);
      return null;
    }

    const body = (await response.json()) as VerifyLinkResponse;
    const accessToken = extractJWTFromVerifyResponse(body);

    if (!accessToken) {
      setAuthError('Verification succeeded but no access token was returned. Please request a new secure link.');
      console.error('Magic link verification succeeded but no access token was returned');
      return null;
    }

    return {
      accessToken,
      tokenType: extractTokenTypeFromVerifyResponse(body),
      user: extractUserFromVerifyResponse(body),
      patient: extractPatientFromVerifyResponse(body),
    };
  } catch (error) {
    setAuthError('Unable to verify link right now. Check your connection and try again.');
    console.error('Failed to verify magic link token:', error);
    return null;
  }
};

// Process magic link and create session
export const processMagicLink = async (): Promise<AuthSession | null> => {
  if (MOCK_AUTH_ENABLED) {
    return ensureMockSession();
  }

  const magicLinkToken = extractTokenFromURL();

  if (!magicLinkToken) {
    return null;
  }

  clearAuthError();

  console.log('🔗 Magic link detected, processing token...');

  const verifyResult = await exchangeMagicLinkToken(magicLinkToken);
  if (!verifyResult) {
    console.error('❌ Magic link verification failed');
    // Prevent repeated auto-verification attempts with an invalid/used token.
    cleanURL();
    return null;
  }

  const payload = parseJWT(verifyResult.accessToken);

  if (!payload) {
    setAuthError('Received an invalid access token from verification. Please request a new secure link.');
    console.error('❌ Invalid token in magic link');
    cleanURL();
    return null;
  }

  if (isTokenExpired(payload)) {
    setAuthError('This secure link has expired. Please request a fresh patient link.');
    console.error('⏰ Token has expired');
    cleanURL();
    return null;
  }

  if (!payload.name && verifyResult.patient?.full_name) {
    payload.name = verifyResult.patient.full_name;
  }

  if (!payload.patient_id && verifyResult.patient?.id) {
    payload.patient_id = verifyResult.patient.id;
  }

  const session: AuthSession = {
    token: verifyResult.accessToken,
    payload,
    user: verifyResult.user,
    patient: verifyResult.patient,
    tokenType: verifyResult.tokenType,
    isValid: true,
    expiresAt: new Date(payload.exp * 1000),
  };

  // Store auth data in localStorage for persistence
  persistSession(session);

  // Clean the URL (remove token from visible URL)
  cleanURL();

  console.log('✅ Magic link authenticated successfully');
  console.log('👤 User:', payload.name || payload.sub);
  console.log('⏰ Session expires:', session.expiresAt.toLocaleString());

  return session;
};

// Clean the URL by removing the token parameter
const cleanURL = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('token');

  // Handle hash-based routing
  if (window.location.hash.includes('token=')) {
    const hashParts = window.location.hash.split('?');
    const hashPath = hashParts[0];
    const hashParams = new URLSearchParams(hashParts[1] || '');
    hashParams.delete('token');

    const newHash = hashParams.toString()
      ? `${hashPath}?${hashParams.toString()}`
      : hashPath;

    window.history.replaceState({}, '', `${url.pathname}${newHash}`);
  } else {
    window.history.replaceState({}, '', url.toString());
  }
};

// Get current session from localStorage
export const getCurrentSession = (): AuthSession | null => {
  try {
    const stored = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!stored) return null;

    const session: AuthSession = JSON.parse(stored);

    // Check if session is still valid
    if (new Date(session.expiresAt) < new Date()) {
      console.log('⏰ Stored session has expired');
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
};

// Clear the current session
export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_SESSION_KEY);
  localStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY);
  localStorage.removeItem(STORAGE_TOKEN_TYPE_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(STORAGE_PATIENT_KEY);
  console.log('🔒 Session cleared');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const session = getCurrentSession();
  return session !== null && session.isValid;
};

// Get user ID from session
export const getUserId = (): string | null => {
  const session = getCurrentSession();
  return session?.payload.sub || null;
};

export const getPatientId = (): string | null => {
  const session = getCurrentSession();
  return session?.patient?.id || session?.payload.patient_id || null;
};

export const getAccessToken = (): string | null => {
  const stored = localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY);
  if (stored) return stored;

  const session = getCurrentSession();
  return session?.token || null;
};

export const getTokenType = (): string => {
  const stored = localStorage.getItem(STORAGE_TOKEN_TYPE_KEY);
  if (stored) return stored;

  const session = getCurrentSession();
  return session?.tokenType || 'bearer';
};

export const getAuthorizationHeader = (): Record<string, string> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('Missing access token for authenticated API request.');
  }

  const tokenType = getTokenType();
  const scheme = tokenType.toLowerCase() === 'bearer' ? 'Bearer' : tokenType;
  return { Authorization: `${scheme} ${accessToken}` };
};

// Get user name from session
export const getUserName = (): string | null => {
  const session = getCurrentSession();
  return session?.patient?.full_name || session?.payload.name || null;
};

// Initialize authentication on app load
export const initAuth = async (): Promise<AuthSession | null> => {
  if (MOCK_AUTH_ENABLED) {
    return ensureMockSession();
  }

  // First check for magic link
  const magicLinkSession = await processMagicLink();
  if (magicLinkSession) {
    return magicLinkSession;
  }

  // Otherwise, check for existing session
  return getCurrentSession();
};
