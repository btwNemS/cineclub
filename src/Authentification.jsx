import { createContext, useState, useContext } from 'react';

// Création d'un contexte d'authentification pour partager l'état utilisateur dans l'app
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
    //permet de rester connecté même en refreshant la page
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('cineclub_user');
        if (savedUser) {
            return JSON.parse(savedUser);
        }
        return null;
    });

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
            credentials: "include", 
            body: JSON.stringify({ pseudo, password })
        });

        if (!res.ok) {
            throw new Error("Pseudo ou mot de passe incorrect");
        }

        const data = await res.json();
        
        // 2. On met à jour le state ET on sauvegarde l'utilisateur dans le localStorage
        setUser(data.user); 
        localStorage.setItem('cineclub_user', JSON.stringify(data.user)); 
        
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
        
        // 3. On déconnecte l'utilisateur côté front et on nettoie le localStorage
        setUser(null); 
        localStorage.removeItem('cineclub_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);