// src/services/aiService.js

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const queryTechAI = async (techName, promptText) => {
  if (!GROQ_API_KEY) {
    console.warn("⚠️ VITE_GROQ_API_KEY missing in environment. Using fallback.");
    return getLocalFallbackResponse(techName, promptText);
  }

  const systemInstructions = `
You are TechMap AI, an expert technical mentor and software architecture atlas.
You MUST ALWAYS answer in clear, professional ENGLISH.

CRITICAL INSTRUCTION FOR INITIAL OVERVIEW:
When providing an initial technical breakdown, structure your response using exact Markdown headers (H2) and generous spacing between sections:

## EXTENDED CONCEPT
Provide a deep, engaging explanation of what ${techName} is, its core philosophy, and how it works under the hood. (2-3 well-spaced paragraphs).

## KEY USE CASES
- **Use Case 1**: Clear explanation.
- **Use Case 2**: Clear explanation.
- **Use Case 3**: Clear explanation.

## SUCCESS STORIES
Mention 3-4 notable companies or platforms leveraging ${techName} in production. (If not applicable, omit this section).

FORMATTING RULES:
- Everything MUST be written in English.
- Use bold highlights, bullet points, and code snippets where appropriate.
- Leave double line breaks between headings and content for crisp readability.
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      mode: "cors",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemInstructions
          },
          {
            role: "user",
            content: `Technology: "${techName}". Prompt: "${promptText}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || getLocalFallbackResponse(techName, promptText);
    }

    const errorData = await response.text();
    console.error("Groq API Response Not OK:", response.status, errorData);
    return getLocalFallbackResponse(techName, promptText, true);

  } catch (error) {
    console.error("Groq Network Error:", error);
    return getLocalFallbackResponse(techName, promptText, true);
  }
};

function getLocalFallbackResponse(techName, promptText, isRateLimited = false) {
  const query = promptText.toLowerCase();
  const notice = isRateLimited ? "\n\n*(Note: Displaying cached breakdown due to connection limit)*" : "";

  if (query.includes("simple way") || query.includes("teach me")) {
    return `💡 **Simple Metaphor for ${techName}:**\n\nImagine ${techName} as a specialized power tool in a digital workshop. Instead of building components manually, it provides pre-built blueprints for instant assembly.${notice}`;
  }

  if (query.includes("not use")) {
    return `⚡ **When NOT to use ${techName}:**\n\nAvoid using ${techName} for basic static landing pages where plain HTML/CSS deliver maximum load speeds without JavaScript overhead.${notice}`;
  }

  if (query.includes("code example")) {
    return `🛠️ **Code Example for ${techName}:**\n\n\`\`\`javascript\n// Quick startup snippet for ${techName}\nconsole.log("Initializing ${techName} module...");\n\`\`\`${notice}`;
  }

  return `## EXTENDED CONCEPT\n\n${techName} is a foundational web technology engineered to streamline complex developer workflows, optimize client-side rendering, and enhance scalable application architecture.\n\n## KEY USE CASES\n\n* **Enterprise Web Apps**: Building robust frontends with predictable state management.\n* **High-Traffic Portals**: Delivering fast initial paint times and optimized bundle sizes.\n\n## SUCCESS STORIES\n\nMeta, Vercel, Shopify, GitHub.${notice}`;
}