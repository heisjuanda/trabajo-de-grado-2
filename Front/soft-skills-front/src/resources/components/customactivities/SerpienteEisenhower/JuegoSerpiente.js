import React, { useEffect, useState } from "react";
import Tablero from './comp/Tablero'
import Marcador from './comp/Marcador';
import Reloj from "./comp/Reloj"
import Valores from "./comp/Valores";
import Intentos from "./comp/Intentos";
import Musica from "./comp/Musica";
import BotonTrampa from "./comp/BotonTrampa";
import Notificaciones from "./comp/Notificaciones";
import Flotante from "./comp/Flotante";

export default function JuegoSerpiente(){

    // Valores predefinidos

    // Urgente UrgenteImportante Importante NoImportante
    // Abreviaciones U, UI, I, NI
    const valoresDefault = [50,30,15,10];

    const niveles = {
        1:{tamano: {ancho: 30, alto: 20}, tiempo: 5, matriz: null, descanso: 5},
        2:{tamano: {ancho: 40, alto: 30}, tiempo: 8, matriz: null, descanso: 5},
        3:{tamano: {ancho: 50, alto: 40}, tiempo: 11, matriz: null, descanso: 5},
        4:{tamano: {ancho: 50, alto: 40}, tiempo: 15, matriz: null, descanso: 0}
    };

    const direcciones = {
        neutral:    [0,0],
        arriba:     [0,-1],
        abajo:      [0, 1],
        derecha:    [1,0],
        izquierda:  [-1,0],
    };

    const serpienteDefault = {
        direccion: direcciones.neutral,
        cabeza: [14,10],
        cola: [],
        largo: 2
    };


    // Estados

    const [ mapa, setMapa ] = useState(niveles[1]);
    const [ serpiente, setSerpiente ] = useState(serpienteDefault);
    const [ puntaje, setPuntaje] = useState(0);
    const [ interruptor, setInterruptor] = useState(false);
    // Los valores son los puntos que dan los fruto.
    const [ valores, setValores] = useState(valoresDefault);
    const [ frutos, setFrutos ] = useState([]);
    const [ intentos, setIntentos ] = useState(0);




    // Metodos

    const generarFruto = () => {
        let num = Math.floor(Math.random() * 4);
        let x = Math.floor(Math.random() * mapa.tamano.ancho);
        let y = Math.floor(Math.random() * mapa.tamano.alto);

        let repetido = false;
        if (frutos.length > 0){
            repetido = frutos.reduce((final, elem)=>{
                if(final === true){
                    return final
                }else if((elem.posicion.x === x && elem.posicion.y === y) || elem.tipo === num){
                    return true
                }else{
                    return false
                }
            },false)
        }

        let fruto = {tipo: num, valor: valores[num], posicion: {x: x, y: y}} ;

        let nuevaMatriz = mapa.matriz;

        if(!repetido){
            nuevaMatriz[x][y] = fruto;
            setMapa({...mapa, matriz: nuevaMatriz})
            setFrutos([...frutos, fruto])
        }
    }

    const eliminarFruto = (tipo) => {
        let nuevosFrutos = frutos;

        let index = nuevosFrutos.reduce((final, elem, idx)=>{
            if(final !== null){
                return final;
            }else if(elem.tipo === tipo){
                return idx;
            }else{
                return null
            }
        },null)

        nuevosFrutos.splice(index,1)
        setFrutos(nuevosFrutos)
    }

    const colision = (x, y) => {
        const dentroAncho = x > -1 && x < mapa.tamano.ancho;
        const dentroAlto = y > -1 && y < mapa.tamano.alto;
        const dentro = dentroAncho && dentroAlto;

        let tipo = null;
        let nuevaMatriz = mapa.matriz;
        let elemento = null;
        if(dentro){
            elemento = nuevaMatriz[x][y];
        }
        
        if(elemento !== null){
            tipo = elemento.tipo;
            setPuntaje(puntaje + elemento.valor)
            nuevaMatriz[x][y] = null;
            setMapa({...mapa, matriz: nuevaMatriz})
        }

        if(tipo !== null){
            eliminarFruto(tipo)
            racha(tipo);
        }
    }

    const racha = (tipo) => {
        let nuevosValores = valores;
        // si atrapa un U reinicia todos los valores.
        if(tipo === 0){
            nuevosValores = valoresDefault;

        // si atrapa un UI suma 30 si es menor o igual a 89
        // su limite de crecimiento aqui es de 119.
        }else if(tipo === 1 && valores[1] < 90){
            nuevosValores[tipo] = nuevosValores[tipo] + 30;

        // si atrapa un I y los UI valen menos, siempre y cuando los I sean menores a 90
        // los I suben en 10 y los UI suben en 20.
        }else if(tipo === 2 && valores[1] < valores[2] && valores[2] < 90){
            nuevosValores[1] = nuevosValores[1] + 20;
            nuevosValores[tipo] = nuevosValores[tipo] + 10;
        
        // si atrapa un I y su valor es menor a 100 suma de a 10.
        }else if(tipo === 2 && valores[2] < 100){
            nuevosValores[tipo] = nuevosValores[tipo] + 10;

        // si atrapa un NI, reinicia los I y le resta 5 a los UI.
        }else if(tipo === 3 && valores[2] > valoresDefault[2]){
            nuevosValores[1] = nuevosValores[1] - 5
            nuevosValores[2] = valoresDefault[2]
        }
        // para hacer tendador los U, en caso de valer menos que las urgentes importantes
        if(nuevosValores[0] < nuevosValores[1]){
            nuevosValores[0] = nuevosValores[1] + 5;
        }
        setValores(nuevosValores);
    }

    const nuevoIntento = ()=>{
        setPuntaje(0)
        setIntentos(intentos + 1);
        setSerpiente(serpienteDefault);
        setValores(valoresDefault)
    }

    const moverse = () =>{
        const dentroAncho = serpiente.cabeza[0] > -1 && serpiente.cabeza[0] < mapa.tamano.ancho;
        const dentroAlto = serpiente.cabeza[1] > -1 && serpiente.cabeza[1] < mapa.tamano.alto;
        const dentro = dentroAncho && dentroAlto;

        if(dentro){
            let nuevaCabeza = serpiente.cabeza.map((valor, index)=>(valor + serpiente.direccion[index]))
            let nuevaCola = serpiente.cola

            let diferentes = serpiente.cabeza[0] !== nuevaCabeza[0] || serpiente.cabeza[1] !== nuevaCabeza[1]

            if(diferentes){
                nuevaCola.push(serpiente.cabeza)
                let largo = Math.floor(puntaje / 100)
                if(largo < serpiente.largo){
                    largo = serpiente.largo
                }

                if(nuevaCola.length > largo){
                    nuevaCola.shift()
                }
                setSerpiente({...serpiente,
                    cabeza: nuevaCabeza,
                    cola:   nuevaCola,
                    largo: largo,
                })
                colision(nuevaCabeza[0], nuevaCabeza[1]);
            }
        }else{
            nuevoIntento();
        }
    }



    const cambiarDireccion = (e) => {
        const tecla = e.key;

        if(direcciones.neutral[0] === serpiente.direccion[0] && direcciones.neutral[1] === serpiente.direccion[1]){
            setInterruptor(true)
        }

        if((tecla === "ArrowUp" || tecla === "W" || tecla === "w") && (serpiente.direccion[1] !== 1)){
            setSerpiente({...serpiente,
                direccion: direcciones.arriba,
            })
        }else if((tecla === "ArrowDown" || tecla === "S" || tecla === "s") && (serpiente.direccion[1] !== -1)){
            setSerpiente({...serpiente,
                direccion: direcciones.abajo,
            })
        }else if((tecla === "ArrowLeft" || tecla === "A" || tecla === "a") && (serpiente.direccion[0] !== 1)){
            setSerpiente({...serpiente,
                direccion: direcciones.izquierda,
            })
        }else if((tecla === "ArrowRight" || tecla === "D" || tecla === "d") && (serpiente.direccion[0] !== -1)){
            setSerpiente({...serpiente,
                direccion: direcciones.derecha,
            })
        }else{
            console.log("tecla no peritida");
            console.log(e.key);
        }
    }

    const crearMatriz = () => {
        let nuevaMatriz = [];
        for( var x = 0; x < mapa.tamano.ancho; x++){
            nuevaMatriz.push([]);
            for( var y = 0; y < mapa.tamano.alto; y++){
                nuevaMatriz[x].push(null);
            }
        }
        setMapa({...mapa, matriz: nuevaMatriz})
    }


    useEffect(()=>{

        window.addEventListener('keydown', cambiarDireccion, true);
        document.addEventListener('visibilitychange', () => {if(document.visibilityState === "hidden"){nuevoIntento()}}, true);
        
        let id = setInterval(()=>{
            moverse()
            if(mapa.matriz === null){
                crearMatriz()
            }
            if(frutos.length < 3 && mapa.matriz !== null){
                generarFruto()
            }
        },200)

        return () => {
            clearInterval(id)
            window.removeEventListener('keydown', cambiarDireccion, true);
            document.removeEventListener('visibilitychange', () => {if(document.visibilityState === "hidden"){nuevoIntento()}}, true);
        }
    })

    return(
        <div className="Juego-Serpiente">
            <Marcador puntaje={puntaje}/>
            <Reloj tiempo={5} interruptor={interruptor}/>
            <Valores valores={valores}/>
            <Intentos intentos={intentos}/>
            <Tablero serpiente={serpiente} frutos={frutos} mapa={mapa}/>
            <BotonTrampa puntaje={puntaje} setPuntaje={setPuntaje}/>
            <Notificaciones interruptor={interruptor}/>
            <Musica interruptor={interruptor}/>
            <Flotante interruptor={interruptor}/>
        </div>
    )

}