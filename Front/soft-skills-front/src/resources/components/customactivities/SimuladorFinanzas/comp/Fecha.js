import React, { useEffect, useMemo, useState } from "react";

export default function PanelInferior(props){

    const { numMes } = props;
    const meses = useMemo(()=>{return(["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"])},[]);

    const [ year, setYear ]= useState(new Date().getFullYear())
    const [ mes, setMes ] = useState(meses[0]);


    useEffect(()=>{
        setMes(meses[(numMes % 12)]);
        if((numMes % 12 === 0) && mes === "Diciembre"){
            setYear(year + 1);
        }
    },[numMes, meses, mes, year]);

    return (
        <div className="Fecha">
            <p className="Fecha-Contador">mes: {numMes + 1}</p>
            <h4>{year}-{mes}</h4>
        </div>
    )
}