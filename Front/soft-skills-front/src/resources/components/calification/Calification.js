import React, { useState } from "react";

const QuestionRating = ({ questionId, courseId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0); // Estado para la calificación

  const handleSubmit = (event) => {
    event.preventDefault();
    onRatingSubmit(questionId, courseId, rating); // Enviar calificación
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Calificación (1-5):</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(event) => setRating(parseInt(event.target.value))}
      />
      <button variant="contained" type="submit" style={{ width: "100%" }}>
        Calificar
      </button>
    </form>
  );
};

export default QuestionRating;
