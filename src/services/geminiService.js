export async function sendMessageToGemini({ apiKey, prompt, systemInstruction, chatHistory = [] }) {
  if (!apiKey) {
    throw new Error("Falta la API Key");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const formattedContents = [
    ...chatHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ];

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: formattedContents,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 800
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error HTTP: ${response.status}`);
  }

  const data = await response.json();
  const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!botResponse) {
    throw new Error("No se generó ninguna respuesta");
  }

  return botResponse;
}