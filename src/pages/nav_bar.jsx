import { useTheme } from "@mui/material/styles";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

import LogoCine  from "../images/logocineclub.png";

import { useAuth } from "../Authentification";
import AuthModal from "../AuthModal";

// On récupère proprement les props envoyées par App.jsx
function Layout({ isDarkMode, toggleTheme }) {
  const { user, logout, authModalOpen, openAuthModal, closeAuthModal } = useAuth();

  const navigate = useNavigate();
  const theme = useTheme();

  const Deconnecter = async () => {
    await logout();
    navigate("/");
  };

  const navLinkStyle = {
    color: theme.palette.text.primary,
    textDecoration: "none",
    fontWeight: 600,
    transition: "0.2s ease",
    display: "flex",
    alignItems: "center",
  };

  return (
    <>
      <Box
        component="nav"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1001,
          px: 4,
          py: 2,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4],
        }}
      >
        <Box
          component="ul"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            listStyle: "none",
            fontFamily: "marcellus",
            fontSize: "20px",
            m: 0,
            p: 0,
          }}
        >
          {[
            { 
              to: "/", 
              label: (
                <Box
                  component="img"
                  src={LogoCine}
                  alt="Home Logo"
                  sx={{
                    height: "70px",      
                    width: "auto",      
                    display: "block",
                    transition: "transform 0.2s, filter 0.2s",
                    // Applique l'inversion de couleur à 100% uniquement si le thème dark est actif
                    filter: isDarkMode ? "invert(100%)" : "none",
                    "&:hover": {
                      transform: "scale(1.05)", 
                    }
                  }}
                />
              ) 
            },
            { to: "/filmPassed", label: "Films passés" },
            { to: "/filmProgrammed", label: "Films prévus" },
            { to: "/Concours", label: "Concours" },
          ].map((item) => (
            <Box component="li" key={item.to} sx={{ display: "flex", alignItems: "center" }}>
              <Link to={item.to} style={navLinkStyle}>
                {item.label}
              </Link>
            </Box>
          ))}

          {user?.role === "ADMIN" && (
            <Box component="li">
              <Link
                to="/backoffice"
                style={{
                  textDecoration: "none",
                  color: theme.palette.secondary.main,
                  fontWeight: 700,
                }}
              >
                Panneau Admin
              </Link>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Le bouton utilise la fonction et l'état reçus d'App.jsx */}
          <Button 
            onClick={toggleTheme} 
            sx={{ fontSize: "1.2rem", minWidth: "auto", px: 1 }}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </Button>

          {user ? (
            <>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                Bonjour{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.secondary.main,
                  }}
                >
                  {user.pseudo}
                </Box>
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.8rem",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {user?.role === "ADMIN" && `(Admin)`}
                </Box>
              </Typography>

              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={Deconnecter}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => openAuthModal()}
              sx={{
                // Assure un contraste parfait du texte du bouton selon la couleur de fond générée par le thème
                color: theme.palette.secondary.contrastText,
                fontWeight: "bold"
              }}
            >
              Espace Membre
            </Button>
          )}
        </Box>
      </Box>

      <AuthModal open={authModalOpen} handleClose={closeAuthModal} />

      <Box sx={{ p: 0 }}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;