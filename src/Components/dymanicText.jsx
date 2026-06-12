import React, { useEffect, useState } from 'react';
import apiFetch from "./tokencheck";

const API_URL = import.meta.env.VITE_API_URL;

const DynamicText = ({ role, fallback = "Chargement..." }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchText = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch(`${API_URL}/site_texts/getByRole/${role}`);
        
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        } else if (res.status === 404) {
          setContent("<p><i>Aucun contenu rédigé pour le moment.</i></p>");
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération du rôle [${role}] :`, error);
        setContent("<p style='color: red;'>Erreur de chargement du contenu.</p>");
      } finally {
        setIsLoading(false);
      }
    };

    if (role) {
      fetchText();
    }
  }, [role]); // Le useEffect se relance si le rôle change

  if (isLoading) return <p>{fallback}</p>;

  return (
    <div 
      className={`dynamic-text dynamic-text-${role}`}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
};

export default DynamicText;