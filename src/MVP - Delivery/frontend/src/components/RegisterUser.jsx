// Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';              
import styles from './css/registerUser.module.css';
import logo from './img/logo.png';

async function registerUserApi(formData) {
  const response = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return response.json();
}

const opcoesAlimentos = [
  'Sem glúten', 'Vegetariano', 'Vegano', 'Low Carb',
  'Sem lactose', 'Sem amendoim', 'Sem ovos', 'Sem nozes', 'Sem peixes e frutos do mar'
];

function maskPhone(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    preferencias: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validar = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.email.includes('@')) newErrors.email = 'Informe um email válido.';
    if (formData.password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres.';
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) newErrors.phone = 'Telefone inválido.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: maskPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePreferencia = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      preferencias: checked
        ? [...prev.preferencias, value]
        : prev.preferencias.filter((p) => p !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validar();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor, corrija os erros do formulário.');
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const result = await registerUserApi(formData);
      if (result.token) {
        toast.success('Cadastro realizado com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(result.error || 'Erro ao cadastrar usuário.');
      }
    } catch {
      toast.error('Erro ao conectar com o servidor.');
    }
    setLoading(false);
  };

  return (
    <div className={styles['register-container']}>
      <ToastContainer position="top-right" autoClose={3000} />
      <img src={logo} alt="Logo NutriFood" className={styles['register-logo']} />
      <h2 className={styles['register-title']}>Cadastro de Usuário</h2>

      <form onSubmit={handleSubmit} className={styles['register-form']}>
        <label className={styles['register-label']}>
          Nome:
          <input
            type="text"
            name="name"
            placeholder="Ex: João da Silva"
            value={formData.name}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
          />
          {errors.name && <span className={styles['register-error']}>{errors.name}</span>}
        </label>

        <label className={styles['register-label']}>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Ex: joao@email.com"
            value={formData.email}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
          />
          {errors.email && <span className={styles['register-error']}>{errors.email}</span>}
        </label>

        <label className={styles['register-label']}>
          Senha:
          <input
            type="password"
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
          />
          {errors.password && <span className={styles['register-error']}>{errors.password}</span>}
        </label>

        <label className={styles['register-label']}>
          Telefone:
          <input
            type="text"
            name="phone"
            placeholder="(99) 99999-9999"
            value={formData.phone}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
          />
          {errors.phone && <span className={styles['register-error']}>{errors.phone}</span>}
        </label>

        <fieldset className={styles['register-fieldset']}>
          <legend className={styles['register-legend']}>Preferências Alimentares (opcional)</legend>
          <small>Você pode escolher agora ou adicionar depois nas configurações.</small>
          <div className={styles['register-checkbox-group']}>
            {opcoesAlimentos.map((opcao) => (
              <label key={opcao} className={styles['register-checkbox-label']}>
                <input
                  type="checkbox"
                  value={opcao}
                  checked={formData.preferencias.includes(opcao)}
                  onChange={handlePreferencia}
                  className={styles['register-checkbox']}
                  disabled={loading}
                />
                <span>{opcao}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles['register-buttons']}>
          <button type="submit" className={styles['register-button-primary']} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={styles['register-button-secondary']}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
