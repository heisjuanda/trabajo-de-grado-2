import React, { useCallback, useMemo, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function Cuenta(props){

    const { datos, listaCuentas, setListaCuentas } = props;

    // Banderas para menu pop up
    const [ informacion, setInformacion ] = useState(false);
    const [ destinos, setDestinos ] = useState(false);
    const [ monto, setMonto] = useState(false);

    const abrirCerrarInformacion = useCallback(()=>{
        setInformacion(!informacion);
    },[informacion])

    const abrirCerrarDestinos = useCallback(()=>{
        setDestinos(!destinos);
    },[destinos])

    const abrirCerrarMonto = useCallback(()=>{
        setMonto(!monto);
    },[monto])

    // Variables para tranferencias
    const origen = useMemo(()=>(datos.nombre),[datos]);
    const [ destino, setDestino ] = useState("");
    const [ cantidad, setCantidad ] = useState(0);

    const elejirDestino = useCallback((index)=>{
        setDestino(listaCuentas[index].nombre);
    },[listaCuentas])

    const tranferir = useCallback(()=>{
        let cuentas = [...listaCuentas];
        let idOrigen = -1;
        let idDestino = -1;
        let resto = 0;
        let sumado = 0;

        cuentas.forEach((element, index) => {
            if(element.nombre === origen && destino !== ""){
                resto = element.saldo - cantidad;
                idOrigen = index;
            }else if(element.nombre === destino && destino !== ""){
                sumado = element.saldo + cantidad;
                idDestino = index;
            }
        });

        if(origen === destino){
            alert("No puedes tranferir a esta misma cuenta.");
        }else if(resto < 0){
            alert("No tiene saldo suficiente.");
        }else{
            cuentas[idOrigen].saldo = resto;
            cuentas[idDestino].saldo = sumado;
            setListaCuentas(cuentas);
        }
    },[listaCuentas, origen, destino, cantidad, setListaCuentas])

    return (
        <button className="Cuenta" onClick={abrirCerrarInformacion}>
            {datos.nombre}: {datos.saldo}

            <Modal isOpen={informacion}>
                <ModalHeader>
                    Información de Cuenta
                </ModalHeader>
                <ModalBody>
                    <p className="Nombre">Nombre: {datos.nombre}</p>
                    <p className="Tipo">Tipo: {datos.tipo}</p>
                    <p className="Saldo">Saldo: {datos.saldo}</p>
                    <p className="Interes">Interes: {datos.interes}</p>
                </ModalBody>
                <ModalFooter>
                    <button onClick={()=>{
                        abrirCerrarInformacion();
                        abrirCerrarDestinos();
                    }}>Tranferir</button>
                    <button onClick={abrirCerrarInformacion}>Cerrar</button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={destinos}>
                <ModalHeader>
                    Cuenta Destino
                </ModalHeader>
                <ModalBody>
                    {listaCuentas.map((elem, index)=>{
                        return(<button onClick={()=>{
                            elejirDestino(index);
                            abrirCerrarDestinos();
                            abrirCerrarMonto();
                        }}>{elem.nombre}</button>)
                    })}
                </ModalBody>
                <ModalFooter>
                    <button onClick={()=>{
                        abrirCerrarDestinos();
                        abrirCerrarInformacion();
                    }}>Cancelar</button>
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
                        tranferir();
                        abrirCerrarMonto();
                        abrirCerrarInformacion();
                    }}>Aceptar</button>
                    <button onClick={()=>{
                        abrirCerrarMonto();
                        abrirCerrarInformacion();
                    }}>Cancelar</button>
                </ModalFooter>
            </Modal>
        </button>
    )
}