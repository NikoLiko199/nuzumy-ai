import { useState } from 'react';
import { ApiKeySection } from './components/ApiKeySection';
import { sendMessageToGemini } from './services/geminiService';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const systemInstruction = "Eres un personaje divertido y amigable en Nuzumy.ai.";

  const handleSend = async () => {
    if (!inputText.trim() || !apiKey) return;

    const userMessage = { sender: 'user', text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const replyText = await sendMessageToGemini({
        apiKey,
        prompt: inputText,
        systemInstruction,
        chatHistory: messages
      });

      const botMessage = { sender: 'model', text: replyText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      alert("Error al enviar mensaje: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-main-container">
      {/* AQUÍ REEMPLAZAMOS EL H1 POR TU LOGO */}
      <header className="header-logo">
        <img 
          src="/Nuzumy-AI.png" 
          alt="Nuzumy.AI" 
          className="nuzumy-logo" 
        />
      </header>
      
      <ApiKeySection apiKey={apiKey} setApiKey={setApiKey} />

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && <p className="loading-text">Pensando...</p>}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={loading || !apiKey}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;