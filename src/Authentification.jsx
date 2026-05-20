import { createContext, useState, useContext } from 'react';

// Création d'un contexte d'authentification pour partager l'état utilisateur dans l'app
const AuthContext = createContext();
const API_URL = "https://rasantacruz.fr/cineclub";

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
    // État local pour stocker l'utilisateur connecté
    const [user, setUser] = useState(null);

    // 1. Inscription (Sign In)
    // Fonction pour inscrire un nouvel utilisateur
    const signin = async (email, pseudo, password) => {
        const res = await fetch(`${API_URL}/users/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, pseudo, password })
        });
        // Gestion des erreurs de la requête
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Erreur lors de l'inscription");
        }
        // Retourne la réponse JSON si succès
        return await res.json();
    };

    // 2. Connexion (Login)
    // Fonction pour connecter un utilisateur existant
    const login = async (pseudo, password) => {
        const res = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Permet au navigateur de stocker le cookie JWT sécurisé
            body: JSON.stringify({ pseudo, password })
        });

        // Gestion des erreurs de connexion
        if (!res.ok) {
            throw new Error("Pseudo ou mot de passe incorrect");
        }

        // Récupère les données utilisateur et les stocke dans l'état
        const data = await res.json();
        setUser(data.user); // Stocke l'objet user : { id, pseudo, role }
        return data.user;
    };

    // 3. Déconnexion (Logout)
    // Fonction pour déconnecter l'utilisateur
    const logout = async () => {
        try {
            await fetch(`${API_URL}/users/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            // Affiche une erreur si la déconnexion backend échoue, mais continue
            console.error("Erreur logout backend", err);
        }
        setUser(null); // Déconnecte l'utilisateur côté front dans tous les cas
    };

    // Fournit les fonctions et l'utilisateur courant à tous les composants enfants
    return (
        <AuthContext.Provider value={{ user, login, signin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour accéder facilement au contexte d'authentification
export const useAuth = () => useContext(AuthContext);