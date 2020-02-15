import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  
  const [author, setAuthor] = useState('');
  const [userMessage, setUserMessage] = useState('');  
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(author.length && userMessage.length) {
      const msgObj = {
        author,
        userMessage
      };

      setUserMessage('');
      setMessages([...messages, msgObj]);
      
      socket.emit('message', msgObj);
    }
    
  }

  useEffect(() => {
    if(messages.length >= 10) {
      const slicedMessages = messages.slice(10, messages.length);

      setMessages(slicedMessages);
    }
  }, [messages]);

  useEffect(() => {
    socket.on('prevMsg', (msgObj) => {
      setMessages(msgObj);
    });

    socket.off('prevMsg');

    socket.on('messageSend', (msgObj) => {
      setMessages([...messages, msgObj]);
    });
  });

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" placelholder="Nick" value={author} onChange={e => setAuthor(e.target.value)}/>
        <br/>
        <input type="text" placelholder="Mensagem" value={userMessage} onChange={e => setUserMessage(e.target.value)}/>
        <br/>
        <input type="submit" value="Enviar"/>

        <br/>
        <div id="messages">
          {messages.map((msg, index) => (
            <p><strong>{msg.author}</strong>: {msg.userMessage}</p>
          ))}
        </div>
        
      </form>
    </div>
  );
}

export default App;
