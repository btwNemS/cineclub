import { useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import { useAuth } from '../Authentification';
import AuthModal from '../AuthModal';
import { Button, Typography, Box } from '@mui/material';

function Layout() {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  
  const navStyle = {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '1rem 2rem', 
    backgroundColor: '#1e1e1e',
    borderBottom: '1px solid #333'
  };

  const ulStyle = {
    display: 'flex', 
    gap: '1.5rem', 
    listStyle: 'none', 
    margin: 0, 
    padding: 0
  };

  const linkStyle = {
    color: 'white', 
    textDecoration: 'none', 
    fontWeight: 'bold'
  };

  const adminLinkStyle = {
    color: '#4da6ff', 
    textDecoration: 'none', 
    fontWeight: 'bold'
  };


  return (
    <>
      <nav style={navStyle}>
        <ul style={ulStyle}>
          <li>
            <Link to="/" style={linkStyle}>Home</Link>
          </li>
          <li>
            <Link to="/blogs" style={linkStyle}>Blogs</Link>
          </li>
          <li>
            <Link to="/contact" style={linkStyle}>Contact</Link>
          </li>
          
          {user && user.role === 'admin' && (
            <li>
              <Link to="/backoffice" style={adminLinkStyle}>
                ⚙️ Panneau Admin
              </Link>
            </li>
          )}
        </ul>

 
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Typography variant="body1" sx={{ color: 'white' }}>
                Bonjour, <strong>{user.pseudo}</strong> 
                <span style={{ fontSize: '0.8rem', color: '#aaa', marginLeft: '5px' }}>({user.role})</span>
              </Typography>
              <Button variant="outlined" color="error" size="small" onClick={logout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
              Espace Membre
            </Button>
          )}
        </Box>
      </nav>

      <AuthModal open={modalOpen} handleClose={() => setModalOpen(false)} />

      <Box sx={{ p: 0 }}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;