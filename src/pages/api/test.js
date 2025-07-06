import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const { matchSkills } = require("./gemini");

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  googleApiKey: process.env.GOOGLE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { users, jobs } = req.body;

    if (!users || !jobs) {
      return res.status(400).json({ error: "Users and jobs data are required" });
    }

    const SystemMessage = `
      You are a helpful assistant. Based on the user profiles and job postings provided, recommend the most suitable jobs for each user with scoring and matched skills.

      Users: {users}
      Jobs: {jobs}

      Provide detailed recommendations:
    `;

    try {
      // Step 1: Match users with jobs using Gemini
      const matches = await matchSkills(users, jobs);

      // Step 2: Generate LLM response
      const promptContent = SystemMessage.replace(
        "{users}",
        JSON.stringify(users)
      ).replace("{jobs}", JSON.stringify(jobs));

      const response = await llm.invoke([
        { role: "system", content: promptContent },
        { role: "assistant", content: JSON.stringify(matches) },
      ]);

      // Debugging the response structure
      console.log("Full Response:", response);

      // Ensure the response is processed correctly
      const responseContent = response?.content || response[0]?.content || "No content returned";

      console.log("Processed Response Content:", responseContent);

      res.status(200).json({ response: responseContent });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
