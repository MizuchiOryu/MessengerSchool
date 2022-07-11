import React, { useContext } from 'react';

const EnvContext = React.createContext();

export function useEnv() {
  return useContext(EnvContext);
}

export function EnvProvider({ children }) {
  return (
    <EnvContext.Provider value={import.meta.env}>
      {children}
    </EnvContext.Provider>
  );
}
