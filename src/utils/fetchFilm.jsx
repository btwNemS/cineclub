import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useFilms() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { films, loading, error };
}