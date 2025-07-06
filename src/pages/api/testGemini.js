const { matchSkills } = require("./gemini");

async function testMatchSkills() {
  const users = [
    {
      id: 1,
      name: "Alice",
      description: "A front-end developer skilled in React and JavaScript.",
      skills: ["JavaScript", "React", "HTML", "CSS"]
    },
    {
      id: 2,
      name: "Bob",
      description: "A back-end developer focusing on Node.js and databases.",
      skills: ["Node.js", "Express.js", "MongoDB"]
    },
    {
      id: 3,
      name: "Charlie",
      description: "Full-stack developer with a strong interest in web technologies.",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"]
    }
  ];

  const jobs = [
    {
      id: 101,
      title: "Front-End Developer",
      skills: ["JavaScript", "React", "HTML", "CSS"]
    },
    {
      id: 102,
      title: "Back-End Developer",
      skills: ["Node.js", "Express.js", "SQL"]
    },
    {
      id: 103,
      title: "Full-Stack Developer",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"]
    }
  ];

  try {
    const matches = await matchSkills(users, jobs);
    console.log("Matched Recommendations:", JSON.stringify(matches, null, 2));
  } catch (error) {
    console.error("Error in testMatchSkills:", error);
  }
}

testMatchSkills();
