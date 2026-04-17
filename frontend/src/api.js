import axios from "axios";
import { SUMMARY_PROMPT, DEBATE_PROMPT, PROFILE_PROMPT } from "./prompts";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function sendPositionChat(conversationId, message, topic, specificFocus) {
  return axios.post(`${URL}/chat`, {
    conversationId,
    message,
    systemPrompt: SUMMARY_PROMPT(topic, specificFocus),
    topic,
    context: "position_clarification"
  });
}

export function sendDebateChat(conversationId, message, topic, positionSummary, profile, disagreeability, specificFocus) {
  return axios.post(`${URL}/chat`, {
    conversationId,
    message,
    systemPrompt: DEBATE_PROMPT(topic, profile, positionSummary, disagreeability, specificFocus),
    topic,
    context: "debate",
    positionSummary,
    disagreeability
  });
}

export function createProfile(conversationId, topic, positionSummary, specificFocus) {
  return axios.post(`${URL}/generate-profile`, {
    conversationId,
    topic,
    positionSummary,
    context: "profile_creation",
    systemPrompt: PROFILE_PROMPT(topic, positionSummary, undefined, specificFocus),
    message: "Generate a fictional profile of someone who disagrees with me."
  });
}

export function analyzeConversation(conversationId, topic, summary) {
  return axios.post(`${URL}/analyze-conversation`, {
    conversationId,
    topic,
    summary,
  });
}
