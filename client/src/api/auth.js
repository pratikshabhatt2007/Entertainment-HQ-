/**
 * Auth API Client
 */

// Helper to make API requests
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred during authentication request.');
  }

  return data;
};

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  return await apiRequest('/auth/register', 'POST', userData);
};

/**
 * Login user
 */
export const loginUser = async (credentials) => {
  return await apiRequest('/auth/login', 'POST', credentials);
};

/**
 * Instant Passwordless Login for any Email
 */
export const instantLoginUser = async (email) => {
  return await apiRequest('/auth/instant-login', 'POST', { email });
};

/**
 * Get current authenticated user profile
 */
export const fetchMe = async (token) => {
  return await apiRequest('/auth/me', 'GET', null, token);
};

/**
 * Update user profile (Name)
 */
export const updateUserProfile = async (name, token) => {
  return await apiRequest('/auth/profile', 'PUT', { name }, token);
};
