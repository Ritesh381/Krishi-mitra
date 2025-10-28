import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Volume, VolumeX } from 'lucide-react'; // Import Lucide icons

// --- MOCK for useTranslation to ensure compilation stability ---
const useTranslation = () => ({
    t: (key) => {
        const translations = {
            generatingResponse: 'KrishiMitra is thinking...',
            noChatsYet: 'Abhi koi chat nahi hai.',
            startNewChat: 'Nayi chat shuru karne ke liye "New Chat" par click karein.',
            deleteChat: 'Chat Delete karein',
            toggleMenu: 'Menu kholein/band karein',
            chatSessions: 'Chat Sessions',
            newChat: 'Nayi Chat',
            selectChat: 'KrishiMitra AI',
            loading: 'Loading',
            aiAssistantRole: 'Aapka samarpit kheti sahayak',
            startChatInstruction: 'Vyaktigat salah ke liye ek nayi baatcheet shuru karein.',
            aiAssistantTitle: 'KrishiMitra AI Sahayak',
            aiAssistantWelcome: 'Fasal swasthya, keet pehchaan, mausam, ya bazaar ki keematon ke baare mein apni bhasha mein kuch bhi poochhein!',
            askAnything: 'Keeton, mausam, ya fasalon ke baare mein poochhein...',
            aiDisclaimer: 'KrishiMitra AI kabhi-kabhi galat jaankari de sakta hai. Hamesha mahatvapoorn salah ki jaanch karein.',
            loadingChats: 'Chat sessions load ho rahe hain...'
        };
        return translations[key] || key;
    },
    // DEFAULT LANGUAGE KO 'hi-IN' MEIN BADLA GAYA HAI
    currentLanguage: 'hi-IN' 
});
// -----------------------------------------------------------

// --- Configuration & Constants ---
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api"
const CHAT_API_URL = `${API_BASE_URL}/chat`;

