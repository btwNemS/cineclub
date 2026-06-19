// On importe les hooks React dont on a besoin :
// - createContext : crée une "boîte" de données partageable par tous les composants
// - useState      : crée une variable d'état qui déclenche un re-rendu quand elle change
// - useContext     : permet à un composant de lire le contenu d'un contexte (ici AuthContext)
// - useEffect      : exécute du code après le rendu du composant (effet de bord)
import { createContext, useState, useContext, useEffect } from 'react';
// Fonction utilitaire qui enregistre les fonctions logout/openLoginDialog
// pour que d'autres fichiers (ex: un fetch global) puissent les appeler sans import circulaire
import { registerAuthHandlers } from './Components/tokencheck';

// Création d'un contexte d'authentification pour partager l'état utilisateur dans toute l'application
// createContext() crée un objet contexte vide ; il sera "rempli" par AuthContext.Provider plus bas
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL; // Récupération de l'URL de l'API depuis les variables d'environnement

// Fournisseur du contexte d'authentification
// Ce composant doit englober (wrapper) toute l'application (ou la partie qui a besoin de l'auth)
export const AuthProvider = ({ children }) => {
    // useState déclare une variable "user" (état actuel) et "setUser" (fonction pour la modifier)
    // L'argument passé est une fonction "lazy initializer" : elle ne s'exécute qu'une seule fois,
    // au tout premier rendu, pour calculer la valeur initiale de "user"
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('cineclub_user'); // Récupération de l'utilisateur sauvegardé
        if (savedUser) {
            return JSON.parse(savedUser); // Conversion des données JSON (texte) en objet JavaScript
        }
        return null; // Si aucun utilisateur n'est sauvegardé, on retourne null (= pas connecté)
    });

    // 1. Inscription (Sign In)
    // Fonction asynchrone (utilise await) appelée par le composant d'inscription
    const signin = async (email, pseudo, password) => {
        // Envoi d'une requête POST à l'API pour inscrire un nouvel utilisateur
        const res = await fetch(`${API_URL}/users/signin`, {
            method: "POST", // On crée une ressource côté serveur -> POST
            headers: { "Content-Type": "application/json" }, // On prévient le serveur qu'on envoie du JSON
            body: JSON.stringify({ email, pseudo, password }) // On convertit l'objet JS en texte JSON pour l'envoyer
        });
        if (!res.ok) {
            // res.ok est false si le code HTTP n'est pas 2xx (ex: 400, 409...)
            const errData = await res.json().catch(() => ({})); // On essaie de lire le message d'erreur renvoyé par l'API
            throw new Error(errData.message || "Erreur lors de l'inscription"); // On stoppe l'exécution avec une erreur explicite
        }
        return await res.json(); // Si tout va bien, on retourne la réponse JSON de l'API
    };

    // 2. Connexion (Login)
    const login = async (pseudo, password) => {
        // Envoi d'une requête POST à l'API pour connecter un utilisateur
        const res = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Demande au navigateur d'envoyer/recevoir les cookies de session
            body: JSON.stringify({ pseudo, password })
        });

        if (!res.ok) {
            // Identifiants invalides ou erreur serveur -> on lève une erreur que le composant pourra afficher
            throw new Error("Pseudo ou mot de passe incorrect");
        }

        const data = await res.json(); // On récupère { user: {...} } renvoyé par le backend

        // setUser déclenche un re-rendu de tous les composants qui utilisent "user" via useAuth()
        setUser(data.user);
        // On persiste l'utilisateur dans le localStorage pour qu'il reste connecté après un F5
        localStorage.setItem('cineclub_user', JSON.stringify(data.user));

        return data.user; // Retourne l'utilisateur au composant appelant (ex: pour rediriger après login)
    };

    // 3. Déconnexion (Logout)
    const logout = async () => {
        try {
            // On informe le backend pour qu'il invalide la session/cookie côté serveur
            await fetch(`${API_URL}/users/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            // Si le serveur est inaccessible, on continue quand même la déconnexion côté client
            console.error("Erreur logout backend", err);
        }

        // On vide l'état local : "user" redevient null -> l'UI repasse en mode "non connecté"
        setUser(null);
        localStorage.removeItem('cineclub_user'); // On supprime aussi la trace en localStorage
    };

    // État de la modale de connexion, partagé via le contexte pour qu'apiFetch puisse l'ouvrir
    // automatiquement lorsqu'une requête renvoie 401 (session expirée).
    const [authModalOpen, setAuthModalOpen] = useState(false); // true/false : la modale est-elle affichée ?
    const [authModalMessage, setAuthModalMessage] = useState(null); // message à afficher dans la modale (ex: "session expirée")
    const openAuthModal = (message = null) => {
        setAuthModalMessage(message); // on stocke le message
        setAuthModalOpen(true); // on ouvre la modale -> re-rendu, le composant Modal devient visible
    };
    const closeAuthModal = () => {
        setAuthModalOpen(false); // on referme la modale
        setAuthModalMessage(null); // on efface le message pour la prochaine ouverture
    };

    // useEffect exécute son code après chaque rendu du composant (ici, sans tableau de dépendances,
    // donc il se ré-exécute à chaque re-rendu). Il sert à "brancher" logout/openAuthModal sur un module
    // externe (tokencheck) qui n'a pas accès au contexte React, pour qu'il puisse forcer une déconnexion
    // ou ouvrir la modale de login depuis n'importe où (ex: un fetch global qui reçoit un 401).
    useEffect(() => {
        registerAuthHandlers({
            logout,
            openLoginDialog: () => openAuthModal("Votre session a expiré. Veuillez vous reconnecter."),
        });
    });

    return (
        // AuthContext.Provider rend toutes ces valeurs (user, login, signin...) disponibles
        // à n'importe quel composant enfant, sans avoir à les passer manuellement en props
        <AuthContext.Provider value={{ user, login, signin, logout, authModalOpen, authModalMessage, openAuthModal, closeAuthModal }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé : useContext(AuthContext) lit la valeur fournie par AuthContext.Provider.
// Grâce à ça, n'importe quel composant peut faire `const { user, login } = useAuth();`
// au lieu d'écrire `useContext(AuthContext)` partout.
export const useAuth = () => useContext(AuthContext);