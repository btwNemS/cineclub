import { useState } from 'react';
import { useAuth } from './Authentification';
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

export default function AuthModal({ open, handleClose }) {
  const { login, signin } = useAuth();
  
  // Mode de la fenêtre (true = Connexion, false = Inscription)
  const [isLogin, setIsLogin] = useState(true);
  
  // États des champs de texte
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      if (isLogin) {
        // Envoi des données de connexion à l'API
        await login(pseudo, password);
        setPseudo('');
        setPassword('');
        handleClose(); // Ferme la modale si la connexion réussit
      } else {
        // Envoi des données d'inscription à l'API
        await signin(email, pseudo, password);
        setIsLogin(true); // Redirige automatiquement vers l'écran de connexion
        setEmail('');
        setPassword('');
        setMessage({ text: 'Compte créé avec succès ! Connectez-vous.', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pt: 3 }}>
        {isLogin ? 'CONNEXION' : 'INSCRIPTION'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '320px', pt: 1 }}>
          
          {message.text && (
            <Typography variant="body2" color={message.type === 'success' ? 'success.main' : 'error.main'} sx={{ textAlign: 'center' }}>
              {message.text}
            </Typography>
          )}

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

          <TextField
            label="Pseudo"
            variant="outlined"
            fullWidth
            required
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />

          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box 
            sx={{ textDecoration: 'underline', cursor: 'pointer', mt: 1, textAlign: 'center' }} 
            onClick={() => { setIsLogin(!isLogin); setMessage({ text: '', type: '' }); }}
          >
            <Typography variant="body2" color="primary">
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </Typography>
          </Box>
        </DialogContent>

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