import BoutonInscription from "./BoutonInscription";
import ListeInscrits from "./ListeInscrits";    
import { useEffect, useState } from "react";
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
  	console.log("ça marche aussi");
  }

    return  (
        <div>
            <BoutonInscription onMouseEnter={handleHover} onClick={handleClick} onMouseLeave={handleHoverOut}/>
            {liste && <ListeInscrits/>}
          </div>
    )
    
}