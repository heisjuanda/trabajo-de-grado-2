import React from "react";

export default function Valores(props){

    const { valores } = props;

    return (<div className="Valores">
        <div className="Urgente"></div>
        <h2 className="Valor">{valores[0]}</h2>
        <div className="UrgenteImportante"></div>
        <h2 className="Valor">{valores[1]}</h2>
        <div className="Importante"></div>
        <h2 className="Valor">{valores[2]}</h2>
        <div className="NoImportante"></div>
        <h2 className="Valor">{valores[3]}</h2>
    </div>)
}