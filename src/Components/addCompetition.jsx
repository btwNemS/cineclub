import { useState } from 'react';
import { Typography, Box, Button, Stack } from '@mui/material';

export default function AddCompetition() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        Créer ou Modifier une Compétition
      </Typography>
      <Stack spacing={2}>
        {/* Formulaire pour ajouter ou modifier une compétition */}
        <Item>+</Item>
        <Item>+</Item>
        <Item>+</Item>
        <Item>+</Item>
        <Item>+</Item>
        <Button variant="contained" color="primary">
          Enregistrer
        </Button>
      </Stack>
    </Box>
  );
}