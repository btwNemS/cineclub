import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

import LogoCine  from "../images/logocineclub.png";

import { useAuth } from "../Authentification";
import AuthModal from "../AuthModal";

function Layout() {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

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
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)", 
                    }
                  }}
                />
              ) 
            },
            { to: "/filmPassed", label: "Films passés" },
            { to: "/filmProgrammed", label: "Films prévus" },
            { to: "/filmSuggested", label: "Films suggérés" },
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
                ⚙️ Panneau Admin
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
              color="primary"
              onClick={() => setModalOpen(true)}
            >
              Espace Membre
            </Button>
          )}
        </Box>
      </Box>

      <AuthModal open={modalOpen} handleClose={() => setModalOpen(false)} />

      <Box sx={{ p: 0 }}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;