import axios from 'axios';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Fixed template literal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      time: formatTime(new Date()),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/chat/', { message: input });

      // Format the response text
      let resarr = response.data.response.split("**");
      let formattedText = "";
      for (let i = 0; i < resarr.length; i++) {
        if (i % 2 === 1) {
          formattedText += `<b>${resarr[i]}</b>`; // Add bold tags
        } else {
          formattedText += resarr[i]; // Add regular text
        }
      }

      formattedText = formattedText.replace(/\*/g, "<br>"); // Replace "*" with "<br>"

      console.log('Response from server:', formattedText); // Log response data

      const botMessage = {
        text: formattedText,
        sender: 'bot',
        time: formatTime(new Date()),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        time: formatTime(new Date()),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
            >
              <div className={`flex items-center ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 border rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">{message.sender === 'user' ? 'U' : 'AI'}</span>
                </div>
                <div className={`bg-white p-3 rounded-lg max-w-[75%] text-sm ${message.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
                  <p dangerouslySetInnerHTML={{ __html: message.text }} />
                  <div className="text-xs text-gray-600">{message.time}</div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 justify-end">
              <div className="bg-blue-100 text-blue-900 p-3 rounded-lg max-w-[75%] text-sm">
                <p>
                  <span className="font-medium">Thinking...</span>
                </p>
              </div>
              <div className="w-8 h-8 border rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">AI</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-100 border-t px-4 py-3 md:px-6 md:py-4">
        <form onSubmit={handleSubmit} className="relative flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`p-2 rounded-r-lg text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <SendIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default App;
