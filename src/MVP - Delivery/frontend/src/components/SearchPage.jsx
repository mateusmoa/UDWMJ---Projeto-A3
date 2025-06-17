import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "./css/searchPage.module.css";
import { toast } from "react-toastify";

// Corrige o ícone padrão do leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function SearchPage({ user }) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("");
  const [resultados, setResultados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [kcalMin, setKcalMin] = useState("");
  const [kcalMax, setKcalMax] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategorias(res.data))
      .catch(err => {
        console.error("Erro ao buscar categorias:", err);
        toast.error("Falha ao carregar categorias.");
      });
  }, []);

  // Pega a localização do usuário assim que o componente carrega
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log("Geolocalização não permitida ou disponível", err)
      );
    }
  }, []);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const prefs = user?.preferencias?.join(",") || "";
      const res = await axios.get('/api/busca', {
        params: {
          query,
          categoria,
          preferencias: prefs,
          priceMin,
          priceMax,
          kcalMin,
          kcalMax,
          lat: userLocation?.[0],
          lng: userLocation?.[1],
        }
      });
      setResultados(res.data);
    } catch (err) {
      console.error("Erro ao buscar:", err);
      toast.error("Erro na busca. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [query, categoria, priceMin, priceMax, kcalMin, kcalMax, user, userLocation]);

  const addToCart = useCallback(async (productId) => {
    try {
      await axios.post('/api/cart/add', { productId });
      toast.success("Produto adicionado ao carrinho!");
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
      toast.error("Erro ao adicionar ao carrinho.");
    }
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Buscar Alimentos e Restaurantes</h2>

      <div className={styles.filters}>
        <input
          placeholder="Buscar por nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Preço mín"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço máx"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
        />
        <input
          type="number"
          placeholder="Kcal mín"
          value={kcalMin}
          onChange={(e) => setKcalMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Kcal máx"
          value={kcalMax}
          onChange={(e) => setKcalMax(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <div className={styles.results}>
        {resultados.map(item => (
          <div key={item.id} className={styles.card}>
            <img src={item.image_url} alt={item.name} className={styles.image} />
            <div className={styles.info}>
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p><strong>R$ {item.price}</strong> — {item.kcal} kcal</p>
              <small>{item.restaurante} — {item.categoria}</small>
              <button onClick={() => addToCart(item.id)}>Adicionar ao carrinho</button>
            </div>
          </div>
        ))}
      </div>

      {/* Mapa só aparece se a localização do usuário estiver disponível */}
      {userLocation && resultados.length > 0 && (
        <div className={styles.mapContainer}>
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: "400px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marcador da localização do usuário */}
            <Marker position={userLocation}>
              <Popup>Você está aqui</Popup>
            </Marker>

            {/* Marcadores dos restaurantes */}
            {resultados.map(item => (
              item.latitude && item.longitude && (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                >
                  <Popup>
                    <strong>{item.restaurante}</strong><br />
                    {item.name} - R$ {item.price}
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
