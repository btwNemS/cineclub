import { useState } from "react";

export default function Comment({ post }) {
  const [text, setText] = useState("");

  const sendComment = async (parentId = null) => {

    await fetch("https://rasantacruz.fr/cineclub/posts/protected/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        content: text,
        film_id: filmId,
        answersTo:parentId 
      })
    });

    setText("");
  };

  return (

    <div>
        <p>{post.content}</p>

        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Commenter"
        />

        <button onClick={() => sendComment(post.id)}>
          Répondre
        </button>
      </div>
  );

}