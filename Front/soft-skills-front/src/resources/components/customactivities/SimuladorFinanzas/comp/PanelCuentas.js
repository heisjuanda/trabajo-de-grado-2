import React from "react";
import Cuenta from "./Cuenta";
import AgregarCuentas from "./AgregarCuentas";

export default function PanelCuentas(props){

    const { listaCuentas, setListaCuentas } = props;


    return (
        <div className="Panel-Cuentas">
            <h5>Cuentas</h5>
            <div className="Cuentas">
                <AgregarCuentas listaCuentas={listaCuentas} setListaCuentas={setListaCuentas}/>

                {listaCuentas.map((cuenta)=>{
                    return(
                        <Cuenta datos={cuenta} listaCuentas={listaCuentas} setListaCuentas={setListaCuentas}/>
                    )
                })}
            </div>
        </div>
    )
}