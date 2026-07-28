import { useState } from 'react'

function App() {
  // 1. Estados
  const [apiKey, setApiKey] = useState('') 
  const [mensaje, setMensaje] = useState('') 
  const [historial, setHistorial] = useState([
    { role: 'assistant', content: '¡Hola! Soy Nuzumy. ¿Qué aventura jugaremos hoy?' }
  ]) 

  // 2. La función que conecta con OpenRouter
  const enviarMensaje = async () => {
    if (!mensaje.trim() || !apiKey.trim()) return alert('Por favor, ingresa tu API Key y un mensaje.')

    // Guardamos el mensaje del usuario en el historial
    const nuevoHistorial = [...historial, { role: 'user', content: mensaje }]
    setHistorial(nuevoHistorial)
    setMensaje('') 

    try {
      // ⬇️ PEGA TU LINK TÉCNICO DE COMPLETIONS DIRECTAMENTE AQUÍ ENTRE LAS COMILLAS SIMPLES:
      const urlCorrecta = 'https://openrouter.ai/api/v1/chat/completions'
      const respuesta = await fetch(urlCorrecta, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173', 
          'X-Title': 'Nuzumy AI Engine'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free', 
          messages: [
            // Personalidad del bot fija
            { role: 'system', content: 'Eres Nuzumy, un personaje de juego de rol místico y compañero leal. REGLA CRÍTICA: Tienes estrictamente prohibido narrar o decidir las acciones del usuario.' },
            ...nuevoHistorial 
          ]
        })
      })

      if (!respuesta.ok) {
        throw new Error(`Error en la API: ${respuesta.status}`)
      }

      const datos = await respuesta.json()
      
      // Mantenemos la lectura limpia usando el índice inicial del array choices
      const textoBot = datos.choices[0].message.content

      // Sumamos la respuesta obtenida de la IA al chat
      setHistorial([...nuevoHistorial, { role: 'assistant', content: textoBot }])

    } catch (error) {
      console.error(error)
      alert('Hubo un error al conectar con Nuzumy. Revisa tu API Key o la consola.')
    }
  }

  // 3. Renderizado en pantalla
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Nuzumy.ai Engine 🤖</h1>
      
      {/* Caja para la API Key */}
      <input 
        type="password" 
        placeholder="Pega tu API Key de OpenRouter aquí" 
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box' }}
      />

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
        />
        <button onClick={enviarMensaje} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Enviar
        </button>
      </div>
    </div>
  )
}

export default App
