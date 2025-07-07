class DeepSeekChat {
  constructor() {
    this.messages = []
    this.isTyping = false
    this.initializeElements()
    this.bindEvents()
    this.autoResizeTextarea()
  }

  initializeElements() {
    this.sidebar = document.getElementById("sidebar")
    this.sidebarToggle = document.getElementById("sidebarToggle")
    this.newChatBtn = document.getElementById("newChatBtn")
    this.messageInput = document.getElementById("messageInput")
    this.sendBtn = document.getElementById("sendBtn")
    this.messagesContainer = document.getElementById("messagesContainer")
    this.welcomeContainer = document.getElementById("welcomeContainer")
    this.chatArea = document.getElementById("chatArea")
    this.promptCards = document.querySelectorAll(".prompt-card")
  }

  bindEvents() {
    // Sidebar toggle
    this.sidebarToggle.addEventListener("click", () => {
      this.sidebar.classList.toggle("open")
    })

    // New chat button
    this.newChatBtn.addEventListener("click", () => {
      this.startNewChat()
    })

    // Message input events
    this.messageInput.addEventListener("input", () => {
      this.handleInputChange()
      this.autoResizeTextarea()
    })

    this.messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    })

    // Send button
    this.sendBtn.addEventListener("click", () => {
      this.sendMessage()
    })

    // Prompt cards
    this.promptCards.forEach((card) => {
      card.addEventListener("click", () => {
        const prompt = card.getAttribute("data-prompt")
        this.messageInput.value = prompt
        this.handleInputChange()
        this.sendMessage()
      })
    })

    // Chat history items
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.addEventListener("click", () => {
        document.querySelectorAll(".chat-item").forEach((i) => i.classList.remove("active"))
        item.classList.add("active")
      })
    })

    // Close sidebar on mobile when clicking outside
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        !this.sidebar.contains(e.target) &&
        !this.sidebarToggle.contains(e.target) &&
        this.sidebar.classList.contains("open")
      ) {
        this.sidebar.classList.remove("open")
      }
    })
  }

  handleInputChange() {
    const hasText = this.messageInput.value.trim().length > 0
    this.sendBtn.disabled = !hasText || this.isTyping
  }

  autoResizeTextarea() {
    this.messageInput.style.height = "auto"
    this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + "px"
  }

  startNewChat() {
    this.messages = []
    this.messagesContainer.innerHTML = ""
    this.messagesContainer.style.display = "none"
    this.welcomeContainer.style.display = "flex"

    // Update chat history
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.remove("active")
    })
  }

  async sendMessage() {
    const message = this.messageInput.value.trim()
    if (!message || this.isTyping) return

    // Hide welcome screen and show messages
    this.welcomeContainer.style.display = "none"
    this.messagesContainer.style.display = "block"

    // Add user message
    this.addMessage("user", message)

    // Clear input
    this.messageInput.value = ""
    this.handleInputChange()
    this.autoResizeTextarea()

    // Show typing indicator
    this.showTypingIndicator()

    // Simulate AI response
    await this.simulateAIResponse(message)
  }

  addMessage(role, content, isTyping = false) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${role}`

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML =
      role === "user"
        ? '<i class="fas fa-user"></i>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'

    const messageContent = document.createElement("div")
    messageContent.className = "message-content"

    const messageBubble = document.createElement("div")
    messageBubble.className = "message-bubble"

    if (isTyping) {
      messageBubble.innerHTML = `
        <div class="typing-indicator">
          <span>DeepSeek is thinking</span>
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      `
    } else {
      messageBubble.textContent = content

      const messageTime = document.createElement("div")
      messageTime.className = "message-time"
      messageTime.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      messageContent.appendChild(messageTime)
    }

    messageContent.appendChild(messageBubble)
    messageDiv.appendChild(avatar)
    messageDiv.appendChild(messageContent)

    this.messagesContainer.appendChild(messageDiv)
    this.scrollToBottom()

    return messageDiv
  }

  showTypingIndicator() {
    this.isTyping = true
    this.handleInputChange()
    this.typingMessage = this.addMessage("assistant", "", true)
  }

  hideTypingIndicator() {
    if (this.typingMessage) {
      this.typingMessage.remove()
      this.typingMessage = null
    }
    this.isTyping = false
    this.handleInputChange()
  }

  async simulateAIResponse(userMessage) {
    // Simulate thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    this.hideTypingIndicator()

    // Generate a response based on the user message
    const response = this.generateResponse(userMessage)

    // Add AI response with typing effect
    await this.typeMessage("assistant", response)
  }

  generateResponse(userMessage) {
    const responses = {
      quantum:
        "Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to process information in ways that classical computers cannot. Unlike classical bits that are either 0 or 1, quantum bits (qubits) can exist in multiple states simultaneously, allowing quantum computers to perform certain calculations exponentially faster than classical computers.",
      "machine learning":
        "Machine learning is a subset of artificial intelligence that enables systems to automatically learn and improve from experience without being explicitly programmed. It involves algorithms that can identify patterns in data, make predictions, and adapt their behavior based on new information.",
      python:
        "Here's a Python function to calculate Fibonacci numbers:\n\n```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# More efficient iterative version:\ndef fibonacci_iterative(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n```",
      trip: "For planning a trip to Japan, I'd recommend:\n\n1. **Best time to visit**: Spring (March-May) for cherry blossoms or autumn (September-November) for fall colors\n2. **Must-visit cities**: Tokyo, Kyoto, Osaka, Hiroshima\n3. **Transportation**: Get a JR Pass for unlimited train travel\n4. **Cultural experiences**: Visit temples, try traditional ryokan, attend a tea ceremony\n5. **Food**: Don't miss sushi, ramen, tempura, and local specialties\n6. **Duration**: 10-14 days for a comprehensive first visit",
      data: "I'd be happy to help analyze data and provide insights! To give you the most relevant analysis, could you please:\n\n1. Share the dataset or describe the type of data you have\n2. Specify what kind of insights you're looking for\n3. Mention any particular questions you want answered\n4. Let me know the format of your data (CSV, JSON, etc.)\n\nOnce I have this information, I can help with statistical analysis, visualization suggestions, pattern identification, and actionable recommendations.",
      default:
        "I'm DeepSeek, an AI assistant created by DeepSeek. I'm here to help you with a wide range of tasks including answering questions, writing code, analyzing data, creative writing, and problem-solving. How can I assist you today?",
    }

    const lowerMessage = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(responses)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return response
      }
    }

    return responses.default
  }

  async typeMessage(role, content) {
    const messageDiv = this.addMessage(role, "")
    const messageBubble = messageDiv.querySelector(".message-bubble")

    // Type out the message character by character
    for (let i = 0; i <= content.length; i++) {
      messageBubble.textContent = content.substring(0, i)
      this.scrollToBottom()
      await new Promise((resolve) => setTimeout(resolve, 15))
    }

    // Add timestamp after typing is complete
    const messageTime = document.createElement("div")
    messageTime.className = "message-time"
    messageTime.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    messageDiv.querySelector(".message-content").appendChild(messageTime)
  }

  scrollToBottom() {
    this.chatArea.scrollTop = this.chatArea.scrollHeight
  }
}

// Initialize the chat application
document.addEventListener("DOMContentLoaded", () => {
  new DeepSeekChat()
})

// Handle window resize for responsive behavior
window.addEventListener("resize", () => {
  const sidebar = document.getElementById("sidebar")
  if (window.innerWidth > 768) {
    sidebar.classList.remove("open")
  }
})
