import { useState } from "react";

function addReplyToTree(tree, parentId, newComment) {
  return tree.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        children: [...comment.children, newComment],
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

export function Comment({ content, children = [], level, post, filmId, setComments }) {
  const [text, setText] = useState("");

  const sendComment = async (parentId) => {
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
    <>
      <p style={{ marginLeft: `${level * 30}px` }}>{content}</p>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Commenter"
        style={{ marginLeft: `${level * 30}px` }}
      />

      <button onClick={() => sendComment(post.id)}>
        Répondre
      </button>

      {children.map((child) => (
        <Comment
          key={child.id}
          content={child.content}
          children={child.children}
          level={level + 1}
          post={child}
          filmId={filmId}
          setComments={setComments}
        />
      ))}
    </>
  );
}

export default Comment;