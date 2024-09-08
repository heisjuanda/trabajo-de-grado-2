import React, { useEffect } from 'react';

const Hercules = () => {
  useEffect(() => {
    // Redirige al enlace externo
    window.location.href = 'https://jca1523.itch.io/mindset';
  }, []);

  return (
    <div>
      {/* Puedes agregar un mensaje opcional o una indicación para el usuario si lo deseas */}
      <p>Redirigiendo a la página del juego...</p>
    </div>
  );
};

export default Hercules;
