import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdPerson } from "react-icons/md";
import { TextField, Button } from "@mui/material";

const Comments = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() !== "") {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  return (
    <div className="grid gap-2">
      <h3 className="text-lg font-semibold">¿Qué te pareció el curso?</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Comparte lo que piensas en la sección de comentarios.
      </p>
      <form className="grid gap-2" onSubmit={handleCommentSubmit}>
        <div>
          <TextField
            className="w-full min-h-[100px] text-sm"
            id="comment"
            placeholder="Escribe un comentario..."
            type="text"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>
        <br></br>
        <Button variant="contained" type="submit" style={{ width: "100%" }}>
          Publicar
        </Button>
      </form>
      <br></br>
      <div className="grid gap-4">
        <div className="flex items-center space-x-2">
          <div className="font-semibold">
            <MdPerson /> User 3
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Excited to start this course! Can't wait to learn more.
          </p>
        </div>
        <br></br>
        <div className="flex items-center space-x-2">
          <div className="font-semibold">
            <MdPerson /> User 4
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The content is fantastic. Enjoying every bit of it.
          </p>
        </div>
      </div>

      <div>
        <h2>Comments:</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={uuidv4()}>{comment}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Comments;
