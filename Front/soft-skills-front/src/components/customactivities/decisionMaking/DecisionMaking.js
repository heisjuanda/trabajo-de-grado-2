import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import axios from "axios";
import Grid from "@mui/material/Grid";

export default function MentalMap() {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/activity/6`)
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
            <h3>Objetivo</h3>
            {activity.objective}
            <h3>Metodología</h3>
            {activity.metodology}
            <h3>Recursos</h3>
            {activity.resources}
            <h3>Introducción</h3>
            {activity.introduction}
            <br />
            <br />
            <br />
            <div>
              <iframe
                style={{ width: "100%", height: "700px" }}
                src="https://www.willyoupressthebutton.com/"
                scrolling="no"
                title="Mental Map Diagram"
              ></iframe>
            </div>
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
