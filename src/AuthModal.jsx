// Importation des hooks React et du contexte d'authentification personnalisé
import { useState } from 'react';
import { useAuth } from './Authentification';
// Importation des composants Material UI utilisés dans la modale
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions, 
  Typography,
  Box 
} from '@mui/material';

// Déclaration du composant AuthModal, recevant les props open et handleClose
export default function AuthModal({ open, handleClose }) {
  // Récupération des fonctions login et signin depuis le contexte d'authentification
  const { login, signin } = useAuth();
  
  // État pour savoir si on est en mode connexion (true) ou inscription (false)
  const [isLogin, setIsLogin] = useState(true);
  
  // États pour stocker les valeurs des champs du formulaire
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // État pour afficher un message d'erreur ou de succès
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setMessage({ text: '', type: '' }); // Réinitialise le message

    try {
      if (isLogin) {
        // Si mode connexion, appelle login avec pseudo et mot de passe
        await login(pseudo, password);
        setPseudo(''); // Réinitialise le champ pseudo
        setPassword(''); // Réinitialise le champ mot de passe
        handleClose(); // Ferme la modale si la connexion réussit
      } else {
        // Si mode inscription, appelle signin avec email, pseudo et mot de passe
        await signin(email, pseudo, password);
        setIsLogin(true); // Passe en mode connexion après inscription
        setEmail(''); // Réinitialise le champ email
        setPassword(''); // Réinitialise le champ mot de passe
        setMessage({ text: 'Compte créé avec succès ! Connectez-vous.', type: 'success' }); // Affiche un message de succès
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' }); // Affiche le message d'erreur
    }
  };

  // Rendu du composant
  return (
    <Dialog open={open} onClose={handleClose}> {/* Affiche la modale si open est true */}
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pt: 3 }}>
        {isLogin ? 'CONNEXION' : 'INSCRIPTION'} {/* Titre selon le mode */}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}> {/* Formulaire avec gestion de la soumission */}
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '320px', pt: 1 }}>
          
          {/* Affiche un message d'erreur ou de succès si présent */}
          {message.text && (
            <Typography variant="body2" color={message.type === 'success' ? 'success.main' : 'error.main'} sx={{ textAlign: 'center' }}>
              {message.text}
            </Typography>
          )}

          {/* Champ email affiché seulement en mode inscription */}
          {!isLogin && (
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          {/* Champ pseudo, toujours affiché */}
          <TextField
            label="Pseudo"
            variant="outlined"
            fullWidth
            required
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />

          {/* Champ mot de passe, toujours affiché */}
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Lien pour changer de mode (connexion <-> inscription) */}
          <Box 
            sx={{ textDecoration: 'underline', cursor: 'pointer', mt: 1, textAlign: 'center' }} 
            onClick={() => { setIsLogin(!isLogin); setMessage({ text: '', type: '' }); }}
          >
            <Typography variant="body2" color="primary">
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </Typography>
          </Box>
        </DialogContent>

        {/* Boutons d'action en bas de la modale */}
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit">ANNULER</Button>
          <Button type="submit" variant="contained" color="primary">
            {isLogin ? 'SE CONNECTER' : "S'INSCRIRE"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}