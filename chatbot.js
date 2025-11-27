/* =============================================== */
/* FRESHSTART JOBS - CHATBOT V3.3 (FINAL FIX)      */
/* ✅ FIX: Removed all footer avoidance logic.      */
/* ✅ FIX: Correctly scrolls .cb-body.            */
/* =============================================== */

class EnhancedCareerChatbot {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.isOpen = false;
    this.isTyping = false;
    this.userName = null;
    this.userContext = {
      interests: [],
      skills: [],
      lastIntent: null,
      messageCount: 0
    };
    
    this.lastResponseIndex = {};
    this.intents = {}; // Will be loaded from JSON
    this.quickResponses = {}; // Will be loaded from JSON

    this.config = {
      typingDelay: { min: 400, max: 800 },
      quickReplyDelay: 200,
      maxHistory: 30,
      enableML: true,
      intentsPath: "assets/json/chatbot-intents.json",
      quickResponsesPath: "assets/json/chatbot-quick.json"
    };

    this.ui = {};
    this._init();
  }

  async _init() {
    try {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this._start());
      } else {
        await this._start();
      }
    } catch (err) {
      console.error("❌ Initialization failed:", err);
    }
  }

  async _start() {
    try {
      [this.intents, this.quickResponses] = await Promise.all([
        fetch(this.config.intentsPath).then(res => res.json()),
        fetch(this.config.quickResponsesPath).then(res => res.json())
      ]);
    } catch (err) {
      console.error("❌ Critical: Could not load chatbot data (intents/quick responses).", err);
      return; 
    }

    this._createUI();
    this._attachListeners();
    
    if (this.config.enableML) {
      this._loadModelAsync();
    } else {
      this.ui.status.textContent = "Online";
    }
    
    this._welcomeMessage();
    console.log("✅ Enhanced Chatbot v3.3 (FINAL FIX) ready.");
  }

  // -------------------- UI CREATION -------------------- //
  
  _createUI() {
    document.querySelectorAll(".cb-fab, .cb-panel").forEach((e) => e.remove());

    this.ui.fab = this._createElement("div", "cb-fab", { "aria-label": "Open chat", "title": "Chat with AI" });
    this.ui.fabIcon = this._createElement("div", "cb-fab-icon", { innerHTML: "💼" });
    this.ui.fabPulse = this._createElement("div", "cb-fab-pulse");
    this.ui.badge = this._createElement("div", "cb-notification-badge", { innerHTML: "1", style: "display:none;" });
    this.ui.fab.append(this.ui.fabIcon, this.ui.fabPulse, this.ui.badge);

    this.ui.panel = this._createElement("div", "cb-panel", { "aria-hidden": "true", "role": "dialog" });
    
    // Header
    const header = this._createElement("div", "cb-header");
    const avatar = this._createElement("div", "cb-avatar", { innerHTML: "💼" });
    const info = this._createElement("div", "cb-info");
    this.ui.title = this._createElement("div", "cb-title", { innerHTML: "AI Career Assistant" });
    this.ui.statusDot = this._createElement("span", "cb-status-dot");
    this.ui.statusText = this._createElement("span", null, { innerHTML: "Online" });
    this.ui.status = this._createElement("div", "cb-status");
    this.ui.status.append(this.ui.statusDot, this.ui.statusText);
    info.append(this.ui.title, this.ui.status);
    this.ui.minimize = this._createElement("button", "cb-minimize-btn", { "aria-label": "Minimize", "title": "Minimize", innerHTML: "−" });
    this.ui.close = this._createElement("button", "cb-close-btn", { "aria-label": "Close", "title": "Close", innerHTML: "✕" });
    header.append(avatar, info, this.ui.minimize, this.ui.close);

    // Body
    this.ui.scrollBody = this._createElement("div", "cb-body"); // The scrolling part
    this.ui.msgs = this._createElement("div", "cb-messages", { "role": "log", "aria-live": "polite" }); // The content part
    this.ui.typing = this._createElement("div", "cb-typing", { style: "display:none;", "aria-live": "assertive" });
    const typingAvatar = this._createElement("div", "cb-typing-avatar", { innerHTML: "💼" });
    const typingDots = this._createElement("div", "cb-typing-dots", { innerHTML: "<span></span><span></span><span></span>" });
    this.ui.typing.append(typingAvatar, typingDots);
    this.ui.scrollBody.append(this.ui.msgs, this.ui.typing); 

    // Footer
    const footer = this._createElement("div", "cb-footer");
    this.ui.quick = this._createElement("div", "cb-quick-actions");
    this.ui.quick.append(
      this._createElement("button", null, { "data-msg": "Find jobs for me", "title": "Search for jobs", innerHTML: "🔍 Jobs" }),
      this._createElement("button", null, { "data-msg": "Resume help", "title": "Get resume assistance", innerHTML: "📄 Resume" }),
      this._createElement("button", null, { "data-msg": "Interview tips", "title": "Prepare for interviews", innerHTML: "🎤 Interview" }),
      this._createElement("button", null, { "data-msg": "Career advice", "title": "Get career guidance", innerHTML: "💡 Advice" })
    );
    const inputContainer = this._createElement("div", "cb-input-container");
    this.ui.input = this._createElement("textarea", "cb-input", { "rows": "1", "placeholder": "Ask me anything...", "aria-label": "Type your message" });
    this.ui.send = this._createElement("button", "cb-send-btn", { "aria-label": "Send message", "title": "Send" });
    this.ui.send.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10l16-8-8 16-2-6-6-2z"/></svg>`;
    inputContainer.append(this.ui.input, this.ui.send);
    footer.append(this.ui.quick, inputContainer);

    this.ui.panel.append(header, this.ui.scrollBody, footer);
    document.body.append(this.ui.fab, this.ui.panel);

    this.ui.panel.style.display = "none";
  }

  _createElement(tag, className, attributes = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'innerHTML') el.innerHTML = value;
      else if (key === 'style') el.style.cssText = value;
      else if (key === 'data-msg') el.dataset.msg = value;
      else el.setAttribute(key, value);
    }
    return el;
  }

  _attachListeners() {
    this.ui.fab.addEventListener("click", () => this.toggle());
    this.ui.close.addEventListener("click", () => this.close());
    this.ui.minimize.addEventListener("click", () => this.close());
    this.ui.send.addEventListener("click", () => this._send());
    
    this.ui.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this._send();
      }
    });
    
    this.ui.input.addEventListener("input", () => this._resizeInput());

    this.ui.quick.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-msg]");
      if (btn) this._sendQuick(btn.dataset.msg);
    });

    // ✅ **FIX:** All IntersectionObserver and footer logic has been REMOVED.
  }

  // -------------------- MODEL HANDLING (ASYNC) -------------------- //
  
  async _loadModelAsync() {
    if (typeof use === 'undefined' || typeof tf === 'undefined') {
        console.warn("⚠️ TensorFlow.js scripts not found. Running in keyword-only mode.");
        this.ui.statusText.textContent = "Online";
        return;
    }

    try {
      this.ui.statusText.textContent = "Loading AI...";
      if (!window._cachedUSEModel) {
        window._cachedUSEModel = use.load();
      }
      this.model = await window._cachedUSEModel;
      this.isModelLoaded = true;
      this.ui.statusText.textContent = "AI Enhanced";
      console.log("✅ AI model loaded - Enhanced mode active");
    } catch (err) {
      this.isModelLoaded = false;
      this.ui.statusText.textContent = "Online";
      console.error("❌ AI Model failed to load. Falling back to keyword mode.", err);
    }
  }

  // -------------------- INTENT MATCHING (OPTIMIZED) -------------------- //

  async _classifyIntent(text) {
    const lower = text.toLowerCase();
    
    const keywordIntent = this._fastKeywordMatch(lower);
    if (keywordIntent) return keywordIntent;
    
    const patternIntent = this._patternMatch(lower);
    if (patternIntent) return patternIntent;
    
    if (this.isModelLoaded && this.model) {
      return await this._mlClassify(text);
    }
    
    return "general"; // Fallback
  }

  _fastKeywordMatch(text) {
    for (const intent in this.intents) {
      if (this.intents[intent].keywords?.some(w => text.includes(w))) {
        return intent;
      }
    }
    return null;
  }

  _patternMatch(text) {
    if (/how (do|can) i|what (should|can) i|help me/i.test(text)) {
      if (/find|search|look/i.test(text)) return "jobSearch";
      if (/write|build|create/i.test(text)) return "resume";
      if (/prepare|practice/i.test(text)) return "interview";
    }
    return null;
  }

  async _mlClassify(text) {
    if (!this.isModelLoaded || !this.model || typeof tf === 'undefined') {
        console.warn("ML model not ready, falling back to keyword match.");
        return this._fastKeywordMatch(text) || "general";
    }

    try {
        return await tf.tidy(async () => {
            const lowerText = text.toLowerCase();
            const embed = await this.model.embed([lowerText]);
            let bestIntent = "general";
            let bestScore = 0;
            
            for (const [intent, data] of Object.entries(this.intents)) {
                if (!data.patterns || data.patterns.length === 0) continue;
                const patternsEmbed = await this.model.embed(data.patterns);
                const similarity = tf.matMul(
                    tf.util.l2Normalize(embed), 
                    tf.util.l2Normalize(patternsEmbed), 
                    false, 
                    true
                );
                const scores = await similarity.data();
                const maxScore = Math.max(...scores);
                
                if (maxScore > bestScore && maxScore > 0.4) {
                    bestScore = maxScore;
                    bestIntent = intent;
                }
            }
            return bestIntent;
        });
    } catch (err) {
        console.error("❌ ML classification failed:", err);
        return this._fastKeywordMatch(text.toLowerCase()) || "general";
    }
  }

  // -------------------- RESPONSE GENERATION -------------------- //

  async _generateResponse(text) {
    const intent = await this._classifyIntent(text);
    this.userContext.lastIntent = intent;
    this.userContext.messageCount++;
    
    this._extractContext(text);
    
    const intentData = this.intents[intent] || this.intents.general;
    let availableResponses = intentData.responses;
    
    if (this.userContext.messageCount > 3 && intentData.followUp) {
      availableResponses = availableResponses.concat(intentData.followUp);
    }
    
    let responseIndex;
    const lastIndex = this.lastResponseIndex[intent];

    if (availableResponses.length > 1 && lastIndex !== undefined) {
      do {
        responseIndex = Math.floor(Math.random() * availableResponses.length);
      } while (responseIndex === lastIndex);
    } else {
      responseIndex = Math.floor(Math.random() * availableResponses.length);
    }

    this.lastResponseIndex[intent] = responseIndex;
    let response = availableResponses[responseIndex];
    
    response = this._addContextualInfo(response, text, intent);
    
    return response;
  }

  _extractContext(text) {
    const lower = text.toLowerCase();
    
    if (!this.userName && /my name is (\w+)|i'm (\w+)|call me (\w+)/i.test(text)) {
      const match = text.match(/my name is (\w+)|i'm (\w+)|call me (\w+)/i);
      this.userName = match[1] || match[2] || match[3];
      this.userContext.lastIntent = 'providedName';
    }
    
    const roles = ["engineer", "developer", "designer", "manager", "analyst", "consultant"];
    roles.forEach(role => {
      if (lower.includes(role) && !this.userContext.interests.includes(role)) {
        this.userContext.interests.push(role);
      }
    });
  }

  _addContextualInfo(response, text, intent) {
    if (this.userName) {
      response = response.replace(/Hi|Hello/g, `Hi ${this.userName}`);
    }

    if (intent === 'providedName') {
      return `Nice to meet you, ${this.userName}! How can I help you today?`;
    }

    if (intent === 'jobSearch' && this.userContext.skills.length > 0) {
      const lastSkill = this.userContext.skills[this.userContext.skills.length - 1];
      if (text.toLowerCase().includes(lastSkill)) {
         return `Got it! Looking for **${lastSkill}** roles. 🎯 To help me narrow it down, what location are you interested in?`;
      }
    }
    
    return response;
  }

  // -------------------- MESSAGE HANDLING -------------------- //

  async _send() {
    const text = this.ui.input.value.trim();
    if (!text || this.isTyping) return;
    
    this._addUser(text);
    this.ui.input.value = "";
    this._resizeInput();
    
    await this._respondToMessage(text);
  }

  async _sendQuick(msg) {
    this._addUser(msg);
    
    const quickReply = this.quickResponses[msg.toLowerCase()];
    if (quickReply) {
      await this._delayedResponse(quickReply, this.config.quickReplyDelay);
    } else {
      await this._respondToMessage(msg);
    }
  }

  async _respondToMessage(text) {
    this.isTyping = true;
    this._showTyping(true);
    
    const delay = this.config.typingDelay.min + Math.random() * (this.config.typingDelay.max - this.config.typingDelay.min);
    
    const [reply] = await Promise.all([
      this._generateResponse(text),
      new Promise(r => setTimeout(r, delay))
    ]);
    
    this._showTyping(false);
    this._addBot(reply);
    this.isTyping = false;
  }

  async _delayedResponse(reply, delay) {
    this.isTyping = true;
    this._showTyping(true);
    await new Promise(r => setTimeout(r, delay));
    this._showTyping(false);
    this._addBot(reply);
    this.isTyping = false;
  }

  _addUser(msg) {
    const div = this._createElement("div", "cb-message user");
    const content = this._createElement("div", null, { innerHTML: this._escape(msg) });
    div.append(content);
    this.ui.msgs.appendChild(div);
    this._scroll();
  }

  _addBot(msg) {
    const html = this._markdown(msg);
    const div = this._createElement("div", "cb-message bot");
    const content = this._createElement("div", null, { innerHTML: html });
    div.append(content);
    this.ui.msgs.appendChild(div);
    this._scroll();
    
    if (!this.isOpen) {
      this.ui.badge.textContent = (parseInt(this.ui.badge.textContent) || 0) + 1;
      this.ui.badge.style.display = "flex";
    }
  }

  _showTyping(show) {
    this.ui.typing.style.display = show ? "flex" : "none";
    this.ui.send.disabled = show;
    this.ui.input.disabled = show;
    if (show) this._scroll();
  }

  // -------------------- UI UTILITIES -------------------- //

  _resizeInput() {
    const ta = this.ui.input;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }

  _scroll() {
    // ✅ **FIX:** This now targets `this.ui.scrollBody` (the .cb-body div).
    requestAnimationFrame(() => {
      this.ui.scrollBody.scrollTop = this.ui.scrollBody.scrollHeight;
    });
  }

  _adjustPosition(footerEntry) {
    // ✅ **FIX:** All logic removed.
  }

  _escape(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  _markdown(str) {
    let html = this._escape(str);
    
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Unordered lists: • item
    html = html.replace(/^\s*•\s*(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Newlines
    html = html.replace(/\n/g, "<br>");

    return html;
  }

  // -------------------- TOGGLE -------------------- //
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.ui.panel.style.display = "flex";
    this.ui.panel.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      this.ui.panel.classList.add("cb-open");
      this.ui.fabIcon.textContent = "✕";
      this.ui.badge.style.display = "none";
      this.ui.badge.textContent = "0";
    });
    this._scroll();
    this.ui.input.focus();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.ui.panel.classList.remove("cb-open");
    this.ui.panel.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      this.ui.panel.style.display = "none";
      this.ui.fabIcon.textContent = "💼";
    }, 300);
  }

  _welcomeMessage() {
    const hour = new Date().getHours();
    let greeting = "Hello";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";
    
    const welcome = `${greeting}! 👋 Welcome to **FreshStart Jobs**.

I'm your AI Career Assistant, here to help you succeed! I can assist with:

• 🔍 **Job Search**
• 📄 **Resume Building**
• 🎤 **Interview Prep**
• 💡 **Career Advice**

**What would you like help with today?**`;
    
    this._addBot(welcome);
  }
}

// Auto-initialize with improved error handling
(function() {
  function initChatbot() {
    try {
      if (!window.aiChatbot) {
        window.aiChatbot = new EnhancedCareerChatbot();
        console.log("🤖 Enhanced Career Chatbot v3.3 (FINAL FIX) initialized successfully");
      }
    } catch (err) {
      console.error("Failed to initialize chatbot:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();