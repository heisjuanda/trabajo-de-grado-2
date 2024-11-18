import React, { useEffect } from 'react';

const Hercules = () => {
  useEffect(() => {
    // Redirige al enlace externo
    window.location.href = 'https://jca1523.itch.io/mindset';
  }, []);

  return (
    <div>
      {}
      <p>Redirigiendo a la página del juego...</p>
    </div>
  );
};

export default Hercules;
