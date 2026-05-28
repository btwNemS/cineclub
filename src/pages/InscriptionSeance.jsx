import { Button } from "@mui/material";
const API_URL = import.meta.env.VITE_API_URL;

export default function InscriptionSeance() {
  const { id } = useParams();
  const { user } = useAuth();
  const theme = useTheme();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/registrations/getRegistrationsByFilmId/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement du film");
        }

        return res.json();
      })
      .then((data) => {
        setFilm(data);
      });
  }, [id]);

    return  <Button
              variant="outlined"
              color="secondary"
              target="_blank"
            >
              S'inscrire
            </Button>;
}