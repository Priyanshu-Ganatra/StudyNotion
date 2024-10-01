import React, { useState, useEffect, useRef } from 'react'

const ChatBotModal = ({ isChatbotVisible }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { type: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://studynotion-chatbot-4.onrender.com/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const data = await response.json()
      const botMessage = {
        type: 'bot',
        content: data.generated_theory,
        papers: data.arxiv_papers,
        links: data.google_search_results,
        dataVisualization: data.data_visualization
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-[calc(100vw-200px)] h-[calc(100vh-120px)] absolute bottom-14 right-20 rounded-lg bg-white shadow-lg transition-all duration-200 ease-in-out ${isChatbotVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-x-10 translate-y-10 pointer-events-none'}`}>
      <div className="w-full h-full flex flex-col p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">StudyNotion Chatbot</h2>
          <p className="text-gray-600">Ask me anything about your course! I'm here to resolve your doubts.</p>
        </div>
        <div className="flex-grow overflow-auto mb-4" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {message.content}
              </div>
              {message.papers && (
                <div className="mt-2 text-left">
                  <h3 className="font-bold">Related Papers:</h3>
                  {message.papers.map((paper, i) => (
                    <div key={i} className="mt-2 bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold">{paper.Title}</h4>
                      <p className="text-sm text-gray-600">{paper.Authors} - {paper.Published}</p>
                      <p className="mt-2 text-sm">{paper.Abstract}</p>
                      <a href={paper.Link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Read More</a>
                    </div>
                  ))}
                </div>
              )}
              {message.dataVisualization && (
                <div className="mt-4">
                  <h3 className="font-bold">Data Visualization:</h3>
                  <img src={message.dataVisualization} alt="Data Visualization" className="mt-2 max-w-full h-auto" />
                </div>
              )}
              {message.links && (
                <div className="mt-2 text-left">
                  <h3 className="font-bold">Related Links:</h3>
                  <ul className="list-disc list-inside">
                    {message.links.map((link, i) => (
                      <li key={i}>
                        <a href={link.Link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.Link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBotModal