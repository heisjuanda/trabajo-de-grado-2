import { ORATORY_TOPIC_STORAGE_KEY } from "../constantes/constants";

export const saveOratoryTopic = (topic, key = ORATORY_TOPIC_STORAGE_KEY) => {
  sessionStorage.setItem(key, JSON.stringify(topic));
};

export const getOratoryTopic = (key = ORATORY_TOPIC_STORAGE_KEY) => {
  return JSON.parse(sessionStorage.getItem(key));
};

export const removeOratoryTopic = (key = ORATORY_TOPIC_STORAGE_KEY) => {
  sessionStorage.removeItem(key);
};

export const parseOratoryTopic = (response) => {
  const jsonClean = response.topic;
  let contenido;
  try {
    contenido = JSON.parse(jsonClean);

    return contenido;
  } catch (error) {
    console.error("Error al parsear el JSON:", error);

    return null;
  }
};
