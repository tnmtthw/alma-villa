import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User, Clock, FileText, Phone, MapPin } from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  suggestions?: string[]
}

interface FAQ {
  question: string
  answer: string
  keywords: string[]
  category: string
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const faqs: FAQ[] = [
    {
      question: "What are your office hours?",
      answer: "Our office is open Monday to Friday from 8:00 AM to 5:00 PM, and Saturday from 8:00 AM to 12:00 PM. 😊",
      keywords: ["office", "hours", "time", "open", "schedule", "when"],
      category: "general"
    },
    {
      question: "How can I request a barangay certificate?",
      answer: "Hi! To request documents like barangay certificates or clearances:\n\n1️⃣ Click 'Request Now' on our homepage\n2️⃣ Fill out your personal information\n3️⃣ Select the document type you need\n4️⃣ Submit your request\n\nYou'll get an email confirmation once submitted! 📄",
      keywords: ["certificate", "request", "document", "barangay", "clearance", "doc", "docs", "how", "get", "apply"],
      category: "services"
    },
    {
      question: "What documents do I need for registration?",
      answer: "For resident registration, you'll need:\n\n✅ Valid government ID (front and back)\n✅ Proof of residency\n✅ Birth certificate\n✅ Recent photo\n\nYou can also do face verification during registration. Pretty easy! 😄",
      keywords: ["registration", "documents", "requirements", "ID", "proof", "need", "register", "signup"],
      category: "registration"
    },
    {
      question: "How long does it take to process documents?",
      answer: "Processing times:\n\n⏰ Barangay certificates: 1-2 business days\n⏰ Business permits: 3-5 business days\n⏰ Registration verification: 2-3 business days\n\nWe'll email you updates on your application! 📧",
      keywords: ["processing", "time", "how long", "days", "wait", "take", "process"],
      category: "services"
    },
    {
      question: "What is the contact information for Barangay Alma Villa?",
      answer: "You can reach us at:\n\n📧 Email: almavilla.gloria@gmail.com\n📍 Location: Gloria, Oriental Mindoro\n📞 Phone: Coming soon!\n\nFeel free to visit us during office hours too! 😊",
      keywords: ["contact", "phone", "email", "address", "location", "reach", "call"],
      category: "contact"
    },
    {
      question: "How do I apply for a business permit?",
      answer: "To apply for a business permit:\n\n1️⃣ Go to Services → Business Permit\n2️⃣ Fill out your business information\n3️⃣ Upload required documents\n4️⃣ Submit application\n\nProcessing takes 3-5 business days. Good luck with your business! 🏪",
      keywords: ["business", "permit", "apply", "license", "shop", "store"],
      category: "business"
    },
    {
      question: "Can I track my application status?",
      answer: "Yes! You can track your application by:\n\n✅ Logging into your account\n✅ Going to the History page\n✅ Checking email notifications\n\nWe keep you updated every step of the way! 📱",
      keywords: ["track", "status", "application", "history", "progress", "check"],
      category: "services"
    },
    {
      question: "What forms are available for download?",
      answer: "We have various forms available on our Forms page:\n\n📋 Certificate application forms\n📋 Business permit forms\n📋 Clearance request forms\n📋 Other barangay service forms\n\nAll in PDF format for easy printing! 🖨️",
      keywords: ["forms", "download", "PDF", "application", "form"],
      category: "forms"
    }
  ]

