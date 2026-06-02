import { useState } from 'react';
import { Typography, Box, Button, Stack, Paper } from '@mui/material';

export default function AddCompetition() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        Créer ou Modifier une Compétition
      </Typography>
      
      <Stack spacing={4}>
        
        <Stack direction="row" spacing={2}>
          {/* On crée un tableau de 5 éléments pour éviter de copier/coller 5 fois le même code */}
          {[...Array(5)].map((_, index) => (
            <Paper
              key={index}
              elevation={2} // Ajoute une légère ombre
              sx={{
                width: 300,
                aspectRatio: 9 / 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',    // Taille du "+"
                cursor: 'pointer',   // Curseur cliquable
                transition: '0.2s',
                '&:hover': {
                  backgroundColor: '#f5f5f5', // Effet au survol
                }
              }}
            >
              <Button>+</Button>
            </Paper>
          ))}
        </Stack>

        {/* Bouton Enregistrer */}
        <Box>
          <Button variant="contained" color="primary">
            Enregistrer
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}