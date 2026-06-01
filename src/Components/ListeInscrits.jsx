const API_URL = import.meta.env.VITE_API_URL;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../Authentification";


export default function ListeInscrits() {
  const { id } = useParams();
  const { user } = useAuth();
  const theme = useTheme();
  const [inscrits, setInscrits] = useState([]);
 
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



    return  (
        <div>
             {inscrits.map((inscrit) => (
                  <li>{inscrit.pseudo}</li>   
          ))}
          </div>
    )
    
}