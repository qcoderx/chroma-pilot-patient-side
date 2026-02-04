// Magic Link Authentication Handler
// Parses JWT from URL query string for instant session creation
// Example: chromapilot.app/connect?token=eyJhbGciOiJIUzI1NiIs...

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
  isValid: boolean;
  expiresAt: Date;
}

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

// Process magic link and create session
export const processMagicLink = (): AuthSession | null => {
  const token = extractTokenFromURL();

  if (!token) {
    return null;
  }

  console.log('🔗 Magic link detected, processing token...');

  const payload = parseJWT(token);

  if (!payload) {
    console.error('❌ Invalid token in magic link');
    return null;
  }

  if (isTokenExpired(payload)) {
    console.error('⏰ Token has expired');
    return null;
  }

  const session: AuthSession = {
    token,
    payload,
    isValid: true,
    expiresAt: new Date(payload.exp * 1000),
  };

  // Store session in localStorage for persistence
  localStorage.setItem('chromapilot_session', JSON.stringify(session));

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
    const stored = localStorage.getItem('chromapilot_session');
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
  localStorage.removeItem('chromapilot_session');
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

// Get user name from session
export const getUserName = (): string | null => {
  const session = getCurrentSession();
  return session?.payload.name || null;
};

// Initialize authentication on app load
export const initAuth = (): AuthSession | null => {
  // First check for magic link
  const magicLinkSession = processMagicLink();
  if (magicLinkSession) {
    return magicLinkSession;
  }

  // Otherwise, check for existing session
  return getCurrentSession();
};
