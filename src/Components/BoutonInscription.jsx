import { Button } from "@mui/material";

export default function BoutonInscription({
  refreshListe,
  isSuscribed,
  id,
  API_URL,
  setHovered,
}) {
  const handleClick = async () => {
    try {
      if (!isSuscribed) {
        await fetch(`${API_URL}/registrations/protected/create/${id}`, {
          method: "POST",
          credentials: "include",
        });
        refreshListe();
      } else {
        await fetch(`${API_URL}/registrations/protected/delete/${id}`, {
          method: "POST",
          credentials: "include",
        });
        refreshListe();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'inscription:", error);
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
      <Button
        id="boutonInscription"
        variant="outlined"
        color="secondary"
        onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverOut}
      >
        {isSuscribed ? "Se désinscrire" : "S'inscrire"}
      </Button>
    </div>
  );
}
