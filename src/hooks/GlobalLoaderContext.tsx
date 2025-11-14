import React, { createContext, useContext, useState, ReactNode } from 'react';

type GlobalLoaderContextType = {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(
  undefined,
);

export const useGlobalLoader = (): GlobalLoaderContextType => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error(
      'useGlobalLoader must be used within a GlobalLoaderProvider',
    );
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const GlobalLoaderProvider: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <GlobalLoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </GlobalLoaderContext.Provider>
  );
};
