import React from "react";

export default function Espera(props) {

    const { mensaje } = props;

    return(
        <div className="Componente-Espera">

            <h1>Cargando</h1>
            <p>{mensaje} </p>
        </div>
    );
}