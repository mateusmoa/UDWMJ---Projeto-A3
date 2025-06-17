import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './css/profileUser.module.css';
import { toast } from "react-toastify";

export default function UserDataForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferences: [],
  });

  const token = localStorage.getItem("token");

  const availablePreferences = [
    'Sem glúten', 'Vegetariano', 'Vegano', 'Low Carb',
    'Sem lactose', 'Sem amendoim', 'Sem ovos', 'Sem nozes', 'Sem peixes e frutos do mar'
  ];

  useEffect(() => {
    async function fetchUserData() {
      try {
        setFetching(true);
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email, preferences } = res.data;
        setForm({
          name: name || "",
          email: email || "",
          password: "",
          confirmPassword: "",
          preferences: preferences || [],
        });
      } catch {
        toast.error("Erro ao carregar dados do usuário.");
      } finally {
        setFetching(false);
      }
    }
    fetchUserData();
  }, [token]);

  function handleChange(e) {
    const { name, value, checked } = e.target;

    if (name === "preferences") {
      let newPrefs = [...form.preferences];
      if (checked && !newPrefs.includes(value)) {
        newPrefs.push(value);
      } else if (!checked) {
        newPrefs = newPrefs.filter((p) => p !== value);
      }
      setForm((prev) => ({ ...prev, preferences: newPrefs }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email) {
      toast.error("Nome e email são obrigatórios.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: form.name,
        email: form.email,
        preferences: form.preferences,
      };
      if (form.password) payload.password = form.password;

      await axios.put("/api/users/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Dados atualizados com sucesso!");
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch {
      toast.error("Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <p>Carregando dados do usuário...</p>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Dados do Usuário</h2>

      <label>
        Nome completo
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Email
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>

      <label>
        Nova senha
        <input type="password" name="password" value={form.password} onChange={handleChange} />
      </label>

      <label>
        Confirmar senha
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
      </label>

      <fieldset>
        <legend>Preferências alimentares</legend>
        {availablePreferences.map((pref) => (
          <label key={pref} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="preferences"
              value={pref}
              checked={form.preferences.includes(pref)}
              onChange={handleChange}
            />
            {pref}
          </label>
        ))}
      </fieldset>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? "Salvando..." : "Salvar dados"}
      </button>
    </form>
  );
}
