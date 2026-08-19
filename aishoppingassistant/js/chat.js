

function generateAIResponse(userMessage) {
    const text = userMessage.toLowerCase().trim();
    let allProducts = getProducts();

    let maxPrice = null;
    let minRating = null;
    let targetCategory = null;
    let keywordMatch = null;

    const priceRegex = /(?:under|below|less than|<|₹|rs\.?)\s*(\d+)/i;
    const priceMatch = text.match(priceRegex);
    if (priceMatch && priceMatch[1]) {
        maxPrice = parseInt(priceMatch[1], 10);
    }

    if (text.includes("highly rated") || text.includes("top rated") || text.includes("best rating") || text.includes("high rating")) {
        minRating = 4.5;
    }

    if (text.includes("sunscreen") || text.includes("sunshield") || text.includes("spf") || text.includes("skincare") || text.includes("face wash")) {
        targetCategory = "Skincare";
        if (text.includes("sunscreen") || text.includes("spf")) keywordMatch = "sunscreen";
    } else if (text.includes("headphone") || text.includes("keyboard") || text.includes("monitor") || text.includes("electronic") || text.includes("gadget")) {
        targetCategory = "Electronics";
        if (text.includes("headphone")) keywordMatch = "headphones";
        if (text.includes("keyboard")) keywordMatch = "keyboard";
        if (text.includes("monitor")) keywordMatch = "monitor";
    } else if (text.includes("sneaker") || text.includes("shoe") || text.includes("fashion") || text.includes("shirt") || text.includes("backpack")) {
        targetCategory = "Fashion";
    } else if (text.includes("home") || text.includes("coffee") || text.includes("lamp") || text.includes("purifier") || text.includes("kitchen")) {
        targetCategory = "Home";
    }

    let filtered = allProducts.filter(p => {
        let match = true;

        if (targetCategory && p.category.toLowerCase() !== targetCategory.toLowerCase()) {
            match = false;
        }

        if (keywordMatch && !p.name.toLowerCase().includes(keywordMatch) && !p.description.toLowerCase().includes(keywordMatch)) {
            match = false;
        }

        if (maxPrice !== null && p.price > maxPrice) {
            match = false;
        }

        if (minRating !== null && p.rating < minRating) {
            match = false;
        }

        return match;
    });

    if (filtered.length === 0 && !targetCategory && maxPrice === null && minRating === null) {
        const foundByName = allProducts.filter(p => text.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(text));
        if (foundByName.length > 0) {
            filtered = foundByName;
        }
    }

    filtered.sort((a, b) => b.rating - a.rating);

    if (filtered.length > 0) {
        let summaryParts = [];
        if (targetCategory) summaryParts.push(`category "${targetCategory}"`);
        if (maxPrice !== null) summaryParts.push(`budget under ${formatCurrency(maxPrice)}`);
        if (minRating !== null) summaryParts.push(`rating above 4.5★`);

        const criteriaText = summaryParts.length > 0 ? ` for ${summaryParts.join(", ")}` : "";
        return {
            text: `I found ${filtered.length} product${filtered.length === 1 ? '' : 's'} matching your preferences${criteriaText}:`,
            products: filtered
        };
    } else {
        return {
            text: `I couldn't find any products matching your specific query. Try searching by category (Skincare, Electronics, Fashion, Home), budget (e.g. "under ₹500"), or rating (e.g. "highly rated").`,
            products: []
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const promptBtns = document.querySelectorAll('.prompt-btn');

    if (!chatMessages) return;

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendMessage(sender, text, products = []) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;

        let productsHTML = '';
        if (products && products.length > 0) {
            productsHTML = `
                <div class="chat-recommendations">
                    ${products.map(p => `
                        <div class="mini-card" style="background: white; padding: 0.85rem; border-radius: 14px; border: 1px solid var(--glass-border-subtle); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
                            <div style="display: flex; align-items: center; gap: 0.75rem; width: 100%;">
                                <img src="${p.image}" style="width: 54px; height: 54px; border-radius: 10px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'">
                                <div style="flex: 1;">
                                    <a href="product.html?id=${p.id}" style="font-weight: 800; font-size: 0.95rem; color: var(--dark); display: block;">
                                        ${p.name}
                                    </a>
                                    <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">${p.category}</div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; font-size: 0.9rem; font-weight: 800;">
                                <span style="color: var(--primary);">${formatCurrency(p.price)}</span>
                                <span style="color: #f59e0b;">★ ${p.rating}</span>
                            </div>
                            <div style="display: flex; gap: 0.4rem; width: 100%; margin-top: 0.25rem;">
                                <a href="product.html?id=${p.id}" class="btn btn-secondary btn-sm" style="flex: 1; text-align: center; font-size: 0.78rem; padding: 0.4rem;">
                                    Details
                                </a>
                                <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})" style="flex: 1; font-size: 0.78rem; padding: 0.4rem;">
                                    + Add
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        msgDiv.innerHTML = `
            <div class="msg-content">
                ${text}
                ${productsHTML}
            </div>
        `;

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function handleSend(userText) {
        const query = userText || chatInput.value.trim();
        if (!query) return;

        appendMessage('user', query);
        if (chatInput) chatInput.value = '';

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg assistant';
        typingDiv.innerHTML = `<div class="msg-content" style="color: var(--text-muted);"><em>ShopAI is analyzing products... 🤖</em></div>`;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();

        setTimeout(() => {
            typingDiv.remove();
            const response = generateAIResponse(query);
            appendMessage('assistant', response.text, response.products);
        }, 400);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => handleSend());
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    promptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const promptText = btn.getAttribute('data-prompt') || btn.textContent.trim().replace(/^"|"$/g, '');
            handleSend(promptText);
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('query');
    if (initialQuery) {
        setTimeout(() => handleSend(initialQuery), 300);
    }
});
