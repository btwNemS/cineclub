import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export default function Home() {
  const ContainerStyle ={
    textAlign: "center", marginTop: "5vh" 
  }
  const DescriptionStyle={
     maxWidth: "600px", margin: "0 auto", mb: 4, color: "#333"
  }

  return (
    <div className="container" style={{ContainerStyle}}>
      {/* Titre principal */}
      <h1 className="title">Bienvenue au CinéClub </h1>
      
      {/* Description */}
      <Typography variant="h6" sx={{DescriptionStyle}}>
        Rejoignez notre communauté de passionnés de cinéma. Découvrez nos prochaines projections, 
        votez pour les suggestions et partagez votre avis sur les films passés !
      </Typography>

      {/* Boutons de navigation (Utilisation de Material UI que tu as déjà dans ton projet) */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap", mt: 4 }}>
        <Button 
          component={Link} 
          to="/filmProgrammed" 
          variant="contained" 
          color="primary" 
          size="large"
        >
           Films Prévus
        </Button>

        <Button 
          component={Link} 
          to="/filmSuggested" 
          variant="contained" 
          color="primary" 
          size="large"
        >
           Films Suggérés
        </Button>

        <Button 
          component={Link} 
          to="/filmPassed" 
          variant="contained" 
          color="primary" 
          size="large"
        >
           Archives (Films passés)
        </Button>
      </Box>
    </div>
  );
}