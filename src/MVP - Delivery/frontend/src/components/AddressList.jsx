import React, { useEffect, useState } from 'react';
import styles from './css/profileUser.module.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

function AddressList({ userId, onEdit, onAdd, reloadFlag }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!userId) return;

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/addresses/user/${userId}`);
      setAddresses(response.data);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      toast.error('Erro ao carregar endereços.');
    } finally {
      setLoading(false);
    }
  };

  fetchAddresses();
}, [userId, reloadFlag]);


  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este endereço?')) return;
    try {
      await axios.delete(`/api/addresses/${id}`);
      toast.success('Endereço excluído com sucesso');
      setAddresses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Erro ao excluir:', err);
      toast.error('Erro ao excluir o endereço.');
    }
  };

  return (
    <section className={styles.dadosSection}>
      <div className={styles.sectionHeader}>
        <h2>Seus Endereços</h2>
        {onAdd && (
          <button className={styles.configButton} onClick={onAdd}>
            <FaPlus style={{ marginRight: 6 }} /> Novo Endereço
          </button>
        )}
      </div>

      {loading ? (
        <p>Carregando endereços...</p>
      ) : addresses.length === 0 ? (
        <p>Nenhum endereço cadastrado.</p>
      ) : (
        <ul className={styles.listaEnderecos}>
          {addresses.map((endereco) => (
            <li key={endereco.id} className={styles.cardEndereco}>
              <p>
                <strong>{endereco.category?.toUpperCase()}</strong>
                {endereco.nickname && ` - ${endereco.nickname}`}
              </p>
              <p>{endereco.street}, {endereco.number} {endereco.complement}</p>
              <p>{endereco.neighborhood} - {endereco.city}/{endereco.state} - CEP: {endereco.zip}</p>
              {endereco.is_main === 1 && (
                <span className={styles.tagPrincipal}>Principal</span>
              )}
              <div className={styles.cardButtons}>
                <button
                  onClick={() => onEdit(endereco)}
                  className={styles.configButton}
                  aria-label={`Editar endereço ${endereco.nickname || endereco.street}`}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(endereco.id)}
                  className={styles.deleteButton}
                  aria-label="Excluir endereço"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AddressList;
