import { duration } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function ProductoFinanciero(props){

    const { datos, numMes, listaCuentas, setListaCuentas, productosFinancieros, setProductosFinancieros } = props;
    const [ informacion, setInformacion ] = useState(false);
    const [ elejirCuenta, setElejirCuenta ] = useState(false);
    const [ monto, setMonto ] = useState(false);

    const abrirCerrarInformacion = useCallback(()=>{
        setInformacion(!informacion);
    },[informacion])

    const abrirCerrarElejirCuenta = useCallback(()=>{
        setElejirCuenta(!elejirCuenta);
    },[elejirCuenta])

    const abrirCerrarMonto = useCallback(()=>{
        setMonto(!monto);
    },[monto])

    const setOrigen = useCallback((nombre)=>{
        let productos = productosFinancieros;
        datos.cuenta = nombre;
        productos[datos.id] = datos;
        setProductosFinancieros([...productos])
    },[datos, productosFinancieros, setProductosFinancieros])

    const [ cantidad, setCantidad] = useState(0);

    const depositar = useCallback(()=>{
        let cuentas = [...listaCuentas];
        let productos = [...productosFinancieros]
        let idOrigen = -1;
        let resto = 0;
        let sumado = datos.capital + cantidad;

        cuentas.forEach((element, index) => {
            if(element.nombre === datos.cuenta){
                resto = element.saldo - cantidad;
                idOrigen = index;
            }
        });

        if(datos.cuenta === null){
            alert("No puedes depositar sin elejir una cuenta.");
        }else if(resto < 0){
            alert("No tiene saldo suficiente.");
        }else if(sumado < datos.capitalMinimo){
            alert("No cumple con la cantidad minima.");
        }else if(datos.tipo === "CDT" && datos.fechaInicio !== null && ((numMes - datos.fechaInicio) % datos.duracion) !== 0){
            alert("No se puede depositar durante el acuerdo");
        }else if(datos.tipo === "FIC" && datos.status !== "Abierto" && datos.tipoFondo === "Cerrado"){
            alert("Espera a que sea el fondo abra para invertir.")
        }else{
            cuentas[idOrigen].saldo = resto;
            datos.capital = sumado;
            datos.fechaInicio = numMes;
            productos[datos.id] = datos;
            setListaCuentas(cuentas);
            setProductosFinancieros([...productos]);
        }
    },[numMes, datos, cantidad, listaCuentas, setListaCuentas, productosFinancieros, setProductosFinancieros]);

    const penalizar = useCallback(()=>{

    },[])

    const retirar = useCallback((cantidad, retencion: Boolean)=>{
        let cuentas = [...listaCuentas];
        let productos = [...productosFinancieros]
        let idOrigen = -1;
        let resto = datos.capital - cantidad;
        let sumado = 0;

        cuentas.forEach((element, index) => {
            if(element.nombre === datos.cuenta){
                sumado = element.saldo + cantidad;
                idOrigen = index;
            }
        });

        if(retencion){
            sumado = sumado - (sumado * 1);
        }

        if(datos.cuenta === null){
            alert("No puedes retirar sin una cuenta asociada.");
        }else if(resto < 0){
            alert("No puedes retirar esa cantidad. Saldo insuficiente.");
        }else if(datos.tipo === "CDT" && datos.fechaInicio !== null && ((numMes - datos.fechaInicio) % datos.duracion) !== 0){
            alert("No se puede retirar durante el acuerdo");
        }else if(datos.tipo === "FIC" && datos.status !== "Abierto" && datos.tipoFondo === "Cerrado"){
            alert("Espera a que sea el fondo abra para retirar.");
        }else if(datos.tipo === "FIC" && datos.status !== "Cerrado" && datos.tipoFondo === "Abierto"){
            alert("Hay permanencia, se te penalizara sobre el capital por retirar antes de cumplir permanencia.");
        }else if(datos.fechaInicio === numMes){
            alert("No puedes retirar el mismo dia que depositas.");
        }else{
            cuentas[idOrigen].saldo = sumado;
            datos.capital = resto;
            datos.fechaInicio = numMes;
            productos[datos.id] = datos;
            setListaCuentas([...cuentas]);
            setProductosFinancieros([...productos]);
        }
    },[])


    const pago = useCallback(()=>{
        let dinero = 0;
        if(datos.tipo === "CDT" && datos.tipoPago === "Final" && ((numMes - datos.fechaInicio) % datos.duracion) === 0 && datos.cuenta !== null){
            dinero = (datos.capital * Math.pow((1 + datos.interesMensual), datos.duration)) - datos.capital;
        }else if(datos.tipo === "CDT" && datos.tipoPago === "Mensual" && datos.cuenta !== null){
            dinero = (datos.capital * datos.interesMensual);
        }

        retirar(dinero, true)
    },[])

    const rendimiento = useCallback(()=>{
        let productos = productosFinancieros;

        if(datos.tipo === "CDT"){

        }else if (datos.tipo === "FIC"){
            let rango =[0,0];
            let interes = 0.0;
            let ganancia = 0;
            
            if(datos.riesgo === "Bajo"){
                rango = [1, 3];
            }else if(datos.riesgo === "Medio"){
                rango = [-2, 15];
            }else if(datos.riesgo === "Alto"){
                rango = [-50, 50];
            }

            if(rango[0] < 0){
                interes = ((Math.random() * (rango[1] - rango[0])) + rango[0])/100
            }else{
                interes = ((Math.random() * (rango[1] + rango[0])) - rango[0])/100
            }
            
            ganancia = datos.capital * interes

            datos.capital = datos.capital + ganancia;
        }

        productos[datos.id] = {...datos};
        setProductosFinancieros([...productos]);

    },[datos, productosFinancieros, setProductosFinancieros]);

    const estado = useCallback((numMes)=>{
        let productos = productosFinancieros;

        if(datos.tipo === "FIC" && datos.tipoFondo === "Cerrado"){
            let num = numMes % datos.duracion;
            if(num === 0){
                datos.status = "Abierto"
            }else{
                datos.status = "Cerrado"
            }
        }else if(datos.tipo === "FIC" && datos.tipoFondo === "Abierto" && datos.permanencia !== null){
            if(datos.fechaInicio === null){
                datos.status = "Abierto";
            }else if(datos.fechaInicio !== null){
                let actualMes = (numMes - datos.fechaInicio);
                if(actualMes < datos.permanencia){
                    datos.estado = "Cerrado";
                }else{
                    datos.estado = "Abierto";
                }
            }
            datos.status = "Abierto";
        }else if(datos.tipo === "FIC" && datos.tipoFondo === "Abierto" && datos.permanencia === null){
            datos.status = "Abierto";
        }

        productos[datos.id] = {...datos};
        setProductosFinancieros([...productos]);

    },[datos, productosFinancieros, setProductosFinancieros]);


    const mostrarCDT = useCallback(()=>{
        return(
            <div>
                <div>
                    Id: {datos.id}
                </div>
                <div>
                    Interes E.A: {datos.interesEA * 100}%
                </div>
                <div>
                    Interes Mensual: {datos.interesMensual * 100}%
                </div>
                <div>
                    Duración: {datos.duracion} Meses
                </div>
                <div>
                    Pago: {datos.tipoPago}
                </div>
                <div>
                    Capital Minimo: {datos.capitalMinimo}
                </div>
                <div>
                    riesgo: {datos.riesgo}
                </div>
                <div>
                    Capital Invertido: {datos.capital}
                </div>
                <div>
                    Inicio: {datos.fechaInicio + 1}
                </div>
                <div>
                    Cuenta: {datos.cuenta}
                </div>
            </div>
        );
    },[datos]);

    const mostrarFIC = useCallback(()=>{
        return(
            <div>
                <div>
                    Id: {datos.id}
                </div>
                <div>
                    Tipo de Fondo: {datos.tipoFondo}
                </div>
                {datos.permanencia ? (<div>
                    Permanencia: {datos.permanencia}
                </div>):(<div>
                    Permanencia: N/A
                </div>)}
                
                <div>
                    Duración: {datos.duracion} Meses
                </div>
                <div>
                    Capital Minimo: {datos.capitalMinimo}
                </div>
                <div>
                    Penalización: {datos.penalizacion}
                </div>
                <div>
                    Estado: {datos.status}
                </div>
                <div>
                    Riesgo: {datos.riesgo}
                </div>
                <div>
                    Capital: {datos.capital}
                </div>
                <div>
                    Fecha Inicio: {datos.fechaInicio ? datos.fechaInicio + 1 : ""}
                </div>
                <div>
                    Cuenta: {datos.cuenta}
                </div>
            </div>
        );
    },[datos]);


    useEffect(()=>{
        estado(numMes)
    },[numMes, estado]);

    useEffect(()=>{
        rendimiento()
    },[numMes, rendimiento]);

    useEffect(()=>{
        //refrescar
    },[productosFinancieros])

    return(
        <div className="Producto-Financiero">
            <div>
                {datos.id}
            </div>
            <div className="PF-Tipo">
                {datos.tipo}
            </div>
            {datos.tipo === "FIC" ? 
                (datos.status === "Abierto" ? (
                    <div className="PF-Status-Open">
                        {datos.status}
                    </div>
                ):(
                    <div className="PF-Status-Close">
                        {datos.status}
                    </div>
                ))
                :(<div className="PF-Duracion">
                    {datos.duracion} Meses
                </div>)}
            <div className="PF-Capital">
                Capital: {datos.capital}
            </div>
            <button onClick={abrirCerrarInformacion}>
                ...
            </button>
            <Modal isOpen={informacion}>
                <ModalHeader>
                    {datos.tipo}
                </ModalHeader>
                <ModalBody>
                    {datos.tipo === "FIC" ? (mostrarFIC()):(mostrarCDT())}
                </ModalBody>
                <ModalFooter>
                    <button onClick={()=>{
                        abrirCerrarInformacion()
                        abrirCerrarElejirCuenta()
                    }}>Depostiar</button>
                    <button>Retirar</button>
                    <button onClick={abrirCerrarInformacion}>Cerrar</button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={elejirCuenta}>
                <ModalHeader>
                    Elejir Cuenta
                </ModalHeader>
                <ModalBody>
                    {listaCuentas.map((elem)=>{
                        return(<button onClick={()=>{
                            setOrigen(elem.nombre)
                            abrirCerrarMonto()
                            abrirCerrarElejirCuenta()
                        }}>
                            {elem.nombre}
                        </button>);
                    })}
                </ModalBody>
                <ModalFooter>
                    <button onClick={()=>{
                        abrirCerrarElejirCuenta()
                        abrirCerrarInformacion()
                    }}>
                        Cancelar
                    </button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={monto}>
                <ModalHeader>
                    Cantidad
                </ModalHeader>
                <ModalBody>
                    <input onChange={(e)=>{
                        setCantidad(parseInt(e.target.value))
                        }} type="text" />
                </ModalBody>
                <ModalFooter>
                    <button onClick={()=>{
                        depositar();
                        abrirCerrarMonto();
                        abrirCerrarInformacion();
                    }}>Aceptar</button>
                    <button onClick={()=>{
                        abrirCerrarMonto();
                        abrirCerrarInformacion();
                    }}>Cancelar</button>
                </ModalFooter>
            </Modal>
        </div>
    )
}