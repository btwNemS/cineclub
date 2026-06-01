import { Button } from "@mui/material";

export default function BoutonInscription({ onMouseEnter, onClick, onMouseLeave, textButton }) {
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
                {textButton}
            </Button>


        </div>
    )

}