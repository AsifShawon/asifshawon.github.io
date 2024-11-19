import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  googleApiKey: process.env.GOOGLE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;
    console.log("message", message);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const SystemMessage = `You will act as 'Asif Bhuiyan Shawon's AI assistant. People can ask you question about 'Asif Bhuiyan Shawon' and you will answer them
    Asif Bhuiyan Shawon is a student of North South University studying Computer Science and Engineering. He is a Full Stack Developer and has experience in developing web applications using React, Node.js, Express.js, and MongoDB.
    He is currently looking for internship opportunities to further enhance his skills and gain real-world experience.
    `;

    try {
      const response = await llm.invoke([
        { role: "system", content: SystemMessage },
        { role: "user", content: message },
      ]);

      res.status(200).json({ response: response.content });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
