// Permet à AuthProvider d'enregistrer ses fonctions de déconnexion / ouverture de la modale de connexion,
// pour qu'apiFetch puisse les déclencher en cas de session expirée (401), sans dépendre du contexte React.
let authHandlers = {
  logout: () => {},
  openLoginDialog: () => { },
};

export function registerAuthHandlers(handlers) {
  authHandlers = handlers;
}

export default async function apiFetch(url, options = {}) {
  const res = await fetch(url, { credentials: "include", ...options });
  if (res.status === 401) {
    authHandlers.logout();
    authHandlers.openLoginDialog();
  }
  return res;
}
