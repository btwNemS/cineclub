import { useState } from "react";

export default function YouTubeEmbed({ url }) {
  const [muted, setMuted] = useState(true);

  if (!url) return null;

  const videoId = new URL(url).searchParams.get("v");

  if (!videoId) return <p>URL invalide</p>;

  return (
    <div style={{ position: "relative", width: "70%", height: "100%" }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}`}
        allow="autoplay"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: 0 }}
      />

      <button
        onClick={() => setMuted((m) => !m)}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          padding: "10px 15px",
          zIndex: 10,
        }}
      >
        {muted ? "Activer le son" : "Couper le son"}
      </button>
    </div>
  );
}