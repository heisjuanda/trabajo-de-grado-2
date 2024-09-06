import React, { useCallback, useEffect, useState } from "react";

import Fecha from "./comp/Fecha";
import PanelInferior from "./comp/PanelInferior";
import PanelCuentas from "./comp/PanelCuentas";
import PanelSuperior from "./comp/PanelSuperior";

export default function Simulador(props){

    const [ numMes, setNunMes ] = useState(0);
    const [ deshabilitar, setDeshabilitado ] = useState(false)
    const [ salario, setSalario ] = useState(0);
    const [ saldo, setSaldo ] = useState(2000000);
    const [ listaCuentas, setListaCuentas ] = useState([]);
    const [ productosFinancieros, setProductosFinancieros] = useState([]);

    const balance = useCallback((saldo, salario)=>{
        let total = 0;
        let cuentasActualizadas = []
        listaCuentas.forEach((cuenta)=>{
            if(cuenta.nombre === 'Principal'){
                cuenta.saldo = cuenta.saldo + salario;
            }
            cuentasActualizadas.push(cuenta);
        })
        setListaCuentas(cuentasActualizadas);
        cuentasActualizadas.forEach((cuenta)=>{
            if(cuenta.tipo !== "Credito"){
                total = total + cuenta.saldo;
            }
        })
        setSaldo(total);
    },[listaCuentas])

    //Final de la simulacion
    const simulacionFinalizada = useCallback(()=>{
        if(numMes + 1 === 35){
            setDeshabilitado(!deshabilitar);
        }
    },[numMes, deshabilitar])

    //funcion paso a paso
    const siguiente = useCallback(()=>{
        simulacionFinalizada()
        setNunMes( numMes + 1 );
        balance(saldo, salario);
    },[numMes, saldo, salario, simulacionFinalizada, balance]);


    useEffect(()=>{
        setSalario(2000000);
        setListaCuentas([
            {nombre: 'Principal', tipo: 'debito', saldo: 2000000, interes: 0, cuota: 0},
        ])
    },[])

    return(
        <div className="Simulador-Finanzas">
            <Fecha numMes={numMes}/>
            <PanelSuperior numMes={numMes} productosFinancieros={productosFinancieros} listaCuentas={listaCuentas} setProductosFinancieros={setProductosFinancieros} setListaCuentas={setListaCuentas}/>
            <PanelCuentas listaCuentas={listaCuentas} setListaCuentas={setListaCuentas}/>
            <PanelInferior salario={salario} saldo={saldo}/>
            <button className="Boton-Siguiente" onClick={siguiente} disabled={deshabilitar}>Siguiente</button>
        </div>
    )
}