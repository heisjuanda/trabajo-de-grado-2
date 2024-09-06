import React, { useState, useEffect} from "react";
import addNotification from 'react-push-notification';

export default function Notificaciones(props){

    const [ activo, setActivo] = useState(true);

    const info = {
        title: "Serpiente Eisenhower",
        message:"",
        duration: 20000,
        native: true,
    }

    const mensajes = ["Vas muy bien, no te distraigas.", "revisa bien el tiempo que te queda.", "Cuantos puntos tienes, creo que romperas algun record.", "¿Te esta gustando la actividad?"]


    const accion = ()=>{
        setActivo(!activo);
    }

    useEffect(()=>{
        const index = Math.floor(Math.random() * mensajes.length)
        const tiempo = Math.floor(Math.random() * 20) * 40000;
        const id = setInterval(()=>{
            if(!activo){
                setActivo(true);
            }
            if(activo){
                addNotification({
                    ...info,
                    message: mensajes[index],
                })
            }
        }, tiempo)

        return () => {
            clearInterval(id);
        }
    })

    return (
        <div className="BotonNotificaciones">
            <button onClick={accion}>Notificaciones: {activo ? ("On") : ("Off")}</button>
        </div>
    )
}