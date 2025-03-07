import { IA_TOPIC_QUESTION_INDEX } from "../constantes/debateIdeas";

export const setSessionStorageValue = (
  data,
  dataIndex = IA_TOPIC_QUESTION_INDEX
) => {
  if (!data) return;

  if (typeof data !== "string") {
    window.sessionStorage.setuItem(dataIndex, JSON.stringify(data));
    return;
  }

  window.sessionStorage.setItem(dataIndex, data);
};

export const removeSessionStorageValue = (
  dataIndex = IA_TOPIC_QUESTION_INDEX
) => {
  if (!dataIndex) return;

  window.sessionStorage.removeItem(dataIndex);
};

export const getSessionStorageValues = (
  dataIndex = IA_TOPIC_QUESTION_INDEX
) => {
  if (!dataIndex) return;

  return window.sessionStorage.getItem(dataIndex);
};

export function parseDynamicFeedback(text) {
  const result = { sections: [] };

  const ratingRegex = /\*\*Calificación Final:\*\*\s*(\d+)/i;
  const ratingMatch = text.match(ratingRegex);
  console.log(ratingMatch)
  if (ratingMatch) {
    result.rating = parseInt(ratingMatch[1], 10);
  }

  const sectionRegex = /\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\*\*|$)/gi;
  let sectionMatch;
  while ((sectionMatch = sectionRegex.exec(text)) !== null) {
    const sectionTitle = sectionMatch[1].trim();
    const sectionContent = sectionMatch[2].trim();

    const rawItems = sectionContent.split("\n")
      .map(item => item.trim())
      .filter(item => item.length > 0 && item !== "-");

    const processedItems = rawItems.map(item => {
      const cleanedItem = item.replace(/^[-\d\.\s]+/, "");
      if (cleanedItem.includes(":")) {
        const parts = cleanedItem.split(":");
        const title = parts[0].trim();
        const details = parts.slice(1)
          .join(":")
          .split(/(?<=\.)\s+(?=\S)/)
          .map(d => d.trim())
          .filter(d => d);
        return { title, details };
      }
      return cleanedItem;
    });

    result.sections.push({
      title: sectionTitle,
      items: processedItems,
    });
  }

  return result;
}


export function getFormattedDate() {
  const date = new Date();
  const pad = (n, width = 2) => n.toString().padStart(width, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = pad(date.getUTCMilliseconds(), 3) + "000";

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
}

export function parseUserFriendlyDate(isoString) {
  const date = new Date(isoString);
  
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
  };

  return date.toLocaleString('es-ES', options);
}