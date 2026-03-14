// MaalyPlus AI Chatbot
class MaalyPlusChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.apiKey = ''; // Will be set from environment or config
        this.init();
    }

    init() {
        this.injectStyles();
        this.injectHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .maalyplus-chatbot {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'Tajawal', sans-serif;
                direction: rtl;
            }

            .chatbot-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s, box-shadow 0.3s;
                position: relative;
            }

            .chatbot-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
            }

            .chatbot-button svg {
                width: 28px;
                height: 28px;
                fill: white;
            }

            .chatbot-button .logo-text {
                font-size: 24px;
                font-weight: 800;
                color: white;
                font-family: 'Cairo', sans-serif;
            }

            .chatbot-badge {
                position: absolute;
                top: -5px;
                left: -5px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }

            .chatbot-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 380px;
                height: 550px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease-out;
            }

            .chatbot-window.open {
                display: flex;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .chatbot-header {
                background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
                color: white;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .chatbot-header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chatbot-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }

            .chatbot-header-text h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 700;
            }

            .chatbot-header-text p {
                margin: 0;
                font-size: 12px;
                opacity: 0.9;
            }

            .chatbot-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 24px;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            }

            .chatbot-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f9fafb;
            }

            .chatbot-message {
                margin-bottom: 16px;
                display: flex;
                gap: 10px;
                animation: fadeIn 0.3s ease-out;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .chatbot-message.user {
                flex-direction: row-reverse;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                flex-shrink: 0;
            }

            .chatbot-message.user .message-avatar {
                background: #6b7280;
            }

            .message-content {
                max-width: 70%;
                padding: 12px 16px;
                border-radius: 12px;
                background: white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                line-height: 1.6;
            }

            .chatbot-message.user .message-content {
                background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
                color: white;
            }

            .message-time {
                font-size: 11px;
                color: #9ca3af;
                margin-top: 4px;
            }

            .chatbot-typing {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #9ca3af;
                animation: typing 1.4s infinite;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            .chatbot-input-area {
                padding: 16px;
                background: white;
                border-top: 1px solid #e5e7eb;
            }

            .chatbot-input-wrapper {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .chatbot-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 24px;
                font-family: 'Tajawal', sans-serif;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }

            .chatbot-input:focus {
                border-color: #2563eb;
            }

            .chatbot-send {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            }

            .chatbot-send:hover {
                transform: scale(1.1);
            }

            .chatbot-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .chatbot-send svg {
                width: 20px;
                height: 20px;
                fill: white;
            }

            .quick-replies {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 12px;
            }

            .quick-reply-btn {
                padding: 8px 16px;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 20px;
                cursor: pointer;
                font-family: 'Tajawal', sans-serif;
                font-size: 13px;
                transition: all 0.2s;
            }

            .quick-reply-btn:hover {
                border-color: #2563eb;
                background: #eff6ff;
                color: #2563eb;
            }

            @media (max-width: 768px) {
                .chatbot-window {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 120px);
                    bottom: 90px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    injectHTML() {
        const chatbotHTML = `
            <div class="maalyplus-chatbot">
                <button class="chatbot-button" id="chatbot-toggle">
                    <span class="logo-text">M+</span>
                    <span class="chatbot-badge" id="chatbot-badge" style="display: none;">1</span>
                </button>

                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-header-content">
                            <div class="chatbot-avatar" style="font-weight: 800; font-family: 'Cairo', sans-serif; color: #2563eb;">M+</div>
                            <div class="chatbot-header-text">
                                <h3>مساعد MaalyPlus</h3>
                                <p>متصل الآن</p>
                            </div>
                        </div>
                        <button class="chatbot-close" id="chatbot-close">×</button>
                    </div>

                    <div class="chatbot-messages" id="chatbot-messages"></div>

                    <div class="chatbot-input-area">
                        <div class="chatbot-input-wrapper">
                            <input 
                                type="text" 
                                class="chatbot-input" 
                                id="chatbot-input" 
                                placeholder="اكتب سؤالك هنا..."
                                autocomplete="off"
                            />
                            <button class="chatbot-send" id="chatbot-send">
                                <svg viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const badge = document.getElementById('chatbot-badge');
        
        if (this.isOpen) {
            window.classList.add('open');
            badge.style.display = 'none';
            setTimeout(() => {
                document.getElementById('chatbot-input').focus();
            }, 300);
        } else {
            window.classList.remove('open');
        }
    }

    addWelcomeMessage() {
        const welcomeMsg = {
            text: 'أهلاً وسهلاً! 👋\n\nأنا مساعدك المالي الذكي في MaalyPlus. بقدر ساعدك في:\n\n💳 اختيار أفضل بطاقة ائتمانية\n💰 حساب أقساط القروض\n🚗 تمويل السيارات\n📊 شرح المصطلحات المالية\n\nكيف بقدر ساعدك اليوم؟',
            isBot: true,
            quickReplies: [
                'بدي بطاقة ائتمانية',
                'بدي قرض شخصي',
                'شو يعني APR؟',
                'حاسبة القروض'
            ]
        };
        this.addMessage(welcomeMsg);
    }

    addMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${message.isBot ? 'bot' : 'user'}`;
        
        const time = new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' });
        
        let quickRepliesHTML = '';
        if (message.quickReplies && message.quickReplies.length > 0) {
            quickRepliesHTML = `
                <div class="quick-replies">
                    ${message.quickReplies.map(reply => 
                        `<button class="quick-reply-btn" onclick="maalyPlusChatbot.handleQuickReply('${reply}')">${reply}</button>`
                    ).join('')}
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar" style="${message.isBot ? 'font-weight: 800; font-family: Cairo, sans-serif; font-size: 16px;' : ''}">${message.isBot ? 'M+' : '👤'}</div>
            <div>
                <div class="message-content">${message.text.replace(/\n/g, '<br>')}</div>
                ${quickRepliesHTML}
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push(message);
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar" style="font-weight: 800; font-family: 'Cairo', sans-serif; font-size: 16px;">M+</div>
            <div class="message-content chatbot-typing">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage({ text: message, isBot: false });
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Get bot response
        try {
            const response = await this.getBotResponse(message);
            this.hideTyping();
            this.addMessage({ text: response, isBot: true });
        } catch (error) {
            this.hideTyping();
            this.addMessage({ 
                text: 'عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.', 
                isBot: true 
            });
        }
    }

    handleQuickReply(reply) {
        const input = document.getElementById('chatbot-input');
        input.value = reply;
        this.sendMessage();
    }

    async getBotResponse(userMessage) {
        // For demo purposes, using predefined responses
        // In production, this would call OpenAI API
        
        const responses = {
            'بدي بطاقة ائتمانية': 'أهلاً! بساعدك تلاقي أفضل بطاقة 💳\n\nعشان أرشحلك الأنسب، وين بتصرف أكثر؟\n\n• بنزين وسوبرماركت\n• مطاعم ومقاهي\n• تسوق أونلاين\n• كل الفئات متساوي',
            'بدي قرض شخصي': 'تمام! بساعدك تلاقي أفضل قرض 💰\n\nبحتاج أعرف:\n1️⃣ كم المبلغ اللي بدك تقترضه؟\n2️⃣ كم راتبك الشهري؟\n3️⃣ كم سنة بدك تسدد؟',
            'شو يعني apr': 'APR = معدل الفائدة السنوي 📊\n\nببساطة: النسبة اللي بتدفعها على القرض سنوياً.\n\nمثال: قرض 1000 دينار بـ APR 10% = تدفع 100 دينار فايدة بالسنة\n\nنصيحة: كل ما APR أقل، القرض أوفرلك ✅',
            'حاسبة القروض': 'بتقدر تستخدم حاسبة القروض من هنا:\n\n🔗 [حاسبة القروض](/calculators/calculators.html)\n\nأو احكيلي المبلغ والمدة وبحسبلك القسط الشهري! 📊'
        };
        
        // Simple keyword matching for demo
        const lowerMessage = userMessage.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key.toLowerCase())) {
                return response;
            }
        }
        
        // Default response
        return 'شكراً لسؤالك! 😊\n\nبقدر ساعدك في:\n\n💳 البطاقات الائتمانية\n💰 القروض الشخصية\n🚗 تمويل السيارات\n📊 الحاسبات المالية\n\nشو بدك تعرف بالتحديد؟';
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.maalyPlusChatbot = new MaalyPlusChatbot();
    });
} else {
    window.maalyPlusChatbot = new MaalyPlusChatbot();
}

