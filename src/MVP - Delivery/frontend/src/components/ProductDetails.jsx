import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Carregando...</p>;

  const handleAdd = () => {
    add({ ...product, observation: note });
    alert("Produto adicionado ao carrinho");
  };

  return (
    <div className="p-4">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>Kcal:</strong> {product.kcal}</p>
      <p><strong>Preço:</strong> R$ {product.price}</p>

      <label>Observações:</label>
      <textarea
        className="block w-full border p-2 my-2"
        placeholder="Ex: sem leite, sem glúten..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
        Adicionar ao carrinho
      </button>
    </div>
  );
}
