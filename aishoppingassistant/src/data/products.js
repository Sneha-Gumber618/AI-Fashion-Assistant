/**
 * ShopAI Master Product Catalog
 * Includes high-res local assets and remote URLs, rich specifications, inventory and reviews.
 */

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "SunShield SPF 50",
    category: "Skincare",
    price: 449,
    originalPrice: 649,
    rating: 4.6,
    reviewsCount: 128,
    icon: "☀️",
    badge: "Bestseller",
    inStock: true,
    stockCount: 45,
    image: "/images/sunshield.jpg",
    gallery: [
      "/images/sunshield.jpg",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Lightweight, non-greasy broad-spectrum sunscreen engineered for daily protection. Leaves zero white cast and keeps skin hydrated with botanical goodness.",
    features: [
      "SPF 50+ PA++++ Broad Spectrum Protection",
      "Non-comedogenic & 100% Oil-free formula",
      "Enriched with Niacinamide & Centella Asiatica",
      "Dermatologically tested for oily & sensitive skin"
    ],
    specs: {
      "Volume": "50 ml",
      "Skin Type": "All skin types",
      "Sun Protection": "SPF 50 PA++++",
      "Country of Origin": "India"
    },
    reviews: [
      { id: 101, user: "Priya S.", rating: 5, date: "2 days ago", comment: "Zero white cast! Completely absorbed in seconds on my oily skin." },
      { id: 102, user: "Rahul M.", rating: 4, date: "1 week ago", comment: "Great protection during outdoor cycling. Highly recommend." }
    ]
  },
  {
    id: 2,
    name: "DermaGuard SPF 50",
    category: "Skincare",
    price: 399,
    originalPrice: 599,
    rating: 4.4,
    reviewsCount: 95,
    icon: "🧴",
    badge: "Budget Choice",
    inStock: true,
    stockCount: 28,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      "/images/sunshield.jpg"
    ],
    description: "Soothing mineral sunscreen formulated with soothing aloe vera extracts and zinc oxide. Ideal for reactive, calm-seeking sensitive skin.",
    features: [
      "100% Zinc Oxide gentle mineral UV filter",
      "Ultra-gentle formulation for sensitive & acne-prone skin",
      "Velvet matte finish with up to 8-hour longevity",
      "Hypoallergenic, fragrance-free & paraben-free"
    ],
    specs: {
      "Volume": "60 ml",
      "Skin Type": "Sensitive / Acne-prone",
      "Sun Protection": "SPF 50 PA+++",
      "Country of Origin": "India"
    },
    reviews: [
      { id: 201, user: "Ananya K.", rating: 5, date: "3 days ago", comment: "Doesn't sting my eyes at all. Very mild formula." }
    ]
  },
  {
    id: 3,
    name: "GlowClean Face Wash",
    category: "Skincare",
    price: 299,
    originalPrice: 449,
    rating: 4.7,
    reviewsCount: 210,
    icon: "🧼",
    badge: "Top Rated",
    inStock: true,
    stockCount: 62,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Deep cleansing facial foam infused with 2% Salicylic Acid and Vitamin C to unclog stubborn pores and naturally brighten dull skin tones.",
    features: [
      "2% Active Salicylic Acid for deep pore decongestion",
      "Natural botanical Kakadu Plum Vitamin C complex",
      "Maintains skin's natural moisture mantle pH 5.5",
      "Free from sulfates, parabens, and micro-plastics"
    ],
    specs: {
      "Volume": "100 ml",
      "Skin Type": "Combination to Oily",
      "Scent": "Subtle Citrus",
      "Country of Origin": "India"
    },
    reviews: [
      { id: 301, user: "Vikram R.", rating: 5, date: "Yesterday", comment: "Cleared up my blackheads in 2 weeks. Very fresh feeling." }
    ]
  },
  {
    id: 4,
    name: "AeroBeat Headphones",
    category: "Electronics",
    price: 2499,
    originalPrice: 4999,
    rating: 4.8,
    reviewsCount: 340,
    icon: "🎧",
    badge: "Trending",
    inStock: true,
    stockCount: 15,
    image: "/images/aerobeat.jpg",
    gallery: [
      "/images/aerobeat.jpg",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Immersive over-ear wireless headphones featuring Hybrid Active Noise Cancellation, high-fidelity 40mm drivers, and an astonishing 40-hour battery life.",
    features: [
      "Hybrid ANC reduces ambient noise by up to 35dB",
      "40-hour continuous playback with Type-C quick charge",
      "Protein leather memory-foam ear cups for all-day comfort",
      "Bluetooth 5.3 with ultra-low latency gaming mode"
    ],
    specs: {
      "Driver Size": "40mm Dynamic Neodymium",
      "Battery Life": "40 Hours (ANC Off) / 28 Hours (ANC On)",
      "Charging Time": "10 min charge gives 4 hours",
      "Weight": "240g"
    },
    reviews: [
      { id: 401, user: "Arjun D.", rating: 5, date: "4 days ago", comment: "Bass is punchy without overpowering the vocals. Best ANC in this budget." }
    ]
  },
  {
    id: 5,
    name: "CodePro Keyboard",
    category: "Electronics",
    price: 3899,
    originalPrice: 5999,
    rating: 4.9,
    reviewsCount: 512,
    icon: "⌨️",
    badge: "Editor's Choice",
    inStock: true,
    stockCount: 19,
    image: "/images/codepro.jpg",
    gallery: [
      "/images/codepro.jpg",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Tactile mechanical keyboard engineered for programmers and typists. Featuring hot-swappable tactile switches, double-shot PBT keycaps, and dual-mode wireless connectivity.",
    features: [
      "Hot-swappable tactile brown switches (5-pin compatible)",
      "Per-key customizable RGB illumination with 18 animations",
      "Triple Connectivity: Bluetooth 5.0, 2.4GHz wireless & USB-C",
      "Oil-resistant PBT double-shot keycaps for lifetime longevity"
    ],
    specs: {
      "Layout": "75% Compact (84 keys)",
      "Switch Type": "Gateron Brown Tactile",
      "Battery": "4000mAh rechargeable",
      "Compatibility": "Windows, macOS, Linux, iOS, Android"
    },
    reviews: [
      { id: 501, user: "Sneha G.", rating: 5, date: "5 days ago", comment: "Typing feel is incredible. The thock sound is so satisfying!" }
    ]
  },
  {
    id: 6,
    name: "PixelView 27 Monitor",
    category: "Electronics",
    price: 14999,
    originalPrice: 19999,
    rating: 4.7,
    reviewsCount: 88,
    icon: "🖥️",
    badge: "High Performance",
    inStock: true,
    stockCount: 8,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Crisp 27-inch Quad HD IPS monitor boasting a silky 165Hz refresh rate, 99% sRGB color accuracy, and ultra-slim bezel architecture.",
    features: [
      "27-inch QHD (2560 x 1440) IPS Panel with wide viewing angles",
      "165Hz refresh rate & 1ms MPRT response time",
      "HDR10 support with Flicker-Free and Low Blue Light filters",
      "Dual HDMI 2.0, DisplayPort 1.4 & integrated audio jack"
    ],
    specs: {
      "Resolution": "2560 x 1440 (2K QHD)",
      "Panel": "IPS (In-Plane Switching)",
      "Refresh Rate": "165 Hz",
      "Color Gamut": "99% sRGB"
    },
    reviews: [
      { id: 601, user: "Rohan V.", rating: 5, date: "1 week ago", comment: "Perfect for code editor and casual gaming. Zero dead pixels." }
    ]
  },
  {
    id: 7,
    name: "UrbanStep Sneakers",
    category: "Fashion",
    price: 1899,
    originalPrice: 2999,
    rating: 4.5,
    reviewsCount: 176,
    icon: "👟",
    badge: "Popular",
    inStock: true,
    stockCount: 34,
    image: "/images/urbanstep.jpg",
    gallery: [
      "/images/urbanstep.jpg",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Aesthetic lifestyle sneakers crafted with breathable knit mesh uppers and cloud-cushioned EVA outsoles for responsive comfort.",
    features: [
      "High-elasticity breathable knit mesh fabric",
      "Ultra-lightweight shock-absorbing EVA foam sole",
      "High-grip slip-resistant textured rubber treads",
      "Versatile modern streetwear aesthetic"
    ],
    specs: {
      "Closure": "Lace-Up",
      "Upper Material": "Flyknit Fabric",
      "Sole Material": "EVA & Rubber",
      "Sizes Available": "UK 6, 7, 8, 9, 10, 11"
    },
    reviews: [
      { id: 701, user: "Karan P.", rating: 4, date: "3 days ago", comment: "So lightweight! Feels like walking on pillows all day." }
    ]
  },
  {
    id: 8,
    name: "Classic Overshirt",
    category: "Fashion",
    price: 1299,
    originalPrice: 2199,
    rating: 4.3,
    reviewsCount: 64,
    icon: "👔",
    badge: "New Arrival",
    inStock: true,
    stockCount: 22,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Versatile heavy-cotton utility overshirt featuring dual flap chest pockets and a structured relaxed silhouette ideal for layered styling.",
    features: [
      "100% Premium Combed Twill Cotton (280 GSM)",
      "Dual functional chest utility pockets with button closure",
      "Pre-shrunk vintage enzyme wash finish",
      "Relaxed regular fit designed for easy layering"
    ],
    specs: {
      "Material": "100% Twill Cotton",
      "Fit": "Relaxed Overfit",
      "Pattern": "Solid Olive / Navy",
      "Care": "Machine wash cold"
    },
    reviews: [
      { id: 801, user: "Tanmay B.", rating: 5, date: "2 weeks ago", comment: "Heavyweight cotton feels super durable and premium." }
    ]
  },
  {
    id: 9,
    name: "Flex Backpack",
    category: "Fashion",
    price: 999,
    originalPrice: 1799,
    rating: 4.6,
    reviewsCount: 142,
    icon: "🎒",
    badge: "Best Value",
    inStock: true,
    stockCount: 40,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Water-resistant commuter backpack with a dedicated 15.6-inch padded laptop compartment, anti-theft hidden pocket, and integrated USB charging port.",
    features: [
      "Dedicated 15.6-inch high-density padded laptop sleeve",
      "Water-repellent 600D ballistic polyester fabric",
      "Integrated external USB port with internal powerbank pocket",
      "Ergonomic padded shoulder straps and breathable honeycomb back panel"
    ],
    specs: {
      "Capacity": "24 Litres",
      "Laptop Size": "Up to 15.6 inch",
      "Water Resistant": "Yes (Splash-proof)",
      "Weight": "580g"
    },
    reviews: [
      { id: 901, user: "Divya N.", rating: 5, date: "1 week ago", comment: "Survived heavy rain without a single drop getting inside. Huge capacity!" }
    ]
  },
  {
    id: 10,
    name: "BrewMate Coffee Maker",
    category: "Home",
    price: 2799,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 230,
    icon: "☕",
    badge: "Top Seller",
    inStock: true,
    stockCount: 17,
    image: "/images/brewmate.jpg",
    gallery: [
      "/images/brewmate.jpg",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Smart programmable drip coffee maker with high-temperature extraction, non-stick warming plate, and reusable stainless micro-mesh filter.",
    features: [
      "1.2L Capacity (serves up to 10 fresh cups)",
      "Digital 24-hour programmable timer with auto-pause drip stop",
      "Eco-friendly permanent washable stainless mesh filter",
      "2-hour automatic keep-warm hotplate with auto shutoff"
    ],
    specs: {
      "Power": "900 Watts",
      "Capacity": "10 Cups / 1.2 Litres",
      "Carafe Material": "Borosilicate Heat-resistant Glass",
      "Warranty": "1 Year Replacement Warranty"
    },
    reviews: [
      { id: 1001, user: "Suresh C.", rating: 5, date: "3 days ago", comment: "Waking up to freshly brewed hot coffee automatically is a blessing." }
    ]
  },
  {
    id: 11,
    name: "AirPure Mini Purifier",
    category: "Home",
    price: 1599,
    originalPrice: 2499,
    rating: 4.4,
    reviewsCount: 89,
    icon: "🍃",
    badge: "Essential",
    inStock: true,
    stockCount: 25,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Compact True HEPA desktop air purifier designed to trap 99.97% of airborne dust, smoke, pet dander, and allergens in bedrooms or study desks.",
    features: [
      "True HEPA H13 filtration removes particles down to 0.3 microns",
      "Whisper-quiet sleep mode operates at only 24dB",
      "Aromatherapy sponge slot for adding essential oils",
      "Energy efficient 10W DC motor with USB power compatibility"
    ],
    specs: {
      "Coverage Area": "Up to 150 sq. ft.",
      "Noise Level": "24 - 42 dB",
      "Filter Life": "6 months",
      "Power Source": "USB Type-C (5V/2A)"
    },
    reviews: [
      { id: 1101, user: "Meera T.", rating: 4, date: "4 days ago", comment: "Significant difference in room air quality and reduced morning sneezing." }
    ]
  },
  {
    id: 12,
    name: "GlowDesk LED Lamp",
    category: "Home",
    price: 849,
    originalPrice: 1499,
    rating: 4.6,
    reviewsCount: 115,
    icon: "💡",
    badge: "Smart Light",
    inStock: true,
    stockCount: 31,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Eye-caring touch LED desk lamp with 5 color temperatures, smooth dimming, flexible dual-axis folding arm, and an integrated 10W wireless charging base.",
    features: [
      "5 Color Temperatures (Warm to Cool White) & 10 Brightness Levels",
      "Integrated 10W Qi Wireless Fast Charging base for smartphones",
      "45-minute intelligent auto-shutoff timer for bedtime reading",
      "Flicker-free anti-glare light guide panel protecting eyesight"
    ],
    specs: {
      "Brightness": "500 Lumens",
      "LED Lifetime": "50,000 Hours",
      "Wireless Output": "10W Qi Standard",
      "Adjustability": "180° head fold + 90° base swivel"
    },
    reviews: [
      { id: 1201, user: "Deepak S.", rating: 5, date: "1 week ago", comment: "The wireless phone charger on the lamp base frees up my desk cables. Awesome gadget." }
    ]
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "✨" },
  { id: "Skincare", name: "Skincare & Beauty", icon: "🧴" },
  { id: "Electronics", name: "Electronics & Tech", icon: "🎧" },
  { id: "Fashion", name: "Fashion & Lifestyle", icon: "👟" },
  { id: "Home", name: "Home & Living", icon: "☕" }
];
