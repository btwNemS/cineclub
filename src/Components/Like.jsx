import BoutonLike from "./buttonLike";
import ListeLikes from "./listeLikes";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Authentification";

export default function Liker() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const { user } = useAuth();
  console.log(user);
  const [liste, setListe] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const refreshListe = async () => {
    try {
      const response = await fetch(
        `${API_URL}/likes/getlikesByPostId/${id}`,
      );
      const data = await response.json();
      console.log(data);
      setListe(data);

      const pseudoList = data.map((inscrit) => inscrit.pseudo);
      console.log(pseudoList);
      if (user && pseudoList.includes(user.pseudo)) {
        setHasLiked(true);
      }
      else {
        setHasLiked(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des inscrits:", error);
    }
  };

  useEffect(() => {
    refreshListe();
    console.log("liste mise à jour :", liste);
  }, [user]);

  return (
    <div>
      <BoutonLike
        setHovered={setHovered}
        refreshListe={refreshListe}
        id={id}
        API_URL={API_URL}
        hasLiked={hasLiked}
      />
      {liste && (
        <ListeLikes liste={liste} hovered={hovered}/>
      )}
    </div>
  );
}