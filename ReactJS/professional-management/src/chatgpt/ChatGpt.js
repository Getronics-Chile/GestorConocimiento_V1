import React, { useState, useEffect } from "react";
import axios from "axios";

// Asegúrate de poner tu API Key de OpenAI aquí
const OPENAI_API_KEY = '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'; // Reemplaza con tu clave API real

function DynamicChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    // Obtener los datos de los profesionales al cargar el componente
    const fetchProfesionales = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profesional/listarTodos");
        setProfesionales(response.data);
      } catch (error) {
        console.error("Error al obtener los profesionales:", error);
      }
    };
    fetchProfesionales();
  }, []);

  const prepareContextForChatGPT = (profesionales) => {
    // Prepara los datos que enviarás como contexto para OpenAI
    return profesionales.map(prof => {
      return `Nombre: ${prof.nombres} ${prof.apaterno} ${prof.amaterno}, 
        Experiencia: ${prof.anioExperiencia} años, 
        Nivel: ${prof.nivelExperiencia}, 
        Habilidades: ${prof.habilidadesProfesional ? prof.habilidadesProfesional.map(h => h.habilidadTecnologica).join(", ") : "No disponible"}`;
    }).join("\n");
  };

  const askQuestion = async () => {
    try {
      // Prepara el contexto basado en los datos de los profesionales
      const context = prepareContextForChatGPT(profesionales);
      
      // Hacer la solicitud POST a OpenAI usando axios (corrigiendo la URL)
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions", // Usamos la ruta correcta para chat completions
        {
          model: "gpt-4o-mini", // Reemplaza con el modelo que estés utilizando
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: `Pregunta: ${question}\nContexto: ${context}` }
          ],
          temperature: 0.7
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
          }
        }
      );

      // Mostrar la respuesta de OpenAI
      setAnswer(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error al consultar:", error);
      setAnswer("Hubo un error al procesar tu pregunta.");
    }
  };

  return (
    <div>
      <h1>Pregúntale al sistema</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Escribe tu pregunta aquí..."
      ></textarea>
      <button onClick={askQuestion}>Preguntar</button>
      <div>
        <h3>Respuesta:</h3>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default DynamicChat;
