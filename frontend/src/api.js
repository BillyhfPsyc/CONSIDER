import axios from "axios";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function sendPositionChat(conversationId, message, topic, specificFocus) {
  return axios.post(`${URL}/chat`, {
    conversationId,
    message,
    topic,
    context: "position_clarification",
    specificFocus
  });
}

export function sendDebateChat(conversationId, message, topic, positionSummary, profile, disagreeability, specificFocus) {
  return axios.post(`${URL}/chat`, {
    conversationId,
    message,
    topic,
    context: "debate",
    positionSummary,
    disagreeability,
    specificFocus
  });
}

export function createProfile(conversationId, topic, positionSummary, specificFocus) {
  return axios.post(`${URL}/generate-profile`, {
    conversationId,
    topic,
    positionSummary,
    specificFocus
  });
}

export function analyzeConversation(conversationId, topic, summary) {
  return axios.post(`${URL}/analyze-conversation`, {
    conversationId,
    topic,
    summary,
  });
}
