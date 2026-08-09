/**
 * Registrations API Client
 */

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
    throw new Error(data.error || 'Failed to execute registration request.');
  }

  return data;
};

/**
 * Register for an event
 */
export const registerForEvent = async (eventId, token) => {
  return await apiRequest('/registrations', 'POST', { event_id: eventId }, token);
};

/**
 * Cancel a registration
 */
export const cancelRegistration = async (registrationId, token) => {
  return await apiRequest(`/registrations/${registrationId}/cancel`, 'PUT', null, token);
};

/**
 * Get all registrations for current logged-in user
 */
export const fetchMyRegistrations = async (token) => {
  return await apiRequest('/registrations/my', 'GET', null, token);
};

/**
 * Get past registrations history for current logged-in user
 */
export const fetchMyHistory = async (token) => {
  return await apiRequest('/registrations/my/history', 'GET', null, token);
};
