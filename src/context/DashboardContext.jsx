import React, { createContext, useContext } from 'react';
import { useISSData } from '../hooks/useISSData';
import { useNewsData } from '../hooks/useNewsData';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const issData = useISSData();
  const newsData = useNewsData();

  return (
    <DashboardContext.Provider value={{ issData, newsData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardData = () => useContext(DashboardContext);
