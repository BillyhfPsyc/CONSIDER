import axios from "axios";

const URL = "http://localhost:3001";

// the below are basically just functions for each API endpoint that we want to call, defined in the postRoutes.js file in the backend.
// We can use these functions in the frontend to get data from the backend.
// by 'posts', what we mean is the data that we want to get from the backend, which is defined in the postRoutes.js file in the backend.

export function sendPositionChat(conversationId, message, topic) {
    return axios.post(`${URL}/chat`, {
      conversationId,
      message,
      systemPrompt: `You are a helpful assistant trying to understand a user's position on the topic '${topic}'. Ask clarifying questions as needed. It is crucial that you message like a human, and keep your responses short and to the point. Once you understand their position, summarize it briefly and clearly in a way that could be sent to another bot as their stated stance. End your summary with: '__SUMMARY_COMPLETE__'.`,
      topic,
      context: "position_clarification"
    });
  }

  export function sendDebateChat(conversationId, message, topic, positionSummary, profile) {
    return axios.post(`${URL}/chat`, {
      conversationId,
      message,
      systemPrompt: `You are an AI that should act like a human having a disagreement with someone on the topic '${topic}'. Here is the human profile you must impersonate: '${profile}'. Argue against the following stance: "${positionSummary}". Your goal is to challenge the user's beliefs, citing common counterarguments where relevant. Ensure that the style is conversation-like, and the outputs are not too long, similarly to individual's debating on social media. Outputs should not be more than 1 paragraph.`,
      topic,
      context: "debate",
      positionSummary
    });
  }

  export function createProfile(conversationId, topic, positionSummary) {
    const systemPrompt = `You are an AI tasked with constructing a fictional profile of a person who strongly disagrees with the following opinion on the topic of '${topic}':
  "${positionSummary}"
  
  Generate a short, human-like character profile including their background, values, and why they disagree. Avoid straw man arguments and aim for realism. Write it in the third person.
  
  Structure:
  - Name (first name only)
  - Age
  - Occupation
  - Beliefs/values
  - Why they disagree
  
  Keep it under 100 words.`;
  
    const message = "Generate a fictional profile of someone who disagrees with me.";
  
    return axios.post(`${URL}/generate-profile`, {
      conversationId,
      topic,
      positionSummary,
      context: "profile_creation",
      systemPrompt,
      message
    });
  }
  
export async function getPosts() {
    // "http://localhost:3001/posts"
    const response = await axios.get(`${URL}/posts`);
    if (response.status === 200) {
        return response.data;
    } else { 
        return
    }
}

export async function getPost(id) {
    // "http://localhost:3001/posts/id"
    const response = await axios.get(`${URL}/posts/${id}`);
    if (response.status === 200) {
        return response.data;
    } else { 
        return
    } // returns json object that we can use in the frontend.
}

export async function createPost(post) {
    const response = await axios.post(`${URL}/posts`, post);
    return response
}

export async function updatePosts(id, post) {
    // http://localhost:3001/posts/id
    const response = await axios.put(`${URL}/posts/${id}`, post);
    return response
}

export async function deletePosts(id) {
    const response = await axios.delete(`${URL}/posts/${id}`);

    return response 
}

// note that when creating objects, that the fields are the same as the fields in the database (i.e. in postRoutes.js)