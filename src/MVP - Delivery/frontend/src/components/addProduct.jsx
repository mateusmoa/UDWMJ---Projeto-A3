import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddProduct({ restaurantId }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    kcal: "",
    price: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Atualiza os valores do formulário conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envia os dados para o backend para criar um novo produto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // A URL abaixo deve ser a mesma configurada no seu backend
      await axios.post("http://localhost:5000/api/products", { 
        ...form, 
        restaurantId 
      });
      toast.success("Produto cadastrado com sucesso!");
      // Limpa o formulário após a operação
      setForm({
        name: "",
        description: "",
        kcal: "",
        price: ""
      });
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      setError("Erro ao cadastrar produto!");
      toast.error("Erro ao cadastrar produto!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        name="name" 
        placeholder="Nome" 
        required 
        value={form.name}
        onChange={handleChange}
        disabled={loading}
      />
      <textarea 
        name="description" 
        placeholder="Descrição" 
        required 
        value={form.description}
        onChange={handleChange}
        disabled={loading}
      />
      <input 
        type="number" 
        name="kcal" 
        placeholder="Kcal" 
        required 
        value={form.kcal}
        onChange={handleChange}
        disabled={loading}
      />
      <input 
        type="number" 
        name="price" 
        placeholder="Preço" 
        required 
        value={form.price}
        onChange={handleChange}
        disabled={loading}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}
