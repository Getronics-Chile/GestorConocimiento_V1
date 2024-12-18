import React from 'react';

function PrometeoAssistant() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#006837', // Fondo actualizado
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '80vh',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
          borderRadius: '15px',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <iframe
          src="https://asistente.prometeo.getronics.dev/?code=d4c8adf1-0ba0-4345-8dc5-3685b3c80e50"
          title="Prometeo Assistant"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    </div>
  );
}

export default PrometeoAssistant;
