import BoutonInscription from "./BoutonInscription";
import ListeInscrits from "./ListeInscrits";    
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../Authentification";


export default function InscriptionSeance() {
  const { id } = useParams();
  const { user } = useAuth();
  const theme = useTheme();
  const [isSuscribed, setisSuscribed] = useState(false);
  const [liste, setListe] = useState(false);
  const [buttonText, setButtonText] = useState("S'inscrire");
 

  function handleHover() {
  	setListe(true);
  }

  function handleHoverOut() {
  	setListe(false);
  }
  function handleClick() {
    if (!isSuscribed) {
    setButtonText("Se désinscrire");
    setisSuscribed(true);
  }
  if (isSuscribed) {
    setButtonText("S'inscrire");
    setisSuscribed(false);
  }

  	
  }

    return  (
        <div>
            <BoutonInscription onMouseEnter={handleHover} onClick={handleClick} onMouseLeave={handleHoverOut} textButton={buttonText}/>
            {liste && <ListeInscrits/>}
          </div>
    )
    
}