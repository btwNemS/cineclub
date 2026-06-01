import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Typography, Box } from '@mui/material';
import AddMovie from "../Components/AddMovie";
import { useAuth } from "../Authentification";
import AuthModal from "../AuthModal";



export default function Backoffice() {
    const { user } = useAuth();
    return (
      <>
        {user?.role !== "ADMIN" && (
          <Box sx={{ p: 4 ,textAlign: "center"}}>
            <Typography variant="h4" color="error">
              Accès restreint
            </Typography>
            <Typography variant="body1">
              Vous devez être administrateur pour accéder à cette page.
            </Typography>
          </Box>
        )}
        {user?.role === "ADMIN" && (
          <Box>
            <AddMovie />
          </Box>
        )}
      </>
    );
}