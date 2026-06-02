import { useState } from "react";

// Extrait l'ID YouTube depuis tous les formats courants :
// - https://www.youtube.com/watch?v=VIDEO_ID
// - https://youtu.be/VIDEO_ID
// - https://www.youtube.com/embed/VIDEO_ID
// - https://www.youtube.com/shorts/VIDEO_ID
function extractVideoId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // Format watch?v=
    const v = parsed.searchParams.get("v");
    if (v) return v;
    // Formats youtu.be/, /embed/, /shorts/
    const match = parsed.pathname.match(/\/(?:embed\/|shorts\/|)([A-Za-z0-9_-]{11})/);
    if (match) return match[1];
    return null;
  } catch {
    // URL invalide
    return null;
  }
}

export default function YouTubeEmbed({ url }) {
  const [muted, setMuted] = useState(true);

  if (!url) return null;

  const videoId = extractVideoId(url);

  if (!videoId) {
    return (
      <p style={{ padding: "16px", color: "#888" }}>
        Lien YouTube invalide.
      </p>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        title="YouTube video"
      />
    </div>
  );
}
