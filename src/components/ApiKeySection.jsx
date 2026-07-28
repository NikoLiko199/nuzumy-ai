import { useState } from 'react';

export function ApiKeySection({ apiKey, setApiKey }) {
  const [showKey, setShowKey] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="api-key-container">
      <div className="input-wrapper">
        <input
          type={showKey ? "text" : "password"}
          className="api-key-input"
          placeholder="Pega tu API Key de Gemini..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value.trim())}
        />
        <button 
          type="button" 
          className="toggle-visibility-btn"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? "Ocultar" : "Ver"}
        </button>
      </div>

      <p className="help-label">
        ¿Sin saldo o sin Key?{' '}
        <span 
          className="guide-link" 
          onClick={() => setShowGuide(!showGuide)}
        >
          Conseguí tu Key GRATIS de Gemini acá
        </span>
      </p>

      {showGuide && (
        <div className="guide-card">
          <h4>Pasos para obtener tu Key:</h4>
          <ol>
            <li>Entrá a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>.</li>
            <li>Iniciá sesión con tu cuenta de Google y seleccioná <strong>"Create API key"</strong>.</li>
            <li>Copiá la clave que empieza con <code>AIzaSy...</code> y pégala arriba.</li>
          </ol>
        </div>
      )}
    </div>
  );
}