import React, { useCallback, useMemo, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
//import * as crypto from "crypto";


export default function AgregarCuentas(props){

    const { listaCuentas, setListaCuentas } = props;
    const [ abierto, setAbierto ] = useState(false)
    const [ deshabilitar, setDeshabilitar ] = useState(false)

    const nombreRandom = useCallback(()=>{
        let letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let nombreR = "";
        for(let i = 0; i < 5; i++){
            nombreR = nombreR + letras[Math.floor(Math.random() * letras.length)];
        }
        return nombreR;
    },[]);

    const cuentasGeneradas = useMemo(()=>{
        if(abierto){
            console.log("NuevaLista");
            let cuentas = []
            let tipos = ["Debito","Credito","Digital"]
            for(let i = 0; i < 3; i++){
                let nombre = nombreRandom();
                let tipo = tipos[(Math.floor(Math.random() * 3))];
                let saldo = 0;
                let interes = null;
                if(tipo === "Digital"){
                    interes = 0;
                }else if(tipo === "Debito"){
                    interes = Math.floor(Math.random() * 11);
                }else if(tipo === "Credito"){
                    interes = Math.floor(Math.random() * 16);
                }
                cuentas.push({
                    nombre: nombre,
                    tipo: tipo,
                    saldo: saldo,
                    interes: interes,
                });
            }
            return cuentas;
        }else {
            return [];
        }
    },[abierto, nombreRandom])

    const crearCuenta = useCallback((index)=>{
        let lista = [];
        listaCuentas.forEach((elemento)=>{
            lista.push(elemento)
        });
        lista.push(cuentasGeneradas[index])
        setListaCuentas(lista)
        if(lista.length === 6){
            setDeshabilitar(!deshabilitar)
        }
    },[deshabilitar, listaCuentas, setListaCuentas, cuentasGeneradas]);

    const abrirCerrar = useCallback(()=>{
        setAbierto(!abierto)
    },[abierto]);

    return(
        <div className="Boton-Agregar-Cuentas">
            <button onClick={abrirCerrar} disabled={deshabilitar}>+</button>
            
            <Modal isOpen={abierto}>
                <ModalHeader>
                    Crear Cuenta
                </ModalHeader>
                <ModalBody>
                    {
                        cuentasGeneradas.map((elemento, index)=>{
                            return(<button className="Cuenta-Nueva" onClick={()=>{crearCuenta(index);abrirCerrar()}}>
                                nombre: {elemento.nombre} tipo: {elemento.tipo} saldo: {elemento.saldo} interes: {elemento.interes}
                            </button>);
                        })
                    }
                </ModalBody>
                <ModalFooter>
                    <button className="Cancelar" onClick={abrirCerrar}>Cerrar</button>
                </ModalFooter>
            </Modal>
        </div>
    )
}