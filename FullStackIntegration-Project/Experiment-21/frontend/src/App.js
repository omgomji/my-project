import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// Simple chat UI, consistent with your codebase style
function App() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]); // each { user, text, time }
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    // connect once
    const s = io('http://localhost:5000');
    socketRef.current = s;

    s.on('connect', function () { setConnected(true); });
    s.on('disconnect', function () { setConnected(false); });

    s.on('history', function (hist) {
      setMessages(Array.isArray(hist) ? hist : []);
    });

    s.on('message', function (msg) {
      setMessages(prev => [...prev, msg]);
    });

    s.on('system', function (note) {
      setMessages(prev => [...prev, note]);
    });

    return function cleanup() {
      s.close();
    };
  }, []);

  useEffect(() => {
    // auto-scroll to bottom on new messages
    var el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function handleJoin(e) {
    e.preventDefault();
    if (!name.trim() || !socketRef.current) return;
    socketRef.current.emit('join', name.trim());
  }

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit('chatMessage', text.trim());
    setText('');
  }

  return (
    <div style={{ maxWidth: 420, margin: '1rem auto', border: '1px solid #000', padding: '1rem', borderRadius: 4 }}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>Real-Time Chat</h2>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={function (e) { setName(e.target.value); }}
        onBlur={handleJoin}
        style={{ width: '100%', marginBottom: 8, padding: '8px' }}
      />

      <div ref={listRef} style={{ height: 260, overflowY: 'auto', border: '1px solid #ccc', padding: '0.5rem', marginBottom: 8 }}>
        {messages.map(function (m, i) {
          var isSystem = m.user === 'System';
          return (
            <div key={i} style={{ marginBottom: 6 }}>
              <strong>{m.user}</strong> [{m.time}]: {m.text}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={function (e) { setText(e.target.value); }}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" disabled={!connected} style={{ padding: '8px 14px', cursor: 'pointer' }}>Send</button>
      </form>
    </div>
  );
}

export default App;
