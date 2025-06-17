import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import styles from './css/login.module.css';
import logo from './img/logo.png';

async function loginUser(email, password) {
  const response = await api.post('/users/login', { email, password });
  return response.data;
}

async function loginRestaurant(email, password) {
  const response = await api.post('/restaurants/login', { email, password });
  return response.data;
}

function Login() {
  const { setUserToken, setRestaurantToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRestaurantLogin, setIsRestaurantLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Tentando login...', { email, isRestaurantLogin });

      let result;
      if (isRestaurantLogin) {
        result = await loginRestaurant(email, password);
      } else {
        result = await loginUser(email, password);
      }

      console.log('Resultado do login:', result);

      if (result && !result.error) {
        if (isRestaurantLogin) {
          if (result.token) {
            setRestaurantToken(result.token);
            console.log('Token restaurante salvo.');
          }
          navigate('/home-restaurant');
        } else {
          if (result.token) {
            setUserToken(result.token);
            console.log('Token usuário salvo.');
          }
          navigate('/home-user');
        }
      } else {
        const msg = result?.error || 'Falha no login.';
        console.log('Erro no login:', msg);
        setError(msg);
      }
    } catch (err) {
      console.error('Erro catch no login:', err);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['login-container']}>
      <img src={logo} alt="Logo NutriFood" className={styles['login-logo']} />
      <h2>{isRestaurantLogin ? 'Login Restaurante' : 'Login Usuário'}</h2>
      <form onSubmit={handleLogin} className={styles['login-form']}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles['login-input']}
            disabled={loading}
            required
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles['login-input']}
            disabled={loading}
            required
          />
        </label>

        {error && <div className={styles['login-error']}>{error}</div>}

        <button type="submit" className={styles['login-button']} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className={styles['login-button-secondary']}
          disabled={loading}
        >
          Criar Conta
        </button>
        <button
          type="button"
          onClick={() => setIsRestaurantLogin(!isRestaurantLogin)}
          className={styles['login-button-toggle']}
          disabled={loading}
        >
          {isRestaurantLogin ? 'Entrar como Usuário' : 'Entrar como Restaurante'}
        </button>
      </form>
    </div>
  );
}

export default Login;
