const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensagem || `Erro ${response.status}: Falha na requisição`);
  }

  return response.json();
}

export const api = {
  animais: {
    getAll: () => request('/animais'),
    create: (data) => request('/animais', { method: 'POST', body: data }),
    update: (id, data) => request(`/animais/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/animais/${id}`, { method: 'DELETE' })
  },
  funcionarios: {
    getAll: () => request('/funcionarios'),
    create: (data) => request('/funcionarios', { method: 'POST', body: data }),
    update: (id, data) => request(`/funcionarios/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/funcionarios/${id}`, { method: 'DELETE' })
  },
  maquinas: {
    getAll: () => request('/maquinarios'),
    create: (data) => request('/maquinarios', { method: 'POST', body: data }),
    update: (id, data) => request(`/maquinarios/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/maquinarios/${id}`, { method: 'DELETE' })
  },
  producoes: {
    getAll: () => request('/producoes'),
    create: (data) => request('/producoes', { method: 'POST', body: data }),
    update: (id, data) => request(`/producoes/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/producoes/${id}`, { method: 'DELETE' })
  },
  transacoes: {
    getAll: () => request('/transacoes'),
    create: (data) => request('/transacoes', { method: 'POST', body: data }),
    update: (id, data) => request(`/transacoes/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/transacoes/${id}`, { method: 'DELETE' })
  },
  dashboard: {
    getMetricas: () => request('/dashboard/metricas')
  },
  historico: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/historico${query ? `?${query}` : ''}`);
    },
    create: (data) => request('/historico', { method: 'POST', body: data }),
    delete: (id) => request(`/historico/${id}`, { method: 'DELETE' })
  },
  fazendas: {
    getAll: () => request('/fazendas'),
    getById: (id) => request(`/fazendas/${id}`),
    create: (data) => request('/fazendas', { method: 'POST', body: data }),
    update: (id, data) => request(`/fazendas/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/fazendas/${id}`, { method: 'DELETE' })
  },
  produtores: {
    getAll: () => request('/produtores'),
    getById: (id) => request(`/produtores/${id}`),
    create: (data) => request('/produtores', { method: 'POST', body: data }),
    update: (id, data) => request(`/produtores/${id}`, { method: 'PUT', body: data })
  },
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
    register: (userData) => request('/auth/register', { method: 'POST', body: userData })
  }
};
