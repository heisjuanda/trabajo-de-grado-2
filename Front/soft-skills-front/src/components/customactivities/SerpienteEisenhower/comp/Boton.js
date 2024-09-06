import React from "react";

export default function Boton(props){

    const { handler , texto} = props;

    return (
        <button className="Boton" onClick={handler}>
            {texto}
        </button>
    )
}