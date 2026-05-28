import { Button } from "@mui/material";

export default function BoutonInscription() {
    return  (
        <div>
    <Button onMouseEnter={handleHover} onClick={handleClick}
              variant="outlined"
              color="secondary"
              target="_blank"
            >
              S'inscrire
            </Button>;
         
   
          </div>
    )
    
}