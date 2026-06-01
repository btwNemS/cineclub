

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../Authentification";


export default function ListeInscrits({liste, getListe, hovered}) {
  const { id } = useParams();
  const { user } = useAuth();
  const theme = useTheme();
  

 


    return  (
        <div>
             {liste.map((inscrit) => (
                  <li key={inscrit.id}>{inscrit.pseudo}</li>   
          ))}
          </div>
    )
    
}