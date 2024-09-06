import React from "react";

export default function Intentos(props){

    const { intentos } = props;

    return (<div className="Contador">
        <h2>Intentos:{intentos}</h2>
    </div>)
}