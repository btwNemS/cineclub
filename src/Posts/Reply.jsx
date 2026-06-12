import { useState } from "react";
import { TextField, Box, Button } from "@mui/material";
import apiFetch from "../Components/tokencheck";

export default function Reply({ filmId, postId, getRenderData }) {

    const [content, setContent] = useState("");

    const addReply = async () => {
        if (!content.trim()) return;

        const url = import.meta.env.VITE_API_URL + "/posts/protected/create";
        console.log({ content: content, film_id: filmId, answersTo: postId });

        const response = await apiFetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ content: content, film_id: filmId, answersTo: postId })
        });

        getRenderData();
        setContent("");

    };

    return (
        <Box >
            <TextField
                size="small"
                placeholder="Votre réponse..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
            />

            <Button
                size="small" color="primary"
                sx={{
                    transition: "0.2s",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        backgroundColor: "#5F647A",
                        color: "#FFFFFF"
                    },
                }}
                onClick={async () => {
                    await addReply();
                    getRenderData();
                }}
                disabled={!content.trim()}
            >
                Envoyer
            </Button>
        </Box>

    )
}