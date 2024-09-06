import React from "react";

export default function Marcador(props){

    const { puntaje } = props;

    return (<div className="Marcador">
        <h1 className="Numero">Puntos: {puntaje}</h1>
    </div>)
}