const axios = require("axios");

const openrouterApi = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.OR_SITE_URL,
    "X-Title": process.env.OR_APP_NAME
  },
  timeout: 45_000
});

// Format minified CSS for readability
function formatCSS(css) {
  return css
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/,\s*/g, ',\n')
    .trim();
}

/**
 * Generate or patch a React component using a strong, robust prompt and parsing.
 * @param {string} prompt - The user prompt
 * @param {Array} history - Chat history [{type, content}]
 * @param {Object} currentCode - { jsx, css }
 * @param {string} model - Model name (default: "qwen/qwen-2.5-coder-32b-instruct:free")
 */
exports.generateComponent = async (
  prompt,
  history = [],
  currentCode = { jsx: "", css: "" },
  model = "qwen/qwen-2.5-coder-32b-instruct:free"
) => {
  try {
    // Strict, explicit system prompt for reliability
    const systemPrompt = `
You are a React component generator. Generate clean, properly formatted JSX and CSS.

Current code:
JSX: ${currentCode.jsx}
CSS: ${currentCode.css}

Rules:
1. Modify existing code if present, otherwise generate new code.
2. Return ONLY JSX & CSS in valid JSON format, no extra text or explanation.
3. Always include both jsx and css fields in your response.
4. Use className attributes in JSX.
5. Format CSS with proper line breaks and indentation.
6. Respond in this exact JSON format:
{
  "jsx": "clean JSX code here",
  "css": "properly formatted CSS with line breaks"
}

Example response:
{
  "jsx": "<button className=\"btn\">Click me</button>",
  "css": ".btn {\n  padding: 12px 24px;\n  background-color: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.btn:hover {\n  background-color: #2563eb;\n}"
}
    `.trim();

    // Build messages: system, then all history, then user
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map(m => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.content
      })),
      { role: "user", content: prompt }
    ];

    // API call with extra safety params
    const { data } = await openrouterApi.post("/chat/completions", {
      model,
      messages,
      temperature: 0.3, // Lower for more deterministic output
      max_tokens: 2048
    });

    const raw = data.choices[0].message.content;
    console.log('Raw AI Response:', raw); // Debug log
    let code;

    // Robust JSON extraction: find first {...} block
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        code = JSON.parse(jsonStr);
        // Ensure both jsx and css exist
        if (!code.jsx) code.jsx = "";
        if (!code.css) code.css = "";
        // Format CSS if minified
        if (code.css && code.css.includes(';') && !code.css.includes('\n')) {
          code.css = formatCSS(code.css);
        }
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (jsonErr) {
      console.warn("JSON parsing failed, attempting manual extraction:", jsonErr.message);
      // Fallback: extract JSX and CSS manually
      const jsxMatch = raw.match(/jsx["']\s*:\s*["'](.*?)["']/s);
      const cssMatch = raw.match(/css["']\s*:\s*["'](.*?)["']/s);
      code = {
        jsx: jsxMatch ? jsxMatch[1].replace(/\\"/g, '"') : raw,
        css: cssMatch ? cssMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : ""
      };
    }

    // Final validation: always return both fields
    if (!code || typeof code.jsx !== 'string' || typeof code.css !== 'string') {
      return {
        message: "Sorry, the AI response was invalid or incomplete. Please try again or rephrase your prompt.",
        code: { jsx: '', css: '' },
        error: true
      };
    }
    console.log('Parsed Code:', code); // Debug log
    return { message: "Component generated successfully", code };
  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    throw new Error(`Failed to generate component: ${err.message}`);
  }
};
