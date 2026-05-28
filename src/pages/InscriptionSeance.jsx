import { Button } from "@mui/material";
const API_URL = import.meta.env.VITE_API_URL;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../Authentification";


export default function InscriptionSeance() {
  const { id } = useParams();
  const { user } = useAuth();
  const theme = useTheme();
  const [inscrits, setInscrits] = useState([]);
  const [isSuscribed, setisSuscribed] = useState(false);
   const [liste, setListe] = useState(false);
 
  useEffect(() => {
    fetch(`${API_URL}/registrations/getRegistrationsByFilmId/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement du film");
        }

        return res.json();
      })
      .then((data) => {
        setInscrits(data);
      });
  }, [id]);

  function handleHover() {
  	setListe(true);
  }
  function handleClick() {
  	console.log("ça marche aussi");
  }

    return  (
        <div>
    <Button onMouseEnter={handleHover} onClick={handleClick}
              variant="outlined"
              color="secondary"
              target="_blank"
            >
              S'inscrire
            </Button>;
         
             {inscrits.map((inscrit) => (
                  <li>{inscrit.pseudo}</li>   
          ))}
          </div>
    )
    
}