import React, { createContext, useContext, useRef, useEffect, useState } from 'react';

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const canvas2Ref = useRef(null);
  const [ctx2, setCtx2] = useState(null);

  useEffect(() => {
    if (canvas2Ref.current && !ctx2) {
      const context = canvas2Ref.current.getContext('2d');
      setCtx2(context);
    }
  }, [canvas2Ref, ctx2]);

  return (
    <CanvasContext.Provider value={{ canvas2Ref, ctx2 }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);