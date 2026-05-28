import { Button } from "@mui/material";

export default function BoutonInscription({ onMouseEnter, onClick, onMouseLeave }) {
    return (
        <div>
            <Button id='boutonInscription'
                variant="outlined"
                color="secondary"
                target="_blank"
                onMouseEnter={onMouseEnter}
                onClick={onClick}
                onMouseLeave={onMouseLeave}
            >
                S'inscrire
            </Button>


        </div>
    )

}