import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, Bot, User, ShoppingBag, ArrowRight, Trash2, Mic } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/formatters';
import StarRating from '../components/common/StarRating';

export default function AiAssistantPage() {
  const { addToCart } = useCart();
  const { showToast } = useNotification();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init_1',
      sender: 'ai',
      text: "Welcome to the ShopAI Atelier Consultation Studio ✨ I am your personal shopping stylist. You may describe your aesthetic preferences, budget constraints, or specific skincare and tech requirements. (e.g. 'broad-spectrum sunscreen with zero white cast', 'wireless ANC headphones under ₹3000', or 'tactile mechanical keyboard'). How may I assist your style discovery today?",
      products: []
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const parseQueryAndMatch = (userText) => {
    const text = userText.toLowerCase().trim();
    let maxPrice = null;
    let minRating = null;
    let targetCategory = null;
    let keyword = null;

    const priceMatch = text.match(/(?:under|below|less than|<|₹|rs\.?)\s*(\d+)/i);
    if (priceMatch && priceMatch[1]) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    if (text.includes("top rated") || text.includes("highly rated") || text.includes("best rating")) {
      minRating = 4.5;
    }

    if (text.includes("sunscreen") || text.includes("sunshield") || text.includes("spf") || text.includes("skincare") || text.includes("face wash") || text.includes("skin")) {
      targetCategory = "Skincare";
      if (text.includes("sunscreen") || text.includes("spf")) keyword = "sun";
      if (text.includes("face wash") || text.includes("cleanser") || text.includes("wash")) keyword = "wash";
    } else if (text.includes("headphone") || text.includes("keyboard") || text.includes("monitor") || text.includes("electronic") || text.includes("gadget") || text.includes("audio")) {
      targetCategory = "Electronics";
      if (text.includes("headphone") || text.includes("audio")) keyword = "headphone";
      if (text.includes("keyboard")) keyword = "keyboard";
      if (text.includes("monitor") || text.includes("screen") || text.includes("display")) keyword = "monitor";
    } else if (text.includes("sneaker") || text.includes("shoe") || text.includes("fashion") || text.includes("shirt") || text.includes("backpack") || text.includes("bag")) {
      targetCategory = "Fashion";
      if (text.includes("sneaker") || text.includes("shoe")) keyword = "sneaker";
      if (text.includes("shirt")) keyword = "shirt";
      if (text.includes("backpack") || text.includes("bag")) keyword = "backpack";
    } else if (text.includes("home") || text.includes("coffee") || text.includes("lamp") || text.includes("purifier") || text.includes("desk") || text.includes("light")) {
      targetCategory = "Home";
      if (text.includes("coffee")) keyword = "coffee";
      if (text.includes("purifier") || text.includes("air")) keyword = "purifier";
      if (text.includes("lamp") || text.includes("light")) keyword = "lamp";
    }

    let results = INITIAL_PRODUCTS.filter(p => {
      let match = true;
      if (targetCategory && p.category.toLowerCase() !== targetCategory.toLowerCase()) match = false;
      if (keyword && !p.name.toLowerCase().includes(keyword) && !p.description.toLowerCase().includes(keyword)) match = false;
      if (maxPrice !== null && p.price > maxPrice) match = false;
      if (minRating !== null && p.rating < minRating) match = false;
      return match;
    });

    if (results.length === 0 && !targetCategory && maxPrice === null) {
      results = INITIAL_PRODUCTS.filter(p =>
        text.includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(text) ||
        p.features.some(f => text.includes(f.toLowerCase()))
      );
    }

    results.sort((a, b) => b.rating - a.rating);

    if (results.length > 0) {
      return {
        text: `I've analyzed your aesthetic brief! Here are ${results.length} curated piece${results.length > 1 ? 's' : ''} harmonizing with your requirements:`,
        products: results
      };
    } else {
      return {
        text: `I couldn't locate an exact piece matching "${userText}". Try specifying a category (Skincare, Electronics, Fashion, Home) or mentioning your intended budget (e.g. 'under ₹2,000')!`,
        products: []
      };
    }
  };

  const handleSend = (textToSend = input) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: text,
      products: []
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = parseQueryAndMatch(text);
      const aiMsg = {
        id: 'ai_' + (Date.now() + 1),
        sender: 'ai',
        text: reply.text,
        products: reply.products
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleVoiceSimulate = () => {
    showToast('Atelier voice listener active... 🎙️', 'info');
    setTimeout(() => {
      handleSend("Show me top-rated ANC headphones under ₹3000");
    }, 1500);
  };

  const SUGGESTED_PROMPTS = [
    "Sunscreen with zero white cast",
    "Headphones with ANC under ₹3000",
    "Tactile mechanical keyboard for coding",
    "Water-resistant commuter backpack",
    "Minimalist coffee maker for home",
    "Touch LED lamp with wireless charger"
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mocha-200 gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
            Personal Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
            AI Shopping Stylist & Consultant
          </h1>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
            showToast('Chat history cleared', 'info');
          }}
          className="text-xs font-mono uppercase tracking-wider text-mocha-500 hover:text-blush-700 flex items-center gap-1.5 self-start sm:self-auto hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-mocha-400 block mb-2 font-bold">
          Suggested Consultations
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs font-medium bg-white border border-mocha-200 text-mocha-800 hover:text-blush-700 hover:border-blush-300 px-4 py-2 rounded-full transition-all shadow-2xs hover:scale-[1.02]"
            >
              ✦ {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-mocha-200/90 shadow-md flex flex-col h-[650px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF7F2]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-2xl bg-mocha-900 text-blush-200 flex items-center justify-center shrink-0 shadow-md mt-0.5 font-serif">
                  ✦
                </div>
              )}

              <div className="max-w-[85%] space-y-3">
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-mocha-900 text-[#FAF7F2] rounded-br-xs shadow-md'
                      : 'bg-white text-mocha-900 rounded-bl-xs border border-mocha-200/80 shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Render Products Grid */}
                {msg.products && msg.products.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl border border-mocha-200 p-3 shadow-xs hover:border-blush-300 transition-all flex flex-col justify-between"
                      >
                        <div className="flex gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                            }}
                            className="w-16 h-16 rounded-xl object-cover bg-mocha-50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono font-bold text-blush-700 uppercase">
                              {prod.category}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-mocha-950 truncate">
                              {prod.name}
                            </h4>
                            <div className="mt-1">
                              <StarRating rating={prod.rating} count={prod.reviewsCount} size="xs" />
                            </div>
                            <span className="text-sm font-bold font-mono text-mocha-950 block mt-1">
                              {formatPrice(prod.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-mocha-100">
                          <button
                            onClick={() => addToCart(prod, 1)}
                            className="flex-1 py-2 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                          </button>
                          <Link
                            to={`/product/${prod.id}`}
                            className="p-2 rounded-full border border-mocha-200 text-mocha-700 hover:text-blush-700 hover:border-blush-300 transition-colors"
                            title="View piece details"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-blush-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-serif">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-mocha-400">
              <div className="w-8 h-8 rounded-xl bg-mocha-200 text-mocha-800 flex items-center justify-center text-sm">
                ✦
              </div>
              <div className="flex items-center gap-1 bg-white px-4 py-2.5 rounded-2xl border border-mocha-200 shadow-2xs">
                <span className="w-2 h-2 bg-mocha-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blush-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-mocha-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-mocha-200 flex items-center gap-3"
        >
          <button
            type="button"
            onClick={handleVoiceSimulate}
            className="p-3 rounded-full bg-[#FAF7F2] hover:bg-blush-100 text-mocha-700 hover:text-blush-700 transition-colors border border-mocha-200"
            title="Simulate Voice Input"
            aria-label="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you seek (e.g. 'broad spectrum sunscreen under 500')..."
            className="flex-1 bg-[#FAF7F2] text-xs sm:text-sm text-mocha-900 placeholder-mocha-400 px-5 py-3 rounded-full border border-mocha-200 focus:outline-none focus:bg-white focus:border-blush-400 transition-all font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-mocha-900 hover:bg-blush-600 disabled:opacity-40 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <span>Consult</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
