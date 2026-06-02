import { useState } from "react";
import { TextField, Box, Button } from "@mui/material";

export default function CreatePost({ filmId, getRenderData }) {

    const [content, setContent] = useState("");

    const addPost = async () => {
        if (!content.trim()) return;

        const url = import.meta.env.VITE_API_URL + "/posts/protected/create";

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                content: content,
                film_id: filmId,
                answersTo: null 
            })
        });

        setContent("");
    };

    return (
        <Box sx={{ mb: 2 }}>
            <TextField
                size="small"
                placeholder="Commenter..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
            />

            <Button
                size="small" variant="outline" color="primary"
                sx={{
                    transition: "0.2s",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        backgroundColor: "#5F647A",
                        color: "#FFFFFF"
                    },
                }}
                onClick={async () => {
                    await addPost();
                    getRenderData();
                }}
                disabled={!content.trim()}
            >
                Envoyer
            </Button>
        </Box>
    );
}