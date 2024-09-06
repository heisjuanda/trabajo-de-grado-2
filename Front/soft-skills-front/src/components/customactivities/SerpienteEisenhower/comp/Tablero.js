import React, {  useEffect, useRef } from "react";

export default function Tablero(props){

    const { serpiente , mapa, frutos } = props;

    const ref = useRef()

    const pintar = async()=>{
        if( typeof ref.current !== "undefined" && ref.current !== null){

            const canvas = ref.current.getContext('2d');

            let ancho = Math.floor(canvas.canvas.width / mapa.tamano.ancho);
            let alto  = Math.floor(canvas.canvas.height / mapa.tamano.alto);

            canvas.fillStyle = 'gray';
            canvas.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);

            const hayFrutos = frutos.length > 0;
            if(hayFrutos){
                frutos.map((elemento) => {
                    let color = ['yellow','red','green','cyan']
                    canvas.fillStyle = color[elemento.tipo] ;
                    let x1 = elemento.posicion.x * ancho; 
                    let y1 = elemento.posicion.y * alto;
                    canvas.fillRect(x1,y1,ancho,alto);
                    return(0)
                })
            }

            canvas.fillStyle = 'green';
            let x1 = serpiente.cabeza[0] * ancho;
            let y1 = serpiente.cabeza[1] * alto;
            canvas.fillRect(x1,y1,ancho,alto);

            const hayCola = serpiente.cola.length > 0;
            if(hayCola){
                serpiente.cola.map((elemento) => {
                    let x1 = elemento[0] * ancho; 
                    let y1 = elemento[1] * alto;
                    canvas.fillRect(x1,y1,ancho,alto);
                    return(0)
                })
            }

            
        }
    }

    useEffect(()=>{
        pintar()
    })

    return (
        <div id="Tablero">
        <canvas ref={ref} ></canvas>
        </div>
    )
}