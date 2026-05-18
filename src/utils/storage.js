const PREFIX = 'nexusiq';

export const storageKey = (tenantId, key) => `${PREFIX}:${tenantId}:${key}`;

export const getItem = (tenantId, key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(storageKey(tenantId, key));
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setItem = (tenantId, key, value) => {
  localStorage.setItem(storageKey(tenantId, key), JSON.stringify(value));
};

export const removeItem = (tenantId, key) => {
  localStorage.removeItem(storageKey(tenantId, key));
};

export const getGlobal = (key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(`${PREFIX}:${key}`);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setGlobal = (key, value) => {
  localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value));
};

export const getCompanies = () => getGlobal('companies', []);
export const setCompanies = (companies) => setGlobal('companies', companies);
