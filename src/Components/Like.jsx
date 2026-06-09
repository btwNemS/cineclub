import BoutonLike from "./buttonLike";
import ListeLikes from "./listeLikes";
import { useState, useEffect } from "react";
import { useAuth } from "../Authentification";

export default function Liker({postId}) { //pour avoir l'id du post et pas du film
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useAuth();
  console.log(user);
  const [liste, setListe] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const refreshListe = async () => {
    try {
      const response = await fetch(
        `${API_URL}/likes/getlikesByPostId/${postId}`,
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
    if (postId) {
        refreshListe();
    }
  }, [user, postId]);//si on met pas postId ça peut faire des erreurs avec réponses aux commentaires
  //si on met pas user et qu'on se déconnecte après avoir liké , ça refresh pas 

  return (
    <div>
      <BoutonLike
        setHovered={setHovered}
        refreshListe={refreshListe}
        id={postId}
        API_URL={API_URL}
        hasLiked={hasLiked}
      />
      {liste && (
        <ListeLikes liste={liste} hovered={hovered}/>
      )}
    </div>
  );
}