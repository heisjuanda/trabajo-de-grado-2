import React, { useEffect, useState} from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import axios from "axios";

import './SimuladorFinanzas.css'
import Presentacion from './Presentacion'
import Espera from '../../wait/Espera'
import Simulador from './Simulador'

export default function SimuladorFinanzas(){

    //State para información de la actividad solicitada del backend.
    const [activity, setActivity] = useState(null)
    //State booleano para la transicion de la presentacion al juego.
    const [simular, setSimular] = useState(0)



    const getActivity = async () => {
        await axios
        .get( `${process.env.REACT_APP_API_HOST}/activity/12` )
        .then((response) => {
            setActivity(response.data);
        })
        .catch((error) => {
            console.error("Error al obtener los detalles de la actividad:", error);
        });
    }

    const comenzar = () => {
        setSimular(1)
    }

    useEffect(()=>{getActivity()},[simular])

    return (
        <>
        <ResponsiveAppBar />
        <br/>
        {simular===1? (<Simulador />) : (!activity? (<Espera mensaje="Espera unos segundos" />) : (<Presentacion comenzar={comenzar} activity={activity}/>))}
        </>
    );
}