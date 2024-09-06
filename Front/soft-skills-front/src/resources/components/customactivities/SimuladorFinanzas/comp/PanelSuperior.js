import React, { useCallback, useEffect, useMemo } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ProductoFinanciero from "./ProductoFinanciero";


export default function PanelSuperior(props){

    const { numMes, productosFinancieros, setProductosFinancieros, listaCuentas, setListaCuentas } = props;


    const settings = useMemo(()=>{
        return({
            dots: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,
        })
    },[])


    const nuevoCDT = useCallback((id)=>{
        let tiposPago = ["Mensual", "Final"];

        let tipoPago = tiposPago[(Math.floor(Math.random() * 2))]
        let interesEA = ((Math.floor(Math.random() * 6) + 8)/100);
        let interesMensual = (Math.pow((1 + interesEA),(1/12)) -1).toFixed(4);
        let duracion = (Math.floor(Math.random() * 24) + 2);
        let capitalMinimo = (Math.floor(Math.random() * 20) + 1) * 50000;

        return ({
            id: id,
            tipo: "CDT",
            interesEA: interesEA,
            interesMensual: interesMensual,
            duracion: duracion,
            tipoPago: tipoPago,
            capitalMinimo: capitalMinimo,
            riesgo: "Bajo",
            capital: 0,
            fechaInicio: null,
            cuenta: null,
        });
    },[]);

    const nuevoFIC = useCallback((id)=>{
        let tipos = ["Abierto", "Cerrado"];

        let tipoFondo = tipos[(Math.floor(Math.random() * 2))];
        let permanencia = null;
        let status = null;
        if(tipoFondo === tipos[0]){
            permanencia = Math.floor(Math.random() * 12);
            status = "Abierto";
        }else if(tipoFondo === tipos[1]){
            permanencia = (Math.floor(Math.random() * 7) + 6);
            status = "Cerrado"; //La diferencia con el tipo es que este cambia con el tiempo segun la duracion/permanencia.
        }
        let capitalMinimo = (Math.floor(Math.random() * 21) + 1) * 20000;
        let penalizacion = (Math.floor(Math.random() * 41) + 10)/100;
        let duracion = (Math.floor(Math.random() * 24) + 2);

        let riesgos = ["Bajo", "Medio", "Alto"];

        let riesgo = riesgos[Math.floor(Math.random() * 3)];

        return ({
            id: id,
            tipo: "FIC",
            tipoFondo: tipoFondo,
            permanencia: permanencia,
            duracion: duracion,
            capitalMinimo: capitalMinimo,
            penalizacion: penalizacion,
            status: status,
            riesgo: riesgo,
            capital: 0,
            fechaInicio: null,
            cuenta: null,
        });
    },[]);

    const generarProductos = useCallback(()=>{
        let productos = []

        while(productos.length < 10){
            let tipos = ["CDT", "FIC"]
            let id = productos.length;
            let tipo = tipos[(Math.floor(Math.random() * 2))];
            
            let nuevo = {};

            if(tipo === tipos[0]){
                nuevo = nuevoCDT(id);
            }else if(tipo === tipos[1]){
                nuevo = nuevoFIC(id);
            }
            productos.push(nuevo)
        }

        setProductosFinancieros([...productos])
    },[setProductosFinancieros, nuevoCDT, nuevoFIC])

    useEffect(()=>{
        generarProductos();
    },[generarProductos])

    useEffect(()=>{
        //refrescar
    },[numMes,productosFinancieros])

    return(
        <Slider className="Panel-Superior" {...settings}>
            {productosFinancieros.map((producto)=>{
                return(<ProductoFinanciero datos={producto} numMes={numMes} listaCuentas={listaCuentas} setListaCuentas={setListaCuentas} productosFinancieros={productosFinancieros} setProductosFinancieros={setProductosFinancieros} />)
            })}
        </Slider>
    )
}