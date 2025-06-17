import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserTokenState] = useState(localStorage.getItem('userToken') || null);
  const [restaurantToken, setRestaurantTokenState] = useState(localStorage.getItem('restaurantToken') || null);

  useEffect(() => {
    if (userToken) {
      api.defaults.headers.common['User-Authorization'] = `Bearer ${userToken}`;
    } else {
      delete api.defaults.headers.common['User-Authorization'];
    }

    if (restaurantToken) {
      api.defaults.headers.common['Restaurant-Authorization'] = `Bearer ${restaurantToken}`;
    } else {
      delete api.defaults.headers.common['Restaurant-Authorization'];
    }
  }, [userToken, restaurantToken]);

  const setUserToken = (token) => {
    setUserTokenState(token);
    localStorage.setItem('userToken', token);
  };

  const setRestaurantToken = (token) => {
    setRestaurantTokenState(token);
    localStorage.setItem('restaurantToken', token);
  };

  const logout = () => {
    setUserTokenState(null);
    setRestaurantTokenState(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('restaurantToken');
    delete api.defaults.headers.common['User-Authorization'];
    delete api.defaults.headers.common['Restaurant-Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        restaurantToken,
        setUserToken,
        setRestaurantToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
