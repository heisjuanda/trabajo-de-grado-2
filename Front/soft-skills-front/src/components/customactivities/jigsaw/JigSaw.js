import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import axios from "axios";
import Grid from "@mui/material/Grid";

export default function JigSaw() {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/activity/8`)
      .then((response) => {
        setActivity(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la actividad:", error);
      });
  });

  if (!activity) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <ResponsiveAppBar />
      <br />
      <Grid
        container
        style={{
          height: "95vh",
          paddingTop: "5%",
          paddingBottom: "5%",
          paddingLeft: "10%",
          paddingRight: "10%",
        }}
      >
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {activity.title}
            </h1>
            {activity.objective && (
              <>
                <h3>Objetivo</h3>
                {activity.objective}
              </>
            )}
            {activity.metodology && (
              <>
                <h3>Metodología</h3>
                {activity.metodology}
              </>
            )}
            {activity.resources && (
              <>
                <h3>Recursos</h3>
                {activity.resources}
              </>
            )}
            {activity.introduction && (
              <>
                <h3>Introducción</h3>
                {activity.introduction}
              </>
            )}
            {activity.analisis && (
              <>
                <h3>Análisis de la situación</h3>
                {activity.analisis}
              </>
            )}
            {activity.evaluation && (
              <>
                <h3>Evaluación de escenarios</h3>
                {activity.evaluation}
              </>
            )}
            {activity.example && (
              <>
                <h3>Ejemplo de tema para ejercicio JigSaw</h3>
                {activity.example}
              </>
            )}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </Grid>
      <br />
      <br />
    </>
  );
}
