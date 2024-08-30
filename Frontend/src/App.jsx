import axios from 'axios';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
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
      setMessages(prev => [...prev, { text: formattedText, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="h-[400px] overflow-y-auto border border-gray-300 p-4 mb-4 rounded-lg bg-white">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-2 p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        ))}
        {isLoading && <div className="bg-gray-100 p-2 rounded-lg text-center">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about agriculture..."
          disabled={isLoading}
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`p-2 rounded-r-lg text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
