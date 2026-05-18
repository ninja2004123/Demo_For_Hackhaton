import { createContext, useContext, useState, useEffect } from 'react';
import { getGlobal, setGlobal } from '../utils/storage.js';
import { ensureCompanies } from '../utils/seedData.js';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [currentTenant, setCurrentTenant] = useState(null);

  useEffect(() => {
    ensureCompanies();
    setCompanies(getGlobal('companies', []));
  }, []);

  const selectTenant = (company) => {
    setCurrentTenant(company);
  };

  const addCompany = (company) => {
    const updated = [...companies, company];
    setGlobal('companies', updated);
    setCompanies(updated);
  };

  return (
    <TenantContext.Provider value={{ companies, currentTenant, selectTenant, addCompany }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used inside TenantProvider');
  return ctx;
};
