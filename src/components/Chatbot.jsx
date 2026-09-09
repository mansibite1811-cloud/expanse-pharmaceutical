import { useState, useRef, useEffect } from 'react'
import styles from './Chatbot.module.css'

const BOT_NAME = 'Pharma Assistant'
const INITIAL_MESSAGES = [
  { id: 1, from: 'bot', text: 'Hello! 👋 I\'m your Expanse Pharma assistant. How can I help you today?' },
]

// Predefined question→answer pairs (dummy / static)
const FAQ = [
  {
    triggers: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'],
    answer: 'Hello there! 😊 How can I assist you with medicines or your quotation today?',
  },
  {
    triggers: ['quotation', 'quote', 'request', 'order'],
    answer: 'To request a quotation, simply select the medicines you need using the checkboxes, set the quantity for each, and click the **Request Quotation** button at the bottom of the page.',
  },
  {
    triggers: ['price', 'cost', 'pricing', 'how much', 'rate'],
    answer: 'All medicine prices are displayed on each card in USD per pack/strip. The quotation pop-up shows a detailed breakdown including unit price, quantity, subtotal, 8% tax, and the final total.',
  },
  {
    triggers: ['delivery', 'shipping', 'ship', 'deliver'],
    answer: 'We offer nationwide delivery within 3–7 business days. Expedited shipping (1–2 days) is available for urgent orders. Shipping fees will be quoted separately.',
  },
  {
    triggers: ['minimum', 'moq', 'minimum order'],
    answer: 'Our minimum order quantity (MOQ) varies by product. Most medicines have an MOQ of 5 strips/packs. Bulk discounts apply for orders above 100 units.',
  },
  {
    triggers: ['payment', 'pay', 'invoice', 'billing'],
    answer: 'We accept bank transfer, credit/debit cards, and Net 30 payment terms for registered clients. All invoices are payable within 30 days of delivery.',
  },
  {
    triggers: ['antibiotic', 'antibiotics'],
    answer: 'We stock a wide range of antibiotics including Amoxicillin, Azithromycin, Doxycycline, and Ciprofloxacin. All require a valid prescription to dispense.',
  },
  {
    triggers: ['supplement', 'vitamins', 'vitamin'],
    answer: 'Our supplement range includes Vitamin C, Calcium, Zinc, Folic Acid, and Multivitamins — all available without a prescription.',
  },
  {
    triggers: ['contact', 'email', 'phone', 'reach', 'call'],
    answer: 'You can reach us at **contact@expansepharma.com** or call **+1 (800) 555-0192**. Our team is available Monday–Friday, 8 AM – 6 PM EST.',
  },
  {
    triggers: ['return', 'refund', 'exchange'],
    answer: 'Returns are accepted within 7 days of delivery for unopened products in original packaging. Please contact our support team to initiate a return.',
  },
  {
    triggers: ['stock', 'available', 'availability', 'in stock'],
    answer: 'All medicines listed in the catalog are currently in stock. For large bulk orders, please contact us 48 hours in advance to ensure availability.',
  },
  {
    triggers: ['thanks', 'thank you', 'thank', 'appreciated'],
    answer: 'You\'re most welcome! 😊 Feel free to ask if you have any more questions. Have a great day!',
  },
  {
    triggers: ['bye', 'goodbye', 'see you', 'later'],
    answer: 'Goodbye! Have a wonderful day. Don\'t hesitate to return if you need help with your pharmaceutical needs. 👋',
  },
]

function getBotReply(userText) {
  const lower = userText.toLowerCase().trim()
  for (const faq of FAQ) {
    if (faq.triggers.some((t) => lower.includes(t))) {
      return faq.answer
    }
  }
  return "I'm not sure I understand that. Could you rephrase? You can ask me about **pricing**, **delivery**, **quotations**, **payment**, **stock**, or **contact** information."
}

let msgIdCounter = 100

export default function Chatbot({ isModalOpen = false }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, typing])

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120)
      setUnread(0)
    }
  }, [open])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: ++msgIdCounter, from: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Simulate typing delay
    const delay = 800 + Math.random() * 600
    setTimeout(() => {
      const replyText = getBotReply(text)
      const botMsg = { id: ++msgIdCounter, from: 'bot', text: replyText }
      setMessages((prev) => [...prev, botMsg])
      setTyping(false)
      if (!open) setUnread((n) => n + 1)
    }, delay)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedQuestions = [
    'How do I get a quotation?',
    'What are your delivery options?',
    'Do you offer bulk discounts?',
  ]

  const handleSuggestion = (q) => {
    setInput(q)
    setTimeout(() => {
      const userMsg = { id: ++msgIdCounter, from: 'user', text: q }
      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setTyping(true)
      setTimeout(() => {
        const replyText = getBotReply(q)
        const botMsg = { id: ++msgIdCounter, from: 'bot', text: replyText }
        setMessages((prev) => [...prev, botMsg])
        setTyping(false)
      }, 900)
    }, 100)
  }

  // Render message text with basic **bold** support
  const renderText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    )
  }

  if (isModalOpen) return null

  return (
    <div className={styles.chatbotRoot}>
      {/* ── Chat Window ── */}
      {open && (
        <div className={styles.chatWindow} role="region" aria-label="Pharma Assistant chat">
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <span className={styles.onlineDot} aria-label="Online" />
              </div>
              <div>
                <div className={styles.botName}>{BOT_NAME}</div>
                <div className={styles.botStatus}>
                  {typing ? (
                    <span className={styles.typingStatus}>Typing<span className={styles.dots}><span>.</span><span>.</span><span>.</span></span></span>
                  ) : 'Online · Replies instantly'}
                </div>
              </div>
            </div>
            <button
              className={styles.closeChat}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.msgRow} ${msg.from === 'user' ? styles.userRow : styles.botRow}`}>
                {msg.from === 'bot' && (
                  <div className={styles.botAvatar} aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4l3 3"/>
                    </svg>
                  </div>
                )}
                <div className={`${styles.bubble} ${msg.from === 'user' ? styles.userBubble : styles.botBubble}`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className={`${styles.msgRow} ${styles.botRow}`}>
                <div className={styles.botAvatar} aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <div className={`${styles.bubble} ${styles.botBubble} ${styles.typingBubble}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only show if ≤ 2 messages) */}
          {messages.length <= 2 && (
            <div className={styles.suggestions}>
              {suggestedQuestions.map((q) => (
                <button key={q} className={styles.suggestionBtn} onClick={() => handleSuggestion(q)} type="button">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.chatInput}
              type="text"
              placeholder="Ask about medicines, pricing, delivery…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              aria-label="Chat message"
              maxLength={300}
            />
            <button
              className={`${styles.sendBtn} ${input.trim() ? styles.sendBtnActive : ''}`}
              onClick={sendMessage}
              disabled={!input.trim()}
              type="button"
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── FAB Toggle Button ── */}
      <button
        id="chatbot-toggle-btn"
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open Pharma Assistant'}
        type="button"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {unread > 0 && (
              <span className={styles.unreadBadge} aria-label={`${unread} unread messages`}>{unread}</span>
            )}
          </>
        )}
      </button>

      {/* Pulse ring animation when chat is closed */}
      {!open && <span className={styles.fabRing} aria-hidden="true" />}
    </div>
  )
}
