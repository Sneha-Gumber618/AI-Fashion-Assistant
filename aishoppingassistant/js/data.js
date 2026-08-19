

const products = [
    {
        id: 1,
        name: "SunShield SPF 50",
        category: "Skincare",
        price: 449,
        rating: 4.6,
        reviews: 128,
        icon: "☀️",
        badge: "Bestseller",
        image: "images/sunshield.jpg",
        description: "Lightweight, non-greasy broad-spectrum sunscreen engineered for daily protection. Leaves zero white cast and keeps skin hydrated.",
        features: [
            "SPF 50+ PA++++ Broad Spectrum",
            "Non-comedogenic & Oil-free formula",
            "Enriched with Niacinamide & Cica",
            "Dermatologically tested for oily skin"
        ]
    },
    {
        id: 2,
        name: "DermaGuard SPF 50",
        category: "Skincare",
        price: 399,
        rating: 4.4,
        reviews: 95,
        icon: "🧴",
        badge: "Budget Choice",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
        description: "Soothing mineral sunscreen with aloe vera extracts. Ideal for sensitive and acne-prone skin requiring calm protection.",
        features: [
            "100% Zinc Oxide mineral filter",
            "Ultra-gentle formula for sensitive skin",
            "Matte finish with 8-hour protection",
            "Fragrance-free and paraben-free"
        ]
    },
    {
        id: 3,
        name: "GlowClean Face Wash",
        category: "Skincare",
        price: 299,
        rating: 4.7,
        reviews: 210,
        icon: "🧼",
        badge: "Top Rated",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
        description: "Deep cleansing facial foam infused with Salicylic Acid and Vitamin C to unclog pores and brighten dull skin tone.",
        features: [
            "2% Salicylic Acid for pore unclogging",
            "Natural botanical brightening complex",
            "Balances natural skin moisture",
            "Free from harsh sulfates & phthalates"
        ]
    },
    {
        id: 4,
        name: "AeroBeat Headphones",
        category: "Electronics",
        price: 2499,
        rating: 4.8,
        reviews: 340,
        icon: "🎧",
        badge: "Trending",
        image: "images/aerobeat.jpg",
        description: "Immersive over-ear headphones with Active Noise Cancellation, punchy bass, and an ultra-long 40-hour battery life.",
        features: [
            "Hybrid Active Noise Cancellation (ANC)",
            "40-hour continuous playback time",
            "Ergonomic memory-foam ear cushions",
            "Bluetooth 5.3 low-latency connection"
        ]
    },
    {
        id: 5,
        name: "CodePro Keyboard",
        category: "Electronics",
        price: 3899,
        rating: 4.9,
        reviews: 512,
        icon: "⌨️",
        badge: "Editor's Choice",
        image: "images/codepro.jpg",
        description: "Tactile RGB mechanical keyboard equipped with custom hot-swappable switches, PBT keycaps, and dual wireless mode.",
        features: [
            "Hot-swappable tactile switches",
            "Per-key customizable RGB backlighting",
            "Dual-mode: Bluetooth 5.0 & USB-C wired",
            "Durable PBT double-shot keycaps"
        ]
    },
    {
        id: 6,
        name: "PixelView 27 Monitor",
        category: "Electronics",
        price: 14999,
        rating: 4.7,
        reviews: 88,
        icon: "🖥️",
        badge: "High Performance",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
        description: "Crisp 27-inch Quad HD IPS display featuring 165Hz refresh rate, 99% sRGB color coverage, and ultra-thin bezels.",
        features: [
            "27-inch QHD (2560 x 1440) IPS panel",
            "165Hz Refresh Rate with 1ms response",
            "HDR10 support & Flicker-Free technology",
            "Dual HDMI 2.0 & DisplayPort 1.4"
        ]
    },
    {
        id: 7,
        name: "UrbanStep Sneakers",
        category: "Fashion",
        price: 1899,
        rating: 4.5,
        reviews: 176,
        icon: "👟",
        badge: "Popular",
        image: "images/urbanstep.jpg",
        description: "Stylish everyday sneakers designed with breathable mesh uppers and responsive cloud-cushioned soles for maximum comfort.",
        features: [
            "Breathable knit fabric construction",
            "Ultra-lightweight shock-absorbing sole",
            "Slip-resistant rubber tread",
            "Versatile streetwear aesthetic"
        ]
    },
    {
        id: 8,
        name: "Classic Overshirt",
        category: "Fashion",
        price: 1299,
        rating: 4.3,
        reviews: 64,
        icon: "👔",
        badge: "New Arrival",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
        description: "Versatile heavy-cotton overshirt featuring double chest pockets and a structured relaxed fit suitable for layering.",
        features: [
            "100% Premium Twill Cotton",
            "Dual chest utility pockets",
            "Pre-shrunk vintage wash finish",
            "Comfortable relaxed fit"
        ]
    },
    {
        id: 9,
        name: "Flex Backpack",
        category: "Fashion",
        price: 999,
        rating: 4.6,
        reviews: 142,
        icon: "🎒",
        badge: "Best Value",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        description: "Water-resistant commuter laptop backpack with padded 15.6\" compartment, hidden anti-theft pocket, and USB port.",
        features: [
            "Dedicated 15.6\" padded laptop sleeve",
            "Water-repellent 600D Polyester material",
            "Integrated USB charging pass-through",
            "Ergonomic breathable back padding"
        ]
    },
    {
        id: 10,
        name: "BrewMate Coffee Maker",
        category: "Home",
        price: 2799,
        rating: 4.8,
        reviews: 230,
        icon: "☕",
        badge: "Top Seller",
        image: "images/brewmate.jpg",
        description: "Programmable drip coffee maker with high-temp extraction, keep-warm hotplate, and reusable permanent mesh filter.",
        features: [
            "1.2L Capacity (10-cup carafe)",
            "Digital timer & automatic auto-pause",
            "Eco-friendly permanent mesh filter",
            "2-hour automatic keep-warm function"
        ]
    },
    {
        id: 11,
        name: "AirPure Mini Purifier",
        category: "Home",
        price: 1599,
        rating: 4.4,
        reviews: 89,
        icon: "🍃",
        badge: "Essential",
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
        description: "Compact HEPA desktop air purifier designed to trap dust, allergens, and odors in bedrooms or home offices.",
        features: [
            "True HEPA H13 filtration (99.97%)",
            "Whisper-quiet night sleep mode (24dB)",
            "Aromatherapy essential oil pad slot",
            "Low energy consumption (10W)"
        ]
    },
    {
        id: 12,
        name: "GlowDesk LED Lamp",
        category: "Home",
        price: 849,
        rating: 4.6,
        reviews: 115,
        icon: "💡",
        badge: "Smart Light",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
        description: "Eye-caring touch LED desk lamp with 5 color temperatures, step-less dimming brightness, and wireless phone charger base.",
        features: [
            "5 Color Modes & 10 Brightness Levels",
            "Integrated Qi 10W Wireless Charging pad",
            "45-minute auto turn-off sleep timer",
            "Flexible multi-angle folding arm"
        ]
    }
];

/**
 * Retrieve full product dataset
 * @returns {Array} List of products
 */
function getProducts() {
    return products;
}

/**
 * Get product by ID
 * @param {number|string} id 
 * @returns {Object|undefined}
 */
function getProductById(id) {
    return products.find(p => p.id === Number(id));
}
