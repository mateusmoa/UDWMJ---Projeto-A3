import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "./css/restaurantProducts.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RestaurantProducts({ restaurantId }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  // Função para buscar os produtos do restaurante
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/products?restaurantId=${restaurantId}`);
      setProducts(res.data);
    } catch (err) {
      toast.error("Erro ao buscar produtos");
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Inicia o modo de edição de um produto
  const startEdit = (product) => {
    setEditing(product.id);
    setForm(product);
  };

  // Cancela a edição e limpa o formulário
  const cancelEdit = () => {
    setEditing(null);
    setForm({});
  };

  // Atualiza os dados do formulário conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Salva as alterações feitas em um produto
  const saveEdit = async () => {
    try {
      await axios.put(`/api/products/${form.id}`, form);
      toast.success("Produto atualizado com sucesso!");
      fetchProducts();
      cancelEdit();
    } catch (err) {
      toast.error("Erro ao atualizar produto");
    }
  };

  // Exclui um produto após confirmação
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/products/${id}`);
      toast.success("Produto excluído com sucesso!");
      fetchProducts();
    } catch (err) {
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className={styles.title}>Meus Produtos</h2>

      {products.map((p) => (
        <div key={p.id} className={styles.card}>
          {editing === p.id ? (
            <div className={styles.editForm}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nome"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descrição"
              />
              <input
                name="kcal"
                type="number"
                value={form.kcal}
                onChange={handleChange}
                placeholder="Kcal"
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Preço"
              />
              <button onClick={saveEdit}>Salvar</button>
              <button onClick={cancelEdit}>Cancelar</button>
            </div>
          ) : (
            <div>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>{p.kcal} Kcal — R$ {p.price}</p>
              <button onClick={() => startEdit(p)}>Editar</button>
              <button onClick={() => deleteProduct(p.id)}>Excluir</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
