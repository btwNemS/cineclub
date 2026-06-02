import { Button } from "@mui/material";
import { useEffect } from "react";

export default function BoutonInscription({
  refreshListe,
  isSuscribed,
  id,
  API_URL,
}) {
  const handleClick = async () => {
    try {
      if (!isSuscribed) {
        await fetch(`${API_URL}/registrations/protected/create/${id}`, {
          method: "POST",
          credentials: "include",
        });
        refreshListe();
      } else {
        await fetch(`${API_URL}/registrations/protected/delete/${id}`, {
          method: "POST",
          credentials: "include",
        });
        refreshListe();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'inscription:", error);
    }
  };

  // useEffect(() => {
  //   handleClick();
  // }, [isSuscribed]);

  return (
    <div>
      <Button
        id="boutonInscription"
        variant="outlined"
        color="secondary"        
        onClick={handleClick}
        
      >
        {isSuscribed ? "Se désinscrire" : "S'inscrire"}
      </Button>
    </div>
  );
}
