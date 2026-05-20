import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Typography, Box } from '@mui/material';
import AddMovie from "../Components/addMovie";

export default function Backoffice() {
  return (
    <Box>
      <Typography variant="h1">Backoffice</Typography>
      <AddMovie />
    </Box>
  );
}
