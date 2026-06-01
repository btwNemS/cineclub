import BoutonInscription from "./BoutonInscription";
import ListeInscrits from "./ListeInscrits";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../Authentification";

export default function InscriptionSeance() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const { user } = useAuth(); 
  const theme = useTheme();
  const [isSuscribed, setisSuscribed] = useState(false);
  const [liste, setListe] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [buttonText, setButtonText] = useState("S'inscrire");
  const getListe = async () => {
    try {
      const response = await fetch(
        `${API_URL}/registrations/getRegistrationsByFilmId/${id}`,
      );
      const data = await response.json();
      setListe(data);      
      const pseudoList = data.map((inscrit) => inscrit.pseudo);
      if (pseudoList.includes(user.pseudo)) {
        setButtonText("Se désinscrire");
        setisSuscribed(true);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des inscrits:", error);
    }
  };

  useEffect(() => {
    getListe();
  }, []);

  function handleHover() {
    setHovered(true);
  }

  function handleHoverOut() {
    setHovered(false);
  }
  function handleClick() {
    if (!isSuscribed) {
      getListe();
      setButtonText("Se désinscrire");
      setisSuscribed(true);
    }
    if (isSuscribed) {
      setButtonText("S'inscrire");
      setisSuscribed(false);
    }
  }

  return (
    <div>
      <BoutonInscription
        onMouseEnter={handleHover}
        onClick={handleClick}
        onMouseLeave={handleHoverOut}
        textButton={buttonText}
        isSuscribed={isSuscribed}
        
      />
      {liste && (
        <ListeInscrits liste={liste} getListe={getListe} hovered={hovered} />
      )}
    </div>
  );
}
