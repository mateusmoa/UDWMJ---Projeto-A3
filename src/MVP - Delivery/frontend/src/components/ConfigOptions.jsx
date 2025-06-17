import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./css/profileUser.module.css";

function ConfigOptions({ onLogout }) {
  const [loading, setLoading] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [deleting, setDeleting] = useState(false); // Novo estado só para excluir conta

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/users/preferences");
        setNotificationsEnabled(res.data.notifications);
        setDarkMode(res.data.darkMode);
      } catch (err) {
        toast.error("Erro ao carregar preferências.");
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const savePreferences = async (newPrefs) => {
    setSavingPrefs(true);
    try {
      await axios.put("/api/users/preferences", newPrefs);
      toast.success("Preferências salvas.");
    } catch {
      toast.error("Erro ao salvar preferências.");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleToggleNotifications = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    savePreferences({ notifications: newVal, darkMode });
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Tem certeza que deseja excluir sua conta? Essa ação é irreversível.")) return;

    setDeleting(true);
    try {
      await axios.delete("/api/users/profile");
      toast.success("Conta excluída com sucesso!");
      if (onLogout) onLogout();
    } catch {
      toast.error("Erro ao excluir conta.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className={styles.configSection}>
      <h2>Configurações</h2>

      {loading ? (
        <p>Carregando preferências...</p>
      ) : (
        <>
          <div className={styles.configItem}>
            <label>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleToggleNotifications}
                disabled={savingPrefs}
              />
              Notificações Push
            </label>
          </div>

          <div className={styles.configItem}>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteAccount}
              disabled={savingPrefs || deleting}
            >
              Excluir Conta
            </button>
            {deleting && (
              <p className={styles.processingText}>Processando exclusão...</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default ConfigOptions;
