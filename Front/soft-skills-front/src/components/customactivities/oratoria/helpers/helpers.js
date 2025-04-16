import { ORATORY_TOPIC_STORAGE_KEY } from "../constantes/constants";

export const saveOratoryTopic = (topic) => {
    sessionStorage.setItem(ORATORY_TOPIC_STORAGE_KEY, topic);
}

export const getOratoryTopic = () => {
    return sessionStorage.getItem(ORATORY_TOPIC_STORAGE_KEY);
}

export const removeOratoryTopic = () => {
    sessionStorage.removeItem(ORATORY_TOPIC_STORAGE_KEY);
}