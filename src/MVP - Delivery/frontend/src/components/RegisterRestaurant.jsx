import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask-next';
import styles from './css/registerRestaurant.module.css';
import logo from './img/logo.png';

async function registerRestaurantApi(formData) {
  const data = new FormData();
  data.append('name', formData.name);
  data.append('businessName', formData.businessName);
  data.append('cnpj', formData.cnpj);
  data.append('email', formData.email);
  data.append('password', formData.password);
  data.append('address', formData.address);
  data.append('phone', formData.phone);
  data.append('description', formData.description);
  if (formData.banner) {
    data.append('banner', formData.banner);
  }

  try {
    const response = await fetch('/api/restaurants/register', {
      method: 'POST',
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao cadastrar restaurante.');
    }

    return result;
  } catch (error) {
    console.error('Erro na API:', error);
    throw new Error(error.message || 'Erro inesperado.');
  }
}

function RegisterRestaurant() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    cnpj: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    description: '',
    banner: null,
    bannerPreview: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validar = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome do restaurante é obrigatório.';
    if (!formData.businessName.trim()) newErrors.businessName = 'Razão Social é obrigatória.';
    // Valida CNPJ sem máscara (apenas dígitos)
    if (formData.cnpj.replace(/\D/g, '').length !== 14) newErrors.cnpj = 'CNPJ inválido.';
    if (!formData.email.includes('@')) newErrors.email = 'Informe um email válido.';
    if (formData.password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres.';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório.';
    // Valida telefone sem máscara (apenas dígitos)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) newErrors.phone = 'Telefone inválido.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        banner: file,
        bannerPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validar();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await registerRestaurantApi(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setApiError(error.message);
      setSuccess(false);
    }

    setLoading(false);
  };

  return (
    <div className={styles['register-restaurant-container']}>
      <img src={logo} alt="Logo NutriFood" className={styles['register-logo']} />
      <h1 className={styles['register-title']}>Cadastro de Restaurante</h1>
      <p className={styles['register-description']}>Preencha os dados para cadastrar seu restaurante.</p>

      {success && <p className={styles['register-success']}>✅ Cadastro realizado com sucesso!</p>}
      {apiError && <p className={styles['register-error']}>{apiError}</p>}

      <form onSubmit={handleSubmit} className={styles['register-form']}>
        <label className={styles['register-label']}>
          Nome do Restaurante:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
            placeholder="Ex: Restaurante Saboroso"
          />
          {errors.name && <span className={styles['register-error']}>{errors.name}</span>}
        </label>

        <label className={styles['register-label']}>
          Razão Social:
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
            placeholder="Ex: Saboroso Ltda."
          />
          {errors.businessName && <span className={styles['register-error']}>{errors.businessName}</span>}
        </label>

        <label className={styles['register-label']}>
          CNPJ:
          <InputMask
            mask="99.999.999/9999-99"
            value={formData.cnpj}
            onChange={handleChange}
            disabled={loading}
            className={styles['register-input']}
            placeholder="00.000.000/0000-00"
            name="cnpj"
          />
          {errors.cnpj && <span className={styles['register-error']}>{errors.cnpj}</span>}
        </label>

        <label className={styles['register-label']}>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
            placeholder="exemplo@email.com"
          />
          {errors.email && <span className={styles['register-error']}>{errors.email}</span>}
        </label>

        <label className={styles['register-label']}>
          Senha:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && <span className={styles['register-error']}>{errors.password}</span>}
        </label>

        <label className={styles['register-label']}>
          Endereço:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={styles['register-input']}
            disabled={loading}
            placeholder="Rua, número, bairro, cidade"
          />
          {errors.address && <span className={styles['register-error']}>{errors.address}</span>}
        </label>

        <label className={styles['register-label']}>
          Telefone:
          <InputMask
            mask="(99) 99999-9999"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            className={styles['register-input']}
            placeholder="(99) 99999-9999"
            name="phone"
          />
          {errors.phone && <span className={styles['register-error']}>{errors.phone}</span>}
        </label>

        <label className={styles['register-label']}>
          Descrição do Restaurante:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles['register-textarea']}
            disabled={loading}
            placeholder="Fale um pouco sobre seu restaurante"
          />
        </label>

        <label className={styles['register-label']}>
          Mini banner do restaurante:
          <input
            type="file"
            name="banner"
            accept="image/*"
            onChange={handleBannerChange}
            className={styles['register-input']}
            disabled={loading}
          />
          {formData.bannerPreview && (
            <img
              src={formData.bannerPreview}
              alt="Preview do banner"
              className={styles['register-banner-preview']}
            />
          )}
        </label>

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

export default RegisterRestaurant;
