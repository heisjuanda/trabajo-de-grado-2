import React from "react";


export default function BotonTrampa(props){

    const {puntaje, setPuntaje} = props;

    return (
        <div className="BotonTrampa">
            <h4>Duplica tu puntaje!!</h4>
            <button onClick={()=>setPuntaje(puntaje / 2)}>Click aquí!</button>
        </div>
    )

};