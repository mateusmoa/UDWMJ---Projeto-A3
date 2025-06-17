import React, { useState, useEffect } from 'react';
import styles from './css/profileUser.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddressForm({ userId, address = null, onClose }) {
  const isEdit = Boolean(address);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    zip: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    category: '',
    nickname: '',
    is_main: false,
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        zip: address.zip || '',
        street: address.street || '',
        number: address.number || '',
        complement: address.complement || '',
        neighborhood: address.neighborhood || '',
        city: address.city || '',
        state: address.state || '',
        category: address.category || '',
        nickname: address.nickname || '',
        is_main: Boolean(address.is_main),
      });
    }
  }, [address]);

  const fetchAddressByZip = async (cep) => {
    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (res.data.erro) {
        toast.error('CEP não encontrado.');
        return;
      }

      const { logradouro, bairro, localidade, uf, complemento } = res.data;

      setForm((prev) => ({
        ...prev,
        street: logradouro || '',
        neighborhood: bairro || '',
        city: localidade || '',
        state: uf || '',
        complement: prev.complement || complemento || '',
      }));
    } catch (error) {
      toast.error('Erro ao buscar endereço pelo CEP.');
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada neste navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
              format: 'json',
              lat: latitude,
              lon: longitude,
              addressdetails: 1,
            },
          });

          const addr = res.data.address;
          setForm((prev) => ({
            ...prev,
            street: addr.road || '',
            neighborhood: addr.suburb || '',
            city: addr.city || addr.town || addr.village || '',
            state: addr.state || '',
            zip: addr.postcode || '',
          }));
          toast.success('Endereço preenchido com base na sua localização!');
        } catch (error) {
          console.error('Erro GPS:', error);
          toast.error('Erro ao buscar localização.');
        }
      },
      () => {
        toast.error('Permissão negada para acessar localização.');
      }
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === 'zip' && value.replace(/\D/g, '').length === 8) {
      fetchAddressByZip(value.replace(/\D/g, ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['zip', 'street', 'number', 'city', 'state', 'category'];
    const isValid = requiredFields.every((field) => form[field].trim() !== '');

    if (!isValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      const payload = { ...form, user_id: userId };

      if (isEdit) {
        await axios.put(`/api/addresses/${address.id}`, payload);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        await axios.post('/api/addresses', payload);
        toast.success('Endereço cadastrado com sucesso!');
      }

      if (onClose) onClose();
    } catch (error) {
      toast.error('Erro ao salvar endereço.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>{isEdit ? 'Editar Endereço' : 'Novo Endereço'}</h2>

      <label>
        CEP*
        <input
          type="text"
          name="zip"
          value={form.zip}
          onChange={handleChange}
          autoComplete="postal-code"
          required
        />
      </label>

      <button type="button" onClick={handleGetCurrentLocation} style={{ marginBottom: '1rem' }}>
        Usar localização atual
      </button>

      <label>
        Rua*
        <input type="text" name="street" value={form.street} onChange={handleChange} required />
      </label>

      <label>
        Número*
        <input type="text" name="number" value={form.number} onChange={handleChange} required />
      </label>

      <label>
        Complemento
        <input type="text" name="complement" value={form.complement} onChange={handleChange} />
      </label>

      <label>
        Bairro
        <input type="text" name="neighborhood" value={form.neighborhood} onChange={handleChange} />
      </label>

      <label>
        Cidade*
        <input type="text" name="city" value={form.city} onChange={handleChange} required />
      </label>

      <label>
        Estado*
        <input type="text" name="state" value={form.state} onChange={handleChange} required />
      </label>

      <label>
        Categoria*
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Selecione uma categoria</option>
          <option value="Casa">Casa</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Família">Família</option>
          <option value="Entrega">Entrega</option>
          <option value="Outro">Outro</option>
        </select>
      </label>

      <label>
        Apelido
        <input type="text" name="nickname" value={form.nickname} onChange={handleChange} />
      </label>

      <label>
        <input
          type="checkbox"
          name="is_main"
          checked={form.is_main}
          onChange={handleChange}
        />
        Tornar endereço principal
      </label>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
        </button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
