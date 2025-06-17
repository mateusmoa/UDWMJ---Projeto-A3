import { useState, useCallback } from "react";
import axios from "axios";
import styles from "./css/reviewForm.module.css";
import { toast } from "react-toastify";

export default function ReviewForm({ orderId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!rating) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/reviews",
        { order_id: orderId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        toast.success("Avaliação enviada com sucesso!");
        if (onReviewSubmitted) onReviewSubmitted();
      } else {
        throw new Error("Erro ao enviar avaliação.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar avaliação. Tente novamente.");
      toast.error("Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  }, [rating, comment, orderId, token, onReviewSubmitted]);

  if (submitted) {
    return (
      <p className={styles.success}>
        Avaliação enviada! Obrigado pelo feedback. 😊
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <h3 className={styles.title}>Avalie seu pedido</h3>

      <label className={styles.label} htmlFor="rating">
        Nota:
      </label>
      <select
        id="rating"
        className={styles.select}
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
        disabled={loading}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} estrela{n > 1 && "s"}
          </option>
        ))}
      </select>

      <label className={styles.label} htmlFor="comment">
        Comentário:
      </label>
      <textarea
        id="comment"
        className={styles.textarea}
        placeholder="Comentário (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        disabled={loading}
      />

      {error && <p className={styles.errorMessage}>{error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Enviando..." : "Enviar Avaliação"}
      </button>
    </form>
  );
}
