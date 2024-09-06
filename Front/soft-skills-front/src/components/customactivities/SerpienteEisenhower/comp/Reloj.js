import React, { useEffect, useState } from "react";

export default function Reloj(props){

    const { tiempo , interruptor } = props;

    const [ minutos, setMinutos ] = useState(tiempo);
    const [ segundos, setSegundos] = useState(0);


    useEffect(()=>{
        const inicio = setInterval(()=>{
            if(interruptor){
                if(segundos === 0 && minutos > 0){
                    setMinutos(minutos - 1);
                    setSegundos(59);
                }else if(segundos > 0){
                    setSegundos(segundos - 1);
                }else if(segundos === 0){

                }
            }else{
                setMinutos(tiempo);
                setSegundos(0);
            }
        },1000)
    
        return () => {
            clearInterval(inicio)
        };
    },[segundos,minutos,interruptor,tiempo])

    return(
        <div className="Reloj">
            <h1>
                {minutos}:{segundos}
            </h1>
        </div>
    )
}