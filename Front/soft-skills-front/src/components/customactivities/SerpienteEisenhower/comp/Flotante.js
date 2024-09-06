import React, { useEffect, useState } from "react"
import { Modal, ModalHeader, ModalBody, Button} from "reactstrap"


export default function Flotante(props){

    const { interruptor } = props;

    const [ abierto, setAbierto ] = useState(false);

    const cambioVisible = ()=>{
        setAbierto(!abierto)
    }

    // El estilo de este componente se envia por parametro
    const modalStyle = {
        position: "absolute",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }

    useEffect(()=>{
        const id = setInterval(()=>{
            if(!abierto && interruptor){
                setAbierto(!abierto)
            }
        }, 10000)

        return () => {
            clearInterval(id);
        }
    })

    return (
        <div className="Flotante">
            <Modal isOpen={abierto} style={modalStyle} >
                <ModalHeader>
                    Excelente!
                </ModalHeader>
                <ModalBody>
                    <Button color="primary" onClick={cambioVisible}>Cerrar</Button>
                </ModalBody>
            </Modal>
        </div>
    )
}