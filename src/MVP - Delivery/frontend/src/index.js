import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import axios from "axios";
import './index.css';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = "http://localhost:5000";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
