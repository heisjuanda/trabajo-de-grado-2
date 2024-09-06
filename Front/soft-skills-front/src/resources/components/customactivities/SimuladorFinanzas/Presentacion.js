import React from "react";

export default function presentacion(props){

    const { activity, comenzar } = props;
    const { title, objective, metodology, resources, introduction} = activity;

    return (
        <div
        className="Contenedor-Presentacion"
        >
        <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {title}
            </h1>
            <h3>Objetivo</h3>
            {objective}
            <h3>Metodología</h3>
            {metodology}
            <h3>Recursos</h3>
            {resources}
            <h3>Introducción</h3>
            {introduction}
            <br/><br/>
            <button type="submit" onClick={comenzar}>Comenzar</button>
        </div>
    </div>);
}