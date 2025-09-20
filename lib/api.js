const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.monoexconsulting.kz' 
  : '/api/proxy';

// Функция для получения credentials из localStorage
const getAuthCredentials = () => {
  if (typeof window === 'undefined') {
    return AUTH_CREDENTIALS;
  }
  
  try {
    const savedCredentials = localStorage.getItem('authCredentials');
    if (savedCredentials) {
      return JSON.parse(savedCredentials);
    }
  } catch (err) {
    console.error('Error reading auth credentials from localStorage:', err);
  }
  
  return AUTH_CREDENTIALS;
};

// Обновляем функцию кодирования
const encodeCredentials = () => {
  const credentials = getAuthCredentials();
  if (typeof window === 'undefined') {
    return Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
  } else {
    return btoa(`${credentials.username}:${credentials.password}`);
  }
};

// Общая функция для выполнения запросов
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const authHeader = `Basic ${encodeCredentials()}`;
  
  // Для FormData не устанавливаем Content-Type
  const isFormData = options.body instanceof FormData;
  const headers = isFormData 
    ? { 'Authorization': authHeader, ...options.headers }
    : { 
        'Authorization': authHeader, 
        'Content-Type': 'application/json', 
        ...options.headers 
      };

  const config = {
    headers,
    ...options,
    cache: 'no-store',
  };

  // Для методов, которые могут иметь тело, преобразуем его в JSON (кроме FormData)
  if (config.body && typeof config.body === 'object' && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    if (config.method === 'DELETE' && response.status === 204) {
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Функции для работы с Legislation
export const legislationAPI = {
  create: (formData) => apiRequest('/legislations', {
    method: 'POST',
    body: formData,
  }),
  
  getAll: (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/legislations${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/legislations/${id}`),
  
  update: (id, data) => apiRequest(`/legislations/${id}`, {
    method: 'PUT', // Меняем PATCH на PUT
    body: data, // Теперь отправляем JSON, а не FormData
  }),
  
  delete: (id) => apiRequest(`/legislations/${id}`, {
    method: 'DELETE',
  }),
};

// Функции для работы с News
export const newsAPI = {
  create: (formData) => apiRequest('/news', {
    method: 'POST',
    body: formData,
  }),
  
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/news${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/news/${id}`),
  
  getByLink: (link) => apiRequest(`/news/by-link/${link}`),
  
  update: (id, data) => apiRequest(`/news/${id}`, {
    method: 'PUT', // Меняем PATCH на PUT
    body: data, // Отправляем JSON
  }),
  
  delete: (id) => apiRequest(`/news/${id}`, {
    method: 'DELETE',
  }),
  
  publish: (id) => apiRequest(`/news/${id}/publish`, {
    method: 'POST',
  }),
  
  unpublish: (id) => apiRequest(`/news/${id}/unpublish`, {
    method: 'POST',
  }),
  
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/files/news-image', {
      method: 'POST',
      body: formData,
    });
  },
};

// Функции для работы с Review
export const reviewAPI = {
  create: (data) => apiRequest('/reviews', {
    method: 'POST',
    body: data,
  }),
  
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reviews${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/reviews/${id}`),
  
  update: (id, data) => apiRequest(`/reviews/${id}`, {
    method: 'PATCH',
    body: data,
  }),
  
  delete: (id) => apiRequest(`/reviews/${id}`, {
    method: 'DELETE',
  }),
  
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/files/reviews', {
      method: 'POST',
      body: formData,
    });
  },
};

export default API_BASE_URL;