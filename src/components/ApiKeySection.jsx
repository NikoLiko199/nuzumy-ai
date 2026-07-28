import { useState } from 'react';

export function ApiKeySection({ apiKey, setApiKey }) {
  const [provider, setProvider] = useState('gemini');
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="api-key-container">
      {/* Selector de modelo */}
      <div className="provider-selector">
        <label htmlFor="provider-select">Modelo:</label>
        <select 
          id="provider-select"
          value={provider} 
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="gemini">Google Gemini (Gratis con Key)</option>
          <option value="custom">API Personalizada / Otra API</option>
        </select>
      </div>

      {/* Input de la API Key */}
      {provider === 'gemini' ? (
        <div className="input-wrapper">
          <input 
            type="password" 
            className="api-key-input"
            placeholder="Pega tu API Key de Gemini..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      ) : (
        <div className="input-wrapper">
          <input 
            type="text" 
            className="api-key-input"
            placeholder="Endpoint de API personalizada..."
          />
        </div>
      )}

      {/* Botón/Enlace de ayuda */}
      {provider === 'gemini' && (
        <div className="help-label">
          ¿No tienes una Key?{' '}
          <span className="guide-link" onClick={() => setShowGuide(!showGuide)}>
            Consigue tu Key GRATIS aquí
          </span>
        </div>
      )}

      {/* Guía explicativa con el LINK directo */}
      {showGuide && provider === 'gemini' && (
        <div className="guide-card">
          <p style={{ margin: '0 0 6px 0', fontWeight: 'bold' }}>
            Es 100% gratuita y sin datos de pago:
          </p>
          <ol>
            <li>
              Entra a{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#60a5fa', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                Google AI Studio ↗
              </a>{' '}
              con tu cuenta de Google.
            </li>
            <li>Haz clic en <strong>"Create API Key"</strong>.</li>
            <li>Copia el código y pégalo en el campo de arriba.</li>
          </ol>
        </div>
      )}
    </div>
  );
}