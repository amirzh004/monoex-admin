const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.monoexconsulting.kz'
    : '/proxy';

const getAuthCredentials = () => {
    if (typeof window === 'undefined') {
        return { username: 'admin', password: 'password' };
    }
    try {
        const savedCredentials = localStorage.getItem('authCredentials');
        if (savedCredentials) return JSON.parse(savedCredentials);
    } catch (err) {
        console.error('Error reading auth credentials from localStorage:', err);
    }
    return { username: 'admin', password: 'password' };
};

const encodeCredentials = () => {
    const { username, password } = getAuthCredentials();
    if (typeof window === 'undefined') {
        return Buffer.from(`${username}:${password}`).toString('base64');
    }
    return btoa(`${username}:${password}`);
};

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const authHeader = `Basic ${encodeCredentials()}`;
    const isFormData = options.body instanceof FormData;

    const headers = isFormData
        ? { Authorization: authHeader, ...options.headers }
        : { Authorization: authHeader, 'Content-Type': 'application/json', ...options.headers };

    const config = {
        ...options,
        headers,
        cache: 'no-store',
    };

    if (config.body && typeof config.body === 'object' && !isFormData) {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/json') ? response.json() : response.text();
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function uploadFile(endpoint, file) {
    const formData = new FormData();
    formData.append('file', file);
    const result = await apiRequest(endpoint, { method: 'POST', body: formData });
    return result.url; // "/uploads/..."
}

// ─── Legislation ─────────────────────────────────────────────────────────────

export const legislationAPI = {
    getAll: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiRequest(`/legislations${qs ? `?${qs}` : ''}`);
    },

    getById: (id) => apiRequest(`/legislations/${id}`),

    // 1) загружаем PDF → 2) создаём запись с file_path
    create: async ({ title, description, file }) => {
        const file_path = await uploadFile('/files/legislations', file);
        return apiRequest('/legislations', {
            method: 'POST',
            body: { title, description, file_path },
        });
    },

    // Обновление — только JSON (файл не меняется)
    update: (id, data) => apiRequest(`/legislations/${id}`, {
        method: 'PUT',
        body: data,
    }),

    delete: (id) => apiRequest(`/legislations/${id}`, { method: 'DELETE' }),

    downloadFile: (filePath) => {
        const fullUrl = filePath.startsWith('http')
            ? filePath
            : `${API_BASE_URL}${filePath.startsWith('/') ? filePath : '/' + filePath}`;
        return fetch(fullUrl, {
            headers: { Authorization: `Basic ${encodeCredentials()}` },
        });
    },
};

// ─── News ────────────────────────────────────────────────────────────────────

export const newsAPI = {
    getAll: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiRequest(`/news${qs ? `?${qs}` : ''}`);
    },

    getById: (id) => apiRequest(`/news/${id}`),
    getByLink: (link) => apiRequest(`/news/by-link/${link}`),

    // 1) загружаем изображение → 2) создаём новость с image_path
    create: async ({ title, description, full_text, status = 'not_published', imageFile }) => {
        const image_path = await uploadFile('/files/news-image', imageFile);

        // Генерируем slug из заголовка (только латиница/цифры/дефис)
        const link = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-') || `news-${Date.now()}`;

        return apiRequest('/news', {
            method: 'POST',
            body: { title, description, full_text, image_path, status, link },
        });
    },

    // Обновление — только JSON (изображение не меняется)
    update: (id, data) => apiRequest(`/news/${id}`, {
        method: 'PUT',
        body: data,
    }),

    delete: (id) => apiRequest(`/news/${id}`, { method: 'DELETE' }),

    publish: (id) => apiRequest(`/news/${id}/publish`, { method: 'POST' }),
    unpublish: (id) => apiRequest(`/news/${id}/unpublish`, { method: 'POST' }),
};

// ─── Review ──────────────────────────────────────────────────────────────────

export const reviewAPI = {
    getAll: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiRequest(`/reviews${qs ? `?${qs}` : ''}`);
    },

    getById: (id) => apiRequest(`/reviews/${id}`),

    // 1) загружаем PDF → 2) создаём отзыв с pdf_path
    create: async ({ company_name, service_type, description, file }) => {
        const pdf_path = await uploadFile('/files/reviews', file);
        return apiRequest('/reviews', {
            method: 'POST',
            body: { company_name, service_type, description, pdf_path },
        });
    },

    update: (id, data) => apiRequest(`/reviews/${id}`, {
        method: 'PATCH',
        body: data,
    }),

    delete: (id) => apiRequest(`/reviews/${id}`, { method: 'DELETE' }),
};

export default API_BASE_URL;