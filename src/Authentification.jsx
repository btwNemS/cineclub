import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
const API_URL = "https://rasantacruz.fr/cineclub";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. Inscription (Sign In)
  const signin = async (email, pseudo, password) => {
    const res = await fetch(`${API_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pseudo, password })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Erreur lors de l'inscription");
    }
    return await res.json();
  };

  // 2. Connexion (Login)
  const login = async (pseudo, password) => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Permet au navigateur de stocker le cookie JWT sécurisé
      body: JSON.stringify({ pseudo, password })
    });

    if (!res.ok) {
      throw new Error("Pseudo ou mot de passe incorrect");
    }

    const data = await res.json();
    setUser(data.user); // Stocke l'objet user : { id, pseudo, role }
    return data.user;
  };

  // 3. Déconnexion (Logout)
  const logout = async () => {
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Erreur logout backend", err);
    }
    setUser(null); // Déconnecte l'utilisateur côté front dans tous les cas
  };

  return (
    <AuthContext.Provider value={{ user, login, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);