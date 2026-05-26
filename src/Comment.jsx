import { useState } from "react";

function addReplyToTree(tree, parentId, newComment) {
  return tree.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        children: [...(comment.children || []), newComment],
      };
    }

    if (comment.children?.length) {
      return {
        ...comment,
        children: addReplyToTree(comment.children, parentId, newComment),
      };
    }

    return comment;
  });
}

export default function Comment({
  post,
  content,
  children = [],
  level,
  filmId,
  setComments,
}) {
  const [text, setText] = useState("");

  const sendReply = async (parentId) => {
    if (!text.trim()) return;

    const res = await fetch(
      "https://rasantacruz.fr/cineclub/posts/protected/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: text,
          film_id: filmId,
          answersTo: parentId,
        }),
      }
    );

    const newComment = await res.json();

    setComments((prev) =>
      addReplyToTree(prev, parentId, {
        ...newComment,
        children: [],
      })
    );

    setText("");
  };

  return (
    <div>
      <p style={{ marginLeft: `${level * 30}px` }}>{content}</p>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Répondre..."
        style={{ marginLeft: `${level * 30}px` }}
      />

      <button onClick={() => sendReply(post.id)}>
        Répondre
      </button>

      {children.map((child) => (
        <Comment
          key={child.id}
          post={child}
          content={child.content}
          children={child.children}
          level={level + 1}
          filmId={filmId}
          setComments={setComments}
        />
      ))}
    </div>
  );
}