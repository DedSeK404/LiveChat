import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // Placeholder : simule les données utilisateur reçues de la base
  const currentUser = {
    userId: 'u123456',     // 👉 Remplacer par l'ID réel de l'utilisateur connecté
    username: 'Marwen',    // 👉 Remplacer par le nom réel
  };

  useEffect(() => {
    // Réception des messages
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Nettoyage à la fermeture
    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const payload = {
        userId: currentUser.userId,
        username: currentUser.username,
        message,
        timestamp: new Date().toISOString(),
      };

      socket.emit('send_message', payload);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>💬 Live Chat avec Socket.IO</h2>

      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'scroll' }}>
        {chat.map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}</strong>: {msg.message} <br />
            <small style={{ color: '#888' }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Écris un message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '80%', marginTop: '1rem' }}
      />
      <button onClick={sendMessage} style={{ width: '18%', marginLeft: '2%' }}>
        Envoyer
      </button>
    </div>
  );
}

export default App;
