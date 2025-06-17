import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChartBar,
} from "react-icons/fa";
import UserNav from "./UserNav";
import UserDataForm from "./UserDataForm";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";
import ConfigOptions from "./ConfigOptions";
import UserMetrics from "./UserMetrics";
import styles from "./css/profileUser.module.css";

export default function ProfileUser() {
  const [selectedTab, setSelectedTab] = useState("dados");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [shouldReloadAddresses, setShouldReloadAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.name || data.nome);
          setUserId(data.id || data.userId);
        } else {
          console.error("Erro ao buscar dados do usuário");
        }
      } catch (error) {
        console.error("Erro de rede ao buscar usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "dados":
        return <UserDataForm />;
      case "enderecos":
        return userId ? (
          <>
            <AddressList
              userId={userId}
              onAdd={() => {
                setEditingAddress(null);
                setShowAddressForm(true);
              }}
              onEdit={(endereco) => {
                setEditingAddress(endereco);
                setShowAddressForm(true);
              }}
              reloadFlag={shouldReloadAddresses}
            />

            {showAddressForm && (
              <AddressForm
                userId={userId}
                address={editingAddress}
                onClose={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                  setShouldReloadAddresses((prev) => !prev);
                }}
              />
            )}
          </>
        ) : (
          <p>Carregando endereços...</p>
        );
      case "metricas":
        return userId ? <UserMetrics userId={userId} /> : <p>Carregando métricas...</p>;
      case "config":
        return <ConfigOptions onLogout={handleLogout} />;
      default:
        return <UserDataForm />;
    }
  };

  return (
    <div className={styles.container}>
      <UserNav onLogout={handleLogout} />

      <nav className={styles.menu}>
        <div
          className={`${styles.menuItem} ${selectedTab === "dados" ? styles.menuItemActive : ""}`}
          onClick={() => setSelectedTab("dados")}
        >
          <FaUser size={24} />
          <span>Meus Dados</span>
        </div>
        <div
          className={`${styles.menuItem} ${selectedTab === "enderecos" ? styles.menuItemActive : ""}`}
          onClick={() => setSelectedTab("enderecos")}
        >
          <FaMapMarkerAlt size={24} />
          <span>Endereços</span>
        </div>
        <div
          className={`${styles.menuItem} ${selectedTab === "metricas" ? styles.menuItemActive : ""}`}
          onClick={() => setSelectedTab("metricas")}
        >
          <FaChartBar size={24} />
          <span>Métricas</span>
        </div>
        <div
          className={`${styles.menuItem} ${selectedTab === "config" ? styles.menuItemActive : ""}`}
          onClick={() => setSelectedTab("config")}
        >
          <FaCog size={24} />
          <span>Configurações</span>
        </div>
        <div className={styles.menuItemExit} onClick={handleLogout}>
          <FaSignOutAlt size={24} />
          <span>Sair</span>
        </div>
      </nav>

      <section className={styles.content}>{renderContent()}</section>

      <button
        onClick={() => window.history.back()}
        className={styles.backButton}
      >
        <FaChevronLeft />
        Voltar
      </button>
    </div>
  );
}
