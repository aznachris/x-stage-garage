"use client";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Stage X Hoodie",
    price: "€59",
    category: "Apparel",
    color: "#0d0f12",
    textColor: "#00AAFF",
    description: "Heavy blend. Embroidered logo. Limited drop.",
    badge: "Limited",
  },
  {
    id: 2,
    name: "Stage X Cap",
    price: "€34",
    category: "Apparel",
    color: "#0d0f12",
    textColor: "#ffffff",
    description: "Structured 6-panel. Neon blue X embroidery.",
    badge: null,
  },
  {
    id: 3,
    name: "Sticker Pack",
    price: "€12",
    category: "Accessories",
    color: "#0d0f12",
    textColor: "#00AAFF",
    description: "10 high-quality vinyl stickers. Weatherproof.",
    badge: "Bestseller",
  },
  {
    id: 4,
    name: "Stage X T-Shirt",
    price: "€29",
    category: "Apparel",
    color: "#0d0f12",
    textColor: "#ffffff",
    description: "Premium cotton. Large back print. Various sizes.",
    badge: null,
  },
  {
    id: 5,
    name: "Keyring",
    price: "€18",
    category: "Accessories",
    color: "#0d0f12",
    textColor: "#00AAFF",
    description: "CNC aluminium X keyring. Anodised blue finish.",
    badge: null,
  },
  {
    id: 6,
    name: "Window Decal",
    price: "€9",
    category: "Accessories",
    color: "#0d0f12",
    textColor: "#ffffff",
    description: "Rear windscreen decal. UV resistant. 30×15cm.",
    badge: null,
  },
];

export default function Shop() {
  return (
    <section id="shop" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AAFF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="font-['JetBrains_Mono'] text-xs tracking-[0.4em] text-[#00AAFF] uppercase mb-3">
            Gear Up
          </p>
          <h2 className="font-['Orbitron'] font-900 text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
            Stage X <span style={{ color: "#00AAFF", textShadow: "0 0 20px #00AAFF80" }}>Merch</span>
          </h2>
          <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40 mt-4 max-w-md mx-auto">
            Wear the brand. Rep the culture.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
              className="glass-card glow-card rounded-sm overflow-hidden group flex flex-col"
            >
              {/* Product visual */}
              <div
                className="relative flex items-center justify-center h-32"
                style={{ background: `linear-gradient(135deg, ${p.color}, #080a0d)` }}
              >
                {p.badge && (
                  <span
                    className="absolute top-2 right-2 font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                    style={{
                      background: p.badge === "Limited" ? "rgba(0,170,255,0.15)" : "rgba(0,255,136,0.15)",
                      border: `1px solid ${p.badge === "Limited" ? "#00AAFF40" : "#00FF8840"}`,
                      color: p.badge === "Limited" ? "#00AAFF" : "#00FF88",
                    }}
                  >
                    {p.badge}
                  </span>
                )}
                {/* Placeholder icon */}
                <div
                  className="font-['Orbitron'] font-900 text-4xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ color: p.textColor }}
                >
                  X
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-2 flex-1">
                <div>
                  <p className="font-['JetBrains_Mono'] text-[10px] text-[#00AAFF]/50 uppercase tracking-widest">
                    {p.category}
                  </p>
                  <h3 className="font-['Orbitron'] font-700 text-xs text-white mt-0.5 group-hover:text-[#00AAFF] transition-colors">
                    {p.name}
                  </h3>
                </div>
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/40 leading-relaxed flex-1">
                  {p.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#00AAFF]/10">
                  <span className="font-['Orbitron'] font-700 text-sm text-[#00AAFF]">{p.price}</span>
                  <button
                    className="text-[#d4d8e8]/40 hover:text-[#00AAFF] transition-colors cursor-pointer p-1"
                    aria-label={`Add ${p.name} to cart`}
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/25 mt-8"
        >
          Full shop coming soon — DM us on Instagram to order
        </motion.p>
      </div>
    </section>
  );
}
