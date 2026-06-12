import { createContext, useState, useContext, useEffect } from 'react';
import { registerAuthHandlers } from './Components/tokencheck';

// Création d'un contexte d'authentification pour partager l'état utilisateur dans toute l'application
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL; // Récupération de l'URL de l'API depuis les variables d'environnement

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
    // Initialisation de l'état utilisateur avec les données du localStorage (permet de rester connecté après un rafraîchissement de la page)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('cineclub_user'); // Récupération de l'utilisateur sauvegardé
        if (savedUser) {
            return JSON.parse(savedUser); // Conversion des données JSON en objet
        }
        return null; // Si aucun utilisateur n'est sauvegardé, on retourne null
    });

    // 1. Inscription (Sign In)
    const signin = async (email, pseudo, password) => {
        // Envoi d'une requête POST à l'API pour inscrire un nouvel utilisateur
        const res = await fetch(`${API_URL}/users/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Spécification du type de contenu
            body: JSON.stringify({ email, pseudo, password }) // Envoi des données utilisateur
        });
        if (!res.ok) {
            // Gestion des erreurs si la requête échoue
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Erreur lors de l'inscription");
        }
        return await res.json(); // Retourne les données de réponse
    };

    // 2. Connexion (Login)
    const login = async (pseudo, password) => {
        // Envoi d'une requête POST à l'API pour connecter un utilisateur
        const res = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Spécification du type de contenu
            credentials: "include", // Inclure les cookies pour la session
            body: JSON.stringify({ pseudo, password }) // Envoi des données utilisateur
        });

        if (!res.ok) {
            // Gestion des erreurs si la connexion échoue
            throw new Error("Pseudo ou mot de passe incorrect");
        }

        const data = await res.json(); // Récupération des données utilisateur

        // Mise à jour de l'état utilisateur et sauvegarde dans le localStorage
        setUser(data.user); 
        localStorage.setItem('cineclub_user', JSON.stringify(data.user)); 
        
        return data.user; // Retourne les données utilisateur
    };

    // 3. Déconnexion (Logout)
    const logout = async () => {
        try {
            // Envoi d'une requête POST à l'API pour déconnecter l'utilisateur
            await fetch(`${API_URL}/users/logout`, {
                method: "POST",
                credentials: "include" // Inclure les cookies pour la session
            });
        } catch (err) {
            // Gestion des erreurs lors de la déconnexion
            console.error("Erreur logout backend", err);
        }
        
        // Réinitialisation de l'état utilisateur et nettoyage du localStorage
        setUser(null);
        localStorage.removeItem('cineclub_user');
    };

    // État de la modale de connexion, partagé via le contexte pour qu'apiFetch puisse l'ouvrir
    // automatiquement lorsqu'une requête renvoie 401 (session expirée).
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMessage, setAuthModalMessage] = useState(null);
    const openAuthModal = (message = null) => {
        setAuthModalMessage(message);
        setAuthModalOpen(true);
    };
    const closeAuthModal = () => {
        setAuthModalOpen(false);
        setAuthModalMessage(null);
    };

    useEffect(() => {
        registerAuthHandlers({
            logout,
            openLoginDialog: () => openAuthModal("Votre session a expiré. Veuillez vous reconnecter."),
        });
    });

    return (
        // Fourniture des données et fonctions d'authentification aux composants enfants
        <AuthContext.Provider value={{ user, login, signin, logout, authModalOpen, authModalMessage, openAuthModal, closeAuthModal }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour accéder facilement au contexte d'authentification
export const useAuth = () => useContext(AuthContext);