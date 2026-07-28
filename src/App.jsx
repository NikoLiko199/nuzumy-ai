import { useState } from 'react'

function App() {
  // 1. Estados
  const [mostrarKey, setMostrarKey] = useState(false)
  const [apiKey, setApiKey] = useState('') 
  const [mensaje, setMensaje] = useState('') 
  const [cargando, setCargando] = useState(false)
  const [historial, setHistorial] = useState([
    { role: 'assistant', content: '¡Hola! Soy Nuzumy. ¿Qué aventura jugaremos hoy?' }
  ]) 

  // 2. La función que conecta con DeepSeek
  const enviarMensaje = async () => {
    if (!mensaje.trim() || !apiKey.trim() || cargando) return

    // Guardamos el mensaje del usuario en el historial
    const nuevoHistorial = [...historial, { role: 'user', content: mensaje }]
    setHistorial(nuevoHistorial)
    setMensaje('') 
    setCargando(true)

    try {
      const endpointBase = 'https://api.deepseek.com'
      const endpointRuta = '/v1/chat/completions'
      const urlFinal = endpointBase + endpointRuta

      const respuesta = await fetch(urlFinal, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            // Personalidad del bot fija
            { 
              role: 'system', 
              content: 'Eres Nuzumy, un personaje de juego de rol místico y compañero leal. REGLA CRÍTICA: Tienes estrictamente prohibido narrar o decidir las acciones del usuario.' 
            },
            ...nuevoHistorial 
          ]
        })
      })

      if (!respuesta.ok) {
        throw new Error(`Error en la API: ${respuesta.status}`)
      }

      const datos = await respuesta.json()
      
      // Lectura del formato estándar del Array choices
      const textoBot = datos.choices[0].message.content

      // Sumamos la respuesta obtenida de la IA al chat
      setHistorial([...nuevoHistorial, { role: 'assistant', content: textoBot }])

    } catch (error) {
      console.error(error)
      alert('Hubo un error al conectar con Nuzumy. Revisa tu API Key o los créditos.')
    } finally {
      setCargando(false)
    }
  }

  // 3. Renderizado en pantalla
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Nuzumy.ai🐭</h1>

      {/* Caja para la API Key con ojito */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type={mostrarKey ? 'text' : 'password'} 
          placeholder="Pega tu API Key de DeepSeek aquí" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ flex: 1, padding: '10px', boxSizing: 'border-box' }}
        />
        <button 
          type="button"
          onClick={() => setMostrarKey(!mostrarKey)}
          style={{ padding: '10px', cursor: 'pointer', background: '#e9e9eb', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          {mostrarKey ? '👁️ Ocultar' : '👁️ Ver'}
        </button>
      </div>

      {/* Ventana de Chat */}
      <div style={{ border: '1px solid #ccc', height: '400px', overflowY: 'auto', padding: '10px', background: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {historial.map((msg, index) => (
          <div key={index} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{ background: msg.role === 'user' ? '#007bff' : '#e9e9eb', color: msg.role === 'user' ? '#fff' : '#000', padding: '10px', borderRadius: '10px' }}>
              <strong>{msg.role === 'user' ? 'Tú: ' : 'Nuzumy: '}</strong>
              <span>{msg.content}</span>
            </div>
          </div>
        ))}
        {cargando && (
          <div style={{ alignSelf: 'flex-start', color: '#666', fontSize: '0.9em' }}>
            <em>Nuzumy está pensando...</em>
          </div>
        )}
      </div>

      {/* Input para escribir */}
      <div style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Escribe un mensaje de rol..." 
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          style={{ flex: 1, padding: '10px' }}
          onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()} 
          disabled={cargando}
        />
        <button 
          onClick={enviarMensaje} 
          disabled={cargando || !mensaje.trim() || !apiKey.trim()}
          style={{ 
            padding: '10px 20px', 
            background: cargando ? '#ccc' : '#007bff', 
            color: '#fff', 
            border: 'none', 
            cursor: cargando ? 'not-allowed' : 'pointer' 
          }}
        >
          {cargando ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}

export default App