import React from "react";

export default function PanelInferior(props){

    const { salario , saldo } = props;

    return (
        <div className="Panel-Inferior">
            <p>Salario: {salario}</p>
            <p>Saldo: {saldo}</p>
        </div>
    )
}