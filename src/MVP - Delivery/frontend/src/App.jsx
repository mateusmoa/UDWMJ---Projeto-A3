import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { validateToken } from './utils/validateToken';
import AppRoutes from './routes/Routes';

function AppContent() {
  const { userToken, restaurantToken, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Verificando tokens:', { userToken, restaurantToken });

      let userValid = true;
      let restaurantValid = true;

      if (userToken) {
        userValid = await validateToken(userToken, 'user');
        console.log('Token de usuário válido?', userValid);
      }

      if (restaurantToken) {
        restaurantValid = await validateToken(restaurantToken, 'restaurant');
        console.log('Token de restaurante válido?', restaurantValid);
      }

      if (!userValid || !restaurantValid) {
        logout();
      }

      setLoading(false);
    };

    checkAuth();
  }, [userToken, restaurantToken, logout]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
