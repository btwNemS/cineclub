import { lazy, Suspense, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Editor = lazy(() => import("./dependancies/Editor"));

const API_URL = import.meta.env.VITE_API_URL;

// Rôles connus du site (route /protected/getAll évitée volontairement).
// L'ordre ici définit l'ordre d'affichage.
const ROLES = [
  { role: "home_intro", label: "Présentation de la page d'accueil" },
  { role: "competition_intro", label: "Présentation de la page compétition" },
];

// Vrai si le HTML ne contient aucun texte visible (ex. "" ou "<p><br></p>").
const isBlankHtml = (html) =>
  !html || html.replace(/<[^>]*>/g, "").replace(/\s| /g, "") === "";

const ModifyText = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Texte en cours d'édition (null = vue liste).
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  // Charge chaque rôle connu via la route publique getByRole.
  const fetchTexts = async () => {
    try {
      setLoading(true);
      const results = await Promise.all(
        ROLES.map(async ({ role, label }) => {
          try {
            const res = await fetch(`${API_URL}/site_texts/getByRole/${role}`);
            if (res.ok) {
              const data = await res.json();
              return { role, label, content: data.content || "" };
            }
            // 404 = rôle pas encore rédigé : on l'affiche quand même, vide.
            return { role, label, content: "" };
          } catch {
            return { role, label, content: "" };
          }
        })
      );
      setTexts(results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const openEditor = (text) => {
    setSelected(text);
    setDraft(text.content || "");
    setFeedback(null);
  };

  const closeEditor = () => {
    setSelected(null);
    setDraft("");
  };

  const save = async () => {
    if (isBlankHtml(draft)) {
      setFeedback({
        severity: "error",
        message: "Le contenu ne peut pas être vide.",
      });
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/site_texts/protected/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: selected.role, content: draft }),
      });
      if (res.status === 401 || res.status === 403) {
        setFeedback({
          severity: "error",
          message:
            "Accès refusé : session expirée ou droits insuffisants. Reconnectez-vous en tant qu'administrateur.",
        });
        return;
      }
      if (res.status === 400) {
        setFeedback({
          severity: "error",
          message: "Contenu manquant ou invalide : le texte n'a pas été enregistré.",
        });
        return;
      }
      if (!res.ok) {
        setFeedback({
          severity: "error",
          message: "Erreur lors de l'enregistrement du texte.",
        });
        return;
      }
      setFeedback({ severity: "success", message: "Texte enregistré !" });
      // Met à jour la liste locale puis revient à la liste.
      setTexts((prev) =>
        prev.map((t) =>
          t.role === selected.role ? { ...t, content: draft } : t
        )
      );
      closeEditor();
    } catch {
      setFeedback({
        severity: "error",
        message: "Impossible de contacter le serveur.",
      });
    } finally {
      setSaving(false);
    }
  };

  const feedbackAlert = feedback && (
    <Alert
      severity={feedback.severity}
      onClose={() => setFeedback(null)}
      sx={{ mb: 2 }}
    >
      <AlertTitle>
        {feedback.severity === "success" ? "Succès" : "Erreur"}
      </AlertTitle>
      {feedback.message}
    </Alert>
  );

  // ---- Vue édition ----
  if (selected) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={closeEditor}
          sx={{ alignSelf: "flex-start" }}
        >
          ← Retour à la liste
        </Button>

        {feedbackAlert}

        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {selected.label}
        </Typography>
       
        <Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>}>
          <Editor
            key={selected.role}
            initialHtml={selected.content}
            onChange={setDraft}
            placeholder={
              selected.content.replace(/<[^>]*>/g, "").trim() ||
              `Saisissez le contenu pour le rôle "${selected.role}" (${selected.label})...`
            }
          />
        </Suspense>

        <Button
          variant="contained"
          onClick={save}
          disabled={saving}
          sx={{ alignSelf: "flex-start" }}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </Box>
    );
  }

  // ---- Vue liste ----
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Modifier les textes du site
      </Typography>

      {feedbackAlert}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined">
          <List disablePadding>
            {texts.map((text) => (
              <ListItemButton
                key={text.role}
                onClick={() => openEditor(text)}
                divider
              >
                <ListItemText
                  primary={text.label}
                  secondary={
                    text.content
                      ? text.content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() || "Contenu non défini"
                      : "Contenu non défini"
                  }
                />
                <EditIcon color="action" />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default ModifyText;
