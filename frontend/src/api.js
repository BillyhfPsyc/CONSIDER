import axios from "axios";
import { SUMMARY_PROMPT, DEBATE_PROMPT, PROFILE_PROMPT } from "./prompts";


const URL = "http://localhost:3001";

// the below are basically just functions for each API endpoint that we want to call, defined in the postRoutes.js file in the backend.
// We can use these functions in the frontend to get data from the backend.
// by 'posts', what we mean is the data that we want to get from the backend, which is defined in the postRoutes.js file in the backend.

export function sendPositionChat(conversationId, message, topic) {
    return axios.post(`${URL}/chat`, {
      conversationId,
      message,
      systemPrompt: SUMMARY_PROMPT(topic),
      topic,
      context: "position_clarification"
    });
  }

  export function sendDebateChat(conversationId, message, topic, positionSummary, profile) {
    return axios.post(`${URL}/chat`, {
      conversationId,
      message,
      systemPrompt: DEBATE_PROMPT(topic, profile, positionSummary),
      topic,
      context: "debate",
      positionSummary
    });
  }

  export function createProfile(conversationId, topic, positionSummary) {
    return axios.post(`${URL}/generate-profile`, {
      conversationId,
      topic,
      positionSummary,
      context: "profile_creation",
      systemPrompt: PROFILE_PROMPT(topic, positionSummary),
      message: "Generate a fictional profile of someone who disagrees with me."
    });
  }
  
  
// export async function getPosts() {
//     // "http://localhost:3001/posts"
//     const response = await axios.get(`${URL}/posts`);
//     if (response.status === 200) {
//         return response.data;
//     } else { 
//         return
//     }
// }

// export async function getPost(id) {
//     // "http://localhost:3001/posts/id"
//     const response = await axios.get(`${URL}/posts/${id}`);
//     if (response.status === 200) {
//         return response.data;
//     } else { 
//         return
//     } // returns json object that we can use in the frontend.
// }

// export async function createPost(post) {
//     const response = await axios.post(`${URL}/posts`, post);
//     return response
// }

// export async function updatePosts(id, post) {
//     // http://localhost:3001/posts/id
//     const response = await axios.put(`${URL}/posts/${id}`, post);
//     return response
// }

// export async function deletePosts(id) {
//     const response = await axios.delete(`${URL}/posts/${id}`);

//     return response 
// }

// // note that when creating objects, that the fields are the same as the fields in the database (i.e. in postRoutes.js)