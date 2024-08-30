import axios from 'axios';
import {ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from 'react';
axios.defaults.baseURL = 'http://127.0.0.1:8000';

function App() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions/')
      setMessages(response.data.results)
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    try {
      const response = await axios.post('/api/answers/', { text: inputMessage })
      setMessages(prevMessages => [...prevMessages, response.data])
      setInputMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const voteAnswer = async (answerId, voteType) => {
    try {
      await axios.post(`/api/answers/${answerId}/vote/`, { vote_type: voteType })
      fetchQuestions() // Refresh the questions to update vote counts
    } catch (error) {
      console.error('Error voting:', error)
    }
  }
  return (
    <>
      <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Agriculture Chatbot</h1>
      <div className="flex-grow mb-4 overflow-y-auto border rounded-md p-4 bg-white">
        {messages.map((question) => (
          <div key={question.id} className="mb-4">
            <div className="bg-gray-200 p-3 rounded-t-md">
              <p className="font-semibold text-gray-800">{question.text}</p>
            </div>
            {question.answers.map((answer) => (
              <div key={answer.id} className={`p-3 rounded-b-md ${answer.is_bot_answer ? 'bg-blue-100' : 'bg-green-100'}`}>
                <p className="mb-2 text-gray-700">{answer.text}</p>
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center px-2 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-200"
                    onClick={() => voteAnswer(answer.id, 'up')}
                    aria-label="Upvote"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>Upvote</span>
                  </button>
                  <button
                    className="flex items-center px-2 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-200"
                    onClick={() => voteAnswer(answer.id, 'down')}
                    aria-label="Downvote"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    <span>Downvote</span>
                  </button>
                  <span className="text-sm text-gray-500">Votes: {answer.votes}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask an agriculture-related question..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
    </>
  )
}

export default App
