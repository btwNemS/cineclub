import { useEffect, useState } from "react";
import { Box, Rating, Typography, Stack } from "@mui/material";
import { useAuth } from "../Authentification";

const API_URL = import.meta.env.VITE_API_URL;

export default function Vote({ filmId }) {
    const { user } = useAuth();    
    const [moyenne, setMoyenne] = useState(0);
    const [noteUtilisateur, setNoteUtilisateur] = useState(0);

    async function getScore() {
        if (!user) {
            setNoteUtilisateur(0);
            return;
        }

        const url = `${API_URL}/scores/protected/getUserScoreForFilm`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ filmId: parseInt(filmId) })
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.score !== null && data.score !== undefined) {
                setNoteUtilisateur(data.score);
            } else {
                setNoteUtilisateur(0); 
            }
        }
    }

    async function getMoyenne() {
        const url = `${API_URL}/films/get/${filmId}`;
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            setMoyenne(data.moyenne || data.average_score || 0);
        }
    }

    useEffect(() => {
        getMoyenne();
        getScore();
    }, [user, filmId]);

    const handleVote = async (event, newValue) => {
        if (!user || !newValue) return; 

        setNoteUtilisateur(newValue);

        const url = `${API_URL}/scores/protected/create`;
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ filmId: parseInt(filmId), score: newValue })
        });

        getMoyenne();
    }

    return (
        <Box sx={{ margin: 3, padding: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, display: "flex", flexDirection: "row", alignItems: "center", spacing: 1, mb: 2 }}>
            {/* Note globale (Lecture seule) */}
            <Stack >
                <Typography variant="h6" color="text.primary">Moyenne :</Typography>
                <Rating value={moyenne} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                    ({moyenne ? parseFloat(moyenne).toFixed(1) : 0} / 5)
                </Typography>
            </Stack>

            {/* Note de l'utilisateur  */}
            <Stack sx={{ direction: "row", alignItems: "center", spacing: 2 }}>
                <Typography variant="body1" color="text.primary">
                    {user ? "Votre note :" : "Connectez-vous pour noter ce film :"}
                </Typography>
                <Rating
                    name="user-vote"
                    value={noteUtilisateur}
                    onChange={(event, newValue) => handleVote(event, newValue)}
                    disabled={!user}
                />
            </Stack>
        </Box>
    );
}