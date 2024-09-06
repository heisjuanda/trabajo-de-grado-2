import React, { useEffect } from 'react';

const Hercules = () => {
  useEffect(() => {
    // Asegúrate de que el script se carga solo una vez
    if (!document.querySelector('script[src="/publicResource/customactivities/mindset/hercules.js"]')) {
      const scriptGODOT = document.createElement('script');
      scriptGODOT.src = `/publicResource/customactivities/mindset/hercules.js`;
      scriptGODOT.async = true;
      document.body.appendChild(scriptGODOT);

      return () => {
        // Limpia el script cuando el componente se desmonte
        document.body.removeChild(scriptGODOT);
      };
    }
  }, []);

  return (
    <div>
      <iframe
        src={`/publicResource/customactivities/mindset/hercules.html`}
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="Godot Game"
      />
    </div>
  );
};

export default Hercules;
