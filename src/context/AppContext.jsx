import React, { createContext, useState, useContext } from 'react';

// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [floorPosition, setFloorPosition] = useState([0, -0.3, 0]); // Default floor position
  const [floorBounds, setFloorBounds] = useState({}); // New state for the floor bounds

  return (
    <AppContext.Provider value={{ floorPosition, setFloorPosition, floorBounds, setFloorBounds }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContext;