// Helper for API calls with Exponential Backoff (Now using Axios)
const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios({
        url,
        method: options.method,
        headers: options.headers,
        data: options.body ? JSON.parse(options.body) : undefined, 
      });
      return response.data;
    } catch (error) {
      const status = error.response ? error.response.status : null;
      
      if (status === 401 || status === 403) {
        throw new Error('Authentication Error: Access denied.');
      }
      
      if (i === retries - 1) {
        console.error('Axios Error (Max Retries):', error.message, error.response?.data);
        throw error;
      }
      
      const delay = Math.pow(2, i) * 1000; 
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

function Chat() {
  const { t, currentLanguage } = useTranslation();
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null); 
  const [availableVoices, setAvailableVoices] = useState([]); // Naya State
  const messagesEndRef = useRef(null);

  // --- Voice Setup Effect ---
  useEffect(() => {
    // Voices asynchoronous tareeke se load hote hain, isliye hamein 'voiceschanged' event ka intezaar karna padta hai.
    const populateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
    };

    // Agar voices pehle hi load ho chuke hain
    if (window.speechSynthesis.getVoices().length > 0) {
        populateVoices();
    } else {
        // Agar nahi hue, toh event listener set karein
        window.speechSynthesis.onvoiceschanged = populateVoices;
    }

    return () => {
        window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Native Hindi Voice dhoondhne ka helper
  const getHindiVoice = useCallback(() => {
    // 1. Sabse pehle, popular aur high-quality Hindi voices dhoondhein
    const preferredVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('google hindi') ||
        voice.name.toLowerCase().includes('microsoft heera') ||
        voice.name.toLowerCase().includes('ivona rishi')
    );

    if (preferredVoice) return preferredVoice;

    // 2. Agar koi preferred voice nahi mila, toh sirf 'hi-IN' language code waali voice dhoondhein
    const langSpecificVoice = availableVoices.find(voice => 
        voice.lang === 'hi-IN'
    );

    if (langSpecificVoice) return langSpecificVoice;

    // 3. Agar kuch nahi mila, toh default voice return karein
    return availableVoices[0] || null;
  }, [availableVoices]);


  // --- TTS Functions ---

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  }, []);

  const handleTextToSpeech = (text, messageId) => {
    stopSpeaking(); 

    if (speakingMessageId === messageId) {
      setSpeakingMessageId(null);
      return;
    }
    
    // Web Speech API available hai ya nahi check karein
    if (!('speechSynthesis' in window)) {
        console.error("Web Speech API is not supported in this browser.");
        return;
    }

    const voiceToUse = getHindiVoice(); // Hindi voice select karein

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Voice aur language set karein
    if (voiceToUse) {
        utterance.voice = voiceToUse;
        utterance.lang = voiceToUse.lang; // Use the specific lang of the selected voice
        // PRONUNCIATION FIX: Rate ko thoda badha dein (e.g., 1.1) taaki awkward transition smooth ho jaaye
        utterance.rate = 1.1; 
    } else {
        // Fallback: If no custom voice is found, set the language tag correctly
        utterance.lang = currentLanguage; // which is now 'hi-IN'
        utterance.rate = 1.0; // Default rate
    }

    // Rate ki setting ko condition ke andar le jaya gaya hai
    
    utterance.onstart = () => setSpeakingMessageId(messageId);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = (event) => {
        console.error('Speech Synthesis Error:', event.error);
        setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // --- API Helpers & Chat Functions (No change in logic, only now using Hindi translations) ---

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json', 
  });

  const fetchChats = useCallback(async () => {
    try {
      const data = await fetchWithRetry(`${CHAT_API_URL}/all`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (data.success && data.chats) {
        const sortedChats = data.chats.map(chat => ({
          ...chat,
          lastUpdated: new Date(chat.lastUpdated),
        })).sort((a, b) => b.lastUpdated - a.lastUpdated);

        setChats(sortedChats);
        if (!currentChatId && sortedChats.length > 0) {
          setCurrentChatId(sortedChats[0]._id);
        }
      } else {
        console.error('Failed to fetch chats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching chats:', error.message);
    }
  }, [currentChatId]);

  const createNewChat = async () => {
    stopSpeaking(); 
    try {
      const data = await fetchWithRetry(`${CHAT_API_URL}/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (data.success) {
        const newChat = { 
          _id: data._id, 
          title: data.title, 
          lastUpdated: new Date() 
        };
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(data._id);
        setMessages([]);
        return data._id;
      } else {
        console.error('Failed to create chat:', data.error);
      }
    } catch (error) {
      console.error('Error creating new chat:', error.message);
    }
    return null;
  };

  const fetchHistory = useCallback(async (chatId) => {
    if (!chatId) return;
    stopSpeaking(); 

    try {
      const data = await fetchWithRetry(`${CHAT_API_URL}/history?chatId=${chatId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (data.success && data.history) {
        const userAndModelMessages = data.history
          .filter(msg => msg.role === 'model' || (msg.role === 'user' && msg.parts[0].text.length < 100))
          .map((msg, index) => ({ ...msg, messageId: `${msg.role}-${index}-${Date.now()}` })); 
        setMessages(userAndModelMessages);
      } else {
        console.error('Failed to fetch chat history:', data.error);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching history:', error.message);
      setMessages([]);
    }
  }, [stopSpeaking]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;
    
    stopSpeaking(); 

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    let chatId = currentChatId;
    if (!chatId) {
      chatId = await createNewChat();
      if (!chatId) {
        setIsSending(false);
        return;
      }
    }

    const userMessageId = `user-${Date.now()}-0`;
    const loadingMessageId = `model-${Date.now()}-1`; 

    const tempMessage = { 
      role: 'user', 
      parts: [{ text: userMessage }], 
      messageId: userMessageId 
    };
    const loadingMessage = { 
      role: 'model', 
      parts: [{ text: t('generatingResponse') || 'KrishiMitra is thinking...' }], 
      isPending: true,
      messageId: loadingMessageId
    };
    
    setMessages(prev => [...prev, tempMessage, loadingMessage]);

    try {
      const data = await fetchWithRetry(`${CHAT_API_URL}/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ chatId: chatId, message: userMessage }),
      });

      if (data.success && data.reply) {
        const modelReply = { 
          role: 'model', 
          parts: [{ text: data.reply }], 
          messageId: `model-reply-${Date.now()}` 
        };
        
        setMessages(prev => {
          const newMessages = prev.filter(m => !m.isPending);
          newMessages.push(modelReply);
          return newMessages;
        });

        fetchChats(); 
      } else {
        console.error('Failed to send message:', data.error);
        setMessages(prev => prev.slice(0, -2)); 
      }
    } catch (error) {
      console.error('Network Error:', error.message);
      setMessages(prev => prev.slice(0, -2)); 
    } finally {
      setIsSending(false);
    }
  };
  
  const handleDeleteChat = async (chatId, e) => {
    if (e) e.stopPropagation(); 
    
    if (currentChatId === chatId) {
        stopSpeaking(); 
    }

    try {
      const data = await fetchWithRetry(`${CHAT_API_URL}/delete`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ chatId }), 
      });

      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        
        if (currentChatId === chatId) {
          const nextChat = chats.find(chat => chat._id !== chatId);
          setCurrentChatId(nextChat ? nextChat._id : null);
          setMessages([]);
        }
      } else {
        console.error('Failed to delete chat:', data.error);
      }
    } catch (error) {
      console.error('Error deleting chat:', error.message);
    }
  }

  // --- Effects ---
  
  useEffect(() => {
    setIsLoading(true);
    fetchChats().finally(() => setIsLoading(false));
  }, [fetchChats]);

  useEffect(() => {
    if (currentChatId) {
      setMessages([]);
      fetchHistory(currentChatId);
    }
  }, [currentChatId, fetchHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // --- Components/Helpers for Rendering ---

  const ChatList = ({ chats }) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {chats.length === 0 ? (
        <div className="text-center text-green-300 py-10">
          {t('noChatsYet')}
          <p className="text-sm mt-2">
            {t('startNewChat')}
          </p>
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => {
              setCurrentChatId(chat._id);
              setIsSidebarOpen(false); 
            }}
            className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              chat._id === currentChatId
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-green-50 hover:bg-green-100 text-green-800'
            }`}
          >
            <div className="truncate pr-2">
              <h4 className="font-semibold text-sm truncate">{chat.title}</h4>
              <p className={`text-xs ${chat._id === currentChatId ? 'text-green-100' : 'text-green-500'}`}>
                {chat.lastUpdated.toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={(e) => handleDeleteChat(chat._id, e)}
              className={`p-1 rounded-full opacity-50 hover:opacity-100 transition-opacity ${
                chat._id === currentChatId ? 'text-white hover:bg-green-700' : 'text-green-400 hover:text-red-500 hover:bg-green-200'
              }`}
              title={t('deleteChat')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );

  const MessagesDisplay = ({ messages }) => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <span className="text-6xl mb-4">🤖</span>
          <h2 className="2xl font-semibold text-green-800 mb-2">
            {t('aiAssistantTitle')}
          </h2>
          <p className="text-green-600 max-w-md">
            {t('aiAssistantWelcome')}
          </p>
        </div>
      );
    }
    
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.messageId || Math.random()} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex max-w-xl">
              {/* Button for model messages */}
              {msg.role === 'model' && !msg.isPending && (
                <button
                  onClick={() => handleTextToSpeech(msg.parts[0].text, msg.messageId)}
                  className={`p-2 rounded-full mr-2 self-start transition-colors ${
                    speakingMessageId === msg.messageId
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-green-600 hover:bg-green-100'
                  }`}
                  title={speakingMessageId === msg.messageId ? 'Awaaz Band Karein' : 'Jawab Padhein'}
                >
                  {speakingMessageId === msg.messageId ? <VolumeX size={18} /> : <Volume size={18} />}
                </button>
              )}
            
              <div 
                className={`p-4 rounded-3xl shadow-md transition-all duration-300 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-green-100 rounded-tl-none'
                }`}
              >
                {msg.parts[0].text}
                {msg.isPending && (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-lime-50 flex items-center justify-center">
        <div className="text-center p-8 rounded-xl">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 font-semibold">{t('loadingChats')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-lime-50 flex h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
      </div>

      <button 
        className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title={t('toggleMenu')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/90 backdrop-blur-sm border-r border-green-200 shadow-xl lg:relative lg:translate-x-0 transition-transform duration-300 flex flex-col pt-16 lg:pt-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-green-100 flex-shrink-0">
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
            {t('chatSessions')}
          </h2>
          <button 
            onClick={createNewChat}
            className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            title={t('newChat')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <ChatList chats={chats} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-20">
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-md shadow-md border-b border-green-100 p-4">
          <h1 className="text-xl font-bold text-green-800 truncate">
            {currentChatId 
              ? chats.find(chat => chat._id === currentChatId)?.title || (t('loading') + '...')
              : t('selectChat')}
          </h1>
          <p className="text-sm text-green-600">
            {currentChatId 
              ? t('aiAssistantRole')
              : t('startChatInstruction')}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto bg-white/50">
          <MessagesDisplay messages={messages} />
        </div>

        <div className="flex-shrink-0 bg-white border-t border-green-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              className="flex-1 px-5 py-3 rounded-full border-2 border-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 text-gray-800"
              placeholder={t('askAnything')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isSending || isLoading}
            />
            <button
              type="submit"
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                inputMessage.trim() && !isSending
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-xl transform hover:scale-105'
                  : 'bg-green-300 cursor-not-allowed'
              }`}
              disabled={!inputMessage.trim() || isSending}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
          <div className="text-center text-xs text-green-500 mt-2">
            {t('aiDisclaimer')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
