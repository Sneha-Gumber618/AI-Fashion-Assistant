import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X, Send, Bot, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

export default function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome to ShopAI Atelier ✨ I am your personal shopping stylist. Tell me what you're looking for (e.g. 'sunscreen with zero white cast', 'noise-cancelling headphones under ₹3000', or 'tactile keyboard for typing') and I'll find your ideal match!",
      products: []
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { addToCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const parseAndRecommend = (userText) => {
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
      if (text.includes("face wash") || text.includes("cleanser")) keyword = "wash";
    } else if (text.includes("headphone") || text.includes("keyboard") || text.includes("monitor") || text.includes("electronic") || text.includes("gadget") || text.includes("audio")) {
      targetCategory = "Electronics";
      if (text.includes("headphone") || text.includes("audio")) keyword = "headphone";
      if (text.includes("keyboard")) keyword = "keyboard";
      if (text.includes("monitor") || text.includes("screen")) keyword = "monitor";
    } else if (text.includes("sneaker") || text.includes("shoe") || text.includes("fashion") || text.includes("shirt") || text.includes("backpack") || text.includes("bag")) {
      targetCategory = "Fashion";
      if (text.includes("sneaker") || text.includes("shoe")) keyword = "sneaker";
      if (text.includes("shirt")) keyword = "shirt";
      if (text.includes("backpack") || text.includes("bag")) keyword = "backpack";
    } else if (text.includes("home") || text.includes("coffee") || text.includes("lamp") || text.includes("purifier") || text.includes("desk")) {
      targetCategory = "Home";
      if (text.includes("coffee")) keyword = "coffee";
      if (text.includes("purifier")) keyword = "purifier";
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
        text: `Here are ${results.length} curated recommendation${results.length > 1 ? 's' : ''} matching your preference:`,
        products: results
      };
    } else {
      return {
        text: `I couldn't locate an exact match. Try asking for categories like Skincare, Electronics, Fashion, or Home Living, or explore products within a budget (e.g. 'under ₹2000').`,
        products: []
      };
    }
  };

  const handleSend = (textToSend = input) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: text,
      products: []
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = parseAndRecommend(text);
      const aiMsg = {
        id: 'ai_' + (Date.now() + 1),
        sender: 'ai',
        text: response.text,
        products: response.products
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const QUICK_PROMPTS = [
    "Headphones under ₹3000",
    "Best sunscreen for oily skin",
    "Tactile mechanical keyboard",
    "Coffee maker for home"
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-mocha-900 via-mocha-800 to-blush-700 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-2xl shadow-mocha-900/30 hover:scale-105 active:scale-95 transition-all duration-300 group border border-mocha-700/60"
            aria-label="Open AI Shopping Stylist"
          >
            <Sparkles className="w-4 h-4 text-blush-300 animate-pulse" />
            <span>AI Stylist</span>
          </button>
        )}
      </div>

      {/* Floating Chat Drawer in Warm Pastel Palette */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-mocha-300/80 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-[#2C1D13] p-4 text-[#FAF7F2] flex items-center justify-between border-b border-mocha-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-mocha-800 text-blush-200 flex items-center justify-center border border-mocha-700 shadow-inner">
                <Sparkles className="w-4 h-4 text-blush-300" />
              </div>
              <div>
                <h3 className="font-serif text-base tracking-wide font-normal">ShopAI Stylist</h3>
                <p className="text-[10px] text-mocha-300 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  Active Atelier Consultant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/assistant"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-mono uppercase bg-white/10 hover:bg-white/20 text-[#FAF7F2] px-2.5 py-1 rounded-full transition-colors"
                title="Open Fullscreen Stylist"
              >
                Expand ↗
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/15 text-[#FAF7F2] transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-[#F4ECE1] border-b border-mocha-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-[11px] font-medium bg-white border border-mocha-200 text-mocha-800 hover:text-blush-700 hover:border-blush-300 px-3 py-1 rounded-full transition-colors shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF7F2]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-mocha-900 text-blush-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-serif">
                    ✦
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-mocha-900 text-[#FAF7F2] rounded-br-none shadow-xs'
                        : 'bg-white text-mocha-900 rounded-bl-none border border-mocha-200/80 shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Render Product Suggestion Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {msg.products.slice(0, 3).map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-white rounded-2xl p-2.5 border border-mocha-200 shadow-2xs flex items-center gap-3 hover:border-blush-300 transition-colors"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                            }}
                            className="w-12 h-12 rounded-xl object-cover bg-mocha-50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-serif font-bold text-mocha-950 truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono font-bold text-mocha-900">
                                {formatPrice(prod.price)}
                              </span>
                              <span className="text-[10px] text-blush-700 font-semibold font-mono">
                                ★ {prod.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="p-1.5 rounded-xl bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] transition-colors"
                              title="Add to bag"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              to={`/product/${prod.id}`}
                              onClick={() => setIsOpen(false)}
                              className="p-1.5 rounded-xl bg-mocha-100 hover:bg-mocha-200 text-mocha-800 transition-colors"
                              title="View details"
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
                  <div className="w-7 h-7 rounded-xl bg-blush-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-serif">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-mocha-400">
                <div className="w-6 h-6 rounded-lg bg-mocha-200 text-mocha-800 flex items-center justify-center text-xs">
                  ✦
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-mocha-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-mocha-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blush-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-mocha-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-mocha-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. sunscreen under 500)..."
              className="flex-1 bg-[#F4ECE1] text-xs sm:text-sm text-mocha-900 placeholder-mocha-400 px-4 py-2.5 rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-blush-400 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-full bg-mocha-900 hover:bg-blush-600 disabled:opacity-40 text-[#FAF7F2] transition-colors shadow-xs"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
