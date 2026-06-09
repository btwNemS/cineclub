import {
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { useAuth } from "../Authentification";
import { useState } from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';




export default function BoutonLike({
    refreshListe,
    id,
    API_URL,
    hasLiked,
    setHovered,
}) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleClick = async () => {
        if (!user) {
            setOpen(true);
            return;
        }
        else {
            try {
                await fetch(`${API_URL}/likes/protected/toggle/${id}`, {
                    method: "POST",
                    credentials: "include"
                });
                refreshListe();
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'inscription:", error);
            }
        }
    };

    function handleHover() {
        setHovered(true);
    }

    function handleHoverOut() {
        setHovered(false);
    }

    return (
        <div>
            <IconButton
                id="boutonInscription"
                variant="outlined"
                onClick={handleClick}
                onMouseEnter={handleHover}
                onMouseLeave={handleHoverOut}
                color={hasLiked ? "secondary" : "default"}
            >
                <ThumbUpIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Veuillez vous connecter</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vous devez vous connecter pour pouvoir liker un film.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
