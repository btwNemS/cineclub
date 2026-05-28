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
 

  function handleHover() {
  	setListe(true);
  }

  function handleHoverOut() {
  	setListe(false);
  }
  function handleClick() {
    if (!isSuscribed) {
         document.getElementById('boutonInscription').textContent = "S'inscrire";
        setisSuscribed(true);
    }
    if (isSuscribed) {
        document.getElementById('boutonInscription').textContent = 'Se désinscrire';
        setisSuscribed(false);
    }
  	
  }

    return  (
        <div>
            <BoutonInscription onMouseEnter={handleHover} onClick={handleClick} onMouseLeave={handleHoverOut}/>
            {liste && <ListeInscrits/>}
          </div>
    )
    
}