import { useEffect, useState } from "react";
 
const API_URL = import.meta.env.VITE_API_URL;


export default function ListFilm() {

   const [films, setFilms] = useState([]);
  
    useEffect(() => {
      fetch(`${API_URL}/films/getAll`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Erreur lors du chargement des films");
          }
  
          return res.json();
        })
        .then((data) => {
          setFilms(data);
        });
    }, []);
  
  return <h1>Liste des films</h1>;
}

