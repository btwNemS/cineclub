import { useState } from 'react';
// IMPORT CORRIGÉ : Pas d'accolades car c'est un "export default", et Majuscule
import SearchCompetitor from './searchCompetitor'; 
import { Typography, Box, Button, Stack, Paper } from '@mui/material';

export default function AddCompetition() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        Créer ou Modifier une Compétition
      </Typography>
      
      <Stack spacing={4}>
        <Stack direction="row" spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                width: 300,
                aspectRatio: '9/16', // J'ai mis 9/16 entre guillemets, c'est plus sûr en CSS in JS
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: '0.2s',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              {/* UTILISATION CORRIGÉE : Majuscule et balise auto-fermante */}
              <SearchCompetitor />
            </Paper>
          ))}
        </Stack>

        <Box>
          <Button variant="contained" color="primary">
            Enregistrer
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}