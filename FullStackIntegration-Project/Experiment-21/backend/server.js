// Simple Express + Socket.io chat server (kept at your codebase's level)
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000; // align with CORS theory (frontend at :3000)

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // CRA default port
app.use(express.json());

app.get('/', function (req, res) {
	res.send('<h2>Experiment 21 - Socket.io Chat</h2><p>Connect via Socket.io from the frontend.</p>');
});

// Create HTTP server and bind Socket.io
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST']
	}
});

// In-memory message history and simple user map
let messages = []; // each: { user, text, time }
const users = new Map(); // socket.id -> userName

function nowTime() {
	const d = new Date();
	const hh = String(d.getHours()).padStart(2, '0');
	const mm = String(d.getMinutes()).padStart(2, '0');
	const ss = String(d.getSeconds()).padStart(2, '0');
	return hh + ':' + mm + ':' + ss;
}

io.on('connection', function (socket) {
	// send current history to the new client
	socket.emit('history', messages);

	// client notifies their chosen name
	socket.on('join', function (userName) {
		users.set(socket.id, String(userName || 'Anonymous'));
		const note = { user: 'System', text: (users.get(socket.id)) + ' joined the chat', time: nowTime() };
		messages.push(note);
		io.emit('system', note);
	});

	// chat message broadcast
	socket.on('chatMessage', function (text) {
		const user = users.get(socket.id) || 'Anonymous';
		const msg = { user: user, text: String(text || ''), time: nowTime() };
		messages.push(msg);
		io.emit('message', msg); // broadcast to all
	});

	socket.on('disconnect', function () {
		const name = users.get(socket.id);
		if (name) {
			const note = { user: 'System', text: name + ' left the chat', time: nowTime() };
			messages.push(note);
			io.emit('system', note);
		}
		users.delete(socket.id);
	});
});

server.listen(PORT, function () {
	console.log('Chat server running on http://localhost:' + PORT);
});