  const quickSuggestions = [
    "How to request documents?",
    "Office hours", 
    "Business permit",
    "Contact info",
    "Registration help"
  ]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "Hi there! 👋 I'm your Alma Villa assistant! I'm here to help you with:\n\n• Document requests\n• Office information\n• Registration help\n• Business permits\n• And much more!\n\nWhat can I help you with today? 😊",
        quickSuggestions
      )
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const addBotMessage = (text: string, suggestions?: string[]) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      suggestions
    }
    setMessages(prev => [...prev, message])
  }

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

  const findBestMatch = (userInput: string): FAQ | null => {
    const input = userInput.toLowerCase()
    
    // Handle greetings first
    const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]
    const isGreeting = greetings.some(greeting => input.includes(greeting))
    
    if (isGreeting && input.length < 20) {
      // If it's just a greeting, return a greeting response
      return {
        question: "greeting",
        answer: "Hello there! 👋 Welcome to Alma Villa! How can I help you today?",
        keywords: [],
        category: "greeting"
      }
    }
    
    // Handle casual questions
    const casualPhrases = {
      "how can i": ["request", "get", "apply", "do"],
      "i want to": ["request", "get", "apply", "register"],
      "i need": ["document", "certificate", "permit", "help"],
      "can you help": ["request", "get", "apply"],
      "how do i": ["request", "get", "apply", "register"]
    }
    
    // Check for casual phrase patterns
    for (const [phrase, keywords] of Object.entries(casualPhrases)) {
      if (input.includes(phrase)) {
        for (const keyword of keywords) {
          if (input.includes(keyword)) {
            // Find FAQ that matches this keyword
            for (const faq of faqs) {
              if (faq.keywords.includes(keyword)) {
                return faq
              }
            }
          }
        }
      }
    }
    
    // Original matching logic
    for (const faq of faqs) {
      if (faq.question.toLowerCase().includes(input) || input.includes(faq.question.toLowerCase())) {
        return faq
      }
    }

    // Keyword matching with better scoring
    let bestMatch: FAQ | null = null
    let maxMatches = 0

    for (const faq of faqs) {
      let matches = 0
      for (const keyword of faq.keywords) {
        if (input.includes(keyword.toLowerCase())) {
          matches++
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches
        bestMatch = faq
      }
    }

    return maxMatches > 0 ? bestMatch : null
  }

  const generateSuggestions = (category: string): string[] => {
    const categoryFaqs = faqs.filter(faq => faq.category === category)
    return categoryFaqs.slice(0, 3).map(faq => {
      const words = faq.question.split(' ')
      return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '')
    })
  }

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText) return

    addUserMessage(messageText)
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      const match = findBestMatch(messageText)
      
      if (match) {
        const suggestions = generateSuggestions(match.category)
        addBotMessage(match.answer, suggestions.length > 0 ? suggestions : quickSuggestions)
      } else {
        addBotMessage(
          "I'm sorry, I don't have specific information about that right now. 😅\n\nBut don't worry! You can:\n\n📧 Email us: almavilla.gloria@gmail.com\n🏢 Visit our office: Monday-Friday 8AM-5PM, Saturday 8AM-12PM\n💬 Try asking about our services, office hours, or document requests!\n\nIs there anything else I can help you with? 😊",
          quickSuggestions
        )
      }
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 
          bg-[#23479A] hover:bg-[#23479A]/90 
          text-white p-4 rounded-full 
          shadow-lg transition-all duration-300 
          hover:scale-110 z-50 animate-bounce"
        aria-label="Open chat"
      >
        <Bot className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 h-[550px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50
      sm:left-auto sm:right-6 sm:w-[450px] sm:max-w-none
    ">
      {/* Header */}
      <div className="bg-[#23479A] text-white p-5 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Alma Villa Assistant</h3>
            <p className="text-xs text-blue-100">Online now</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex items-start gap-3 max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`p-2 rounded-full ${message.isBot ? 'bg-[#23479A]' : 'bg-gray-300'}`}>
                  {message.isBot ? (
                    <Bot className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <div
                    className={`p-4 rounded-lg ${
                      message.isBot
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-[#23479A] text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs text-gray-500 ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <Clock className="h-3 w-3" />
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {message.isBot && message.suggestions && (
              <div className="ml-14 space-y-2">
                <p className="text-xs text-gray-500">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-3 py-1.5 bg-white border border-[#23479A] text-[#23479A] text-xs rounded-full hover:bg-[#23479A] hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="p-2 rounded-full bg-[#23479A]">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23479A]/20 focus:border-[#23479A] text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="bg-[#23479A] hover:bg-[#23479A]/90 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBot