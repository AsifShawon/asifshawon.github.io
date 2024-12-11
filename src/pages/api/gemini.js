const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
require("dotenv").config();

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  googleApiKey: process.env.GOOGLE_API_KEY,
});

// Utility function to clean AI responses
function sanitizeAIResponse(content) {
  try {
    // Remove any backticks, markdown, or extraneous formatting
    const sanitizedContent = content
      .replace(/```json/g, "") // Remove markdown JSON block
      .replace(/```/g, "") // Remove any closing backticks
      .trim();
    return JSON.parse(sanitizedContent);
  } catch (err) {
    console.error("Error sanitizing AI response:", err.message);
    return []; // Fallback to an empty array if JSON parsing fails
  }
}

async function matchSkills(users, jobs) {
  try {
    const inputForAI = users.map(user => {
      const jobMatches = jobs.map(job => ({
        jobId: job.id,
        jobTitle: job.title,
        requiredSkills: job.skills,
      }));

      return {
        userId: user.id,
        userName: user.name,
        userDescription: user.description,
        userSkills: user.skills,
        jobs: jobMatches,
      };
    });

    const aiResponses = await Promise.all(
      inputForAI.map(async userInput => {
        const SystemMessage = `
          You are a recommendation engine. Based on the user's profile and skills, and the job requirements provided, recommend the most suitable jobs. Provide a match score and an explanation for each recommendation.

          User Profile:
          - Name: ${userInput.userName}
          - Description: ${userInput.userDescription}
          - Skills: ${userInput.userSkills.join(", ")}

          Job Opportunities:
          ${userInput.jobs
            .map(
              job =>
                `- Job ID: ${job.jobId}, Title: ${job.jobTitle}, Required Skills: ${job.requiredSkills.join(", ")}`
            )
            .join("\n")}

          Provide recommendations in JSON format as:
          [
            {
              "jobId": "ID",
              "jobTitle": "Title",
              "matchScore": "Score as percentage",
              "explanation": "Reason for recommendation"
            }
          ]
        `;

        const response = await llm.invoke([
          { role: "system", content: SystemMessage },
        ]);

        return {
          userId: userInput.userId,
          userName: userInput.userName,
          recommendations: sanitizeAIResponse(response.content || ""),
        };
      })
    );

    return aiResponses;
  } catch (error) {
    console.error("Error in AI-based skill matching:", error);
    throw error;
  }
}

module.exports = { matchSkills };
