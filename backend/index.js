const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuration de CORS pour autoriser la connexion du client React
const io = new Server(server, {
  cors: {
    origin: '*', // Remplacer par l'URL du frontend en production
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('🔌 Utilisateur connecté:', socket.id);

  // Événement reçu lorsqu’un message est envoyé
  socket.on('send_message', (data) => {
    /**
     *  Exemple de structure de "data":
     * {
     *   userId: 'abc123',
     *   username: 'Jean',
     *   message: 'Salut tout le monde',
     *   timestamp: '2025-05-22T13:20:00Z'
     * }
     *
     *  Ici, tu peux ajouter un appel à la base de données
     *    pour valider l’utilisateur ou enregistrer le message.
     */

    // Réémission du message à tous les clients
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Utilisateur déconnecté:', socket.id);
  });
});

// Lancement du serveur sur le port 5000
const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Serveur Socket.IO sur le port ${PORT}`));