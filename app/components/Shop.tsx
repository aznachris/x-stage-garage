"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, CheckCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface Product {
  id: string;
  name: string;
  price: number;
  tag: string;
  desc: string;
}

const products: Product[] = [
  { id: "hoodie", name: "Stage X Hoodie", price: 65, tag: "BESTSELLER", desc: "Premium heavyweight fleece, embroidered logo" },
  { id: "cap", name: "Stage X Cap", price: 35, tag: "NEW", desc: "Structured 6-panel, adjustable strap" },
  { id: "sticker", name: "Sticker Pack × 8", price: 12, tag: "POPULAR", desc: "Die-cut vinyl, weatherproof, UV resistant" },
  { id: "tee", name: "Stage X Tee", price: 45, tag: "CLASSIC", desc: "100% cotton, oversized fit, screen printed" },
  { id: "keyring", name: "Metal Keyring", price: 18, tag: "DETAIL", desc: "CNC machined aluminium, laser engraved" },
  { id: "decal", name: "Window Decal", price: 8, tag: "ESSENTIALS", desc: "High-quality vinyl, easy apply / remove" },
];

interface CartItem extends Product { qty: number }
interface OrderForm { name: string; email: string; phone: string; address: string }

export default function Shop() {
  const { t } = useTranslation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({ name: "", email: "", phone: "", address: "" });
  const [orderErrors, setOrderErrors] = useState<Partial<OrderForm>>({});
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const addToCart = (product: Product) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id);
      if (existing) return c.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeItem = (id: string) => setCart((c) => c.filter((i) => i.id !== id));
  const changeQty = (id: string, delta: number) =>
    setCart((c) => c.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const validateOrder = () => {
    const e: Partial<OrderForm> = {};
    if (!orderForm.name.trim()) e.name = t("error.name");
    if (!orderForm.email.trim()) e.email = t("error.email");
    else if (!/\S+@\S+\.\S+/.test(orderForm.email)) e.email = t("error.email.invalid");
    if (!orderForm.phone.trim()) e.phone = t("error.phone");
    if (!orderForm.address.trim()) e.address = t("required");
    return e;
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateOrder();
    if (Object.keys(errs).length) { setOrderErrors(errs); return; }
    setOrdering(true);
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
        total: cartTotal,
        ...orderForm,
      }),
    });
    setOrdering(false);
    setOrdered(true);
    setCart([]);
  };

  const closeCart = () => {
    setCartOpen(false);
    setTimeout(() => { setIsCheckout(false); setOrdered(false); }, 300);
  };

  return (
    <>
      <section id="shop" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AAFF]/30 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div>
              <p className="font-['JetBrains_Mono'] text-xs tracking-[0.4em] text-[#00AAFF] uppercase mb-3">{t("shop.label")}</p>
              <h2 className="font-['Orbitron'] font-900 text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
                {t("shop.title1")}{" "}
                <span style={{ color: "#00AAFF", textShadow: "0 0 20px #00AAFF80" }}>{t("shop.title2")}</span>
              </h2>
            </div>
            {cartCount > 0 && (
              <button
                onClick={() => setCartOpen(true)}
                className="btn-neon-filled h-11 px-6 text-sm rounded-sm flex items-center gap-3 self-start sm:self-auto"
              >
                <ShoppingCart size={16} />
                {t("shop.cart")} ({cartCount})
              </button>
            )}
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card glow-card rounded-sm p-6 flex flex-col gap-4 transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-[#00AAFF]/06 via-[#0d0f12] to-[#0d0f12] border border-[#00AAFF]/10 rounded-sm flex items-end justify-start p-3">
                  <span className="font-['Orbitron'] text-[9px] font-700 tracking-[0.3em] text-[#00AAFF]/18 uppercase">Stage X Garage</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-['Orbitron'] font-700 text-sm text-white">{p.name}</h3>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#00AAFF] border border-[#00AAFF]/30 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                    {p.tag}
                  </span>
                </div>
                <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/45 leading-relaxed">{p.desc}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#00AAFF]/08">
                  <span className="font-['Orbitron'] font-700 text-lg text-white">€{p.price}</span>
                  <button onClick={() => addToCart(p)} className="btn-neon h-9 px-4 text-xs rounded-sm flex items-center gap-2">
                    <ShoppingCart size={13} />
                    {t("shop.add")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={closeCart}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 35 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0d0f12] border-l border-[#00AAFF]/15 z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#00AAFF]/10">
                <div className="flex items-center gap-3">
                  <span className="font-['Orbitron'] font-700 text-sm text-white uppercase tracking-widest">
                    {ordered ? t("shop.order.success") : isCheckout ? t("shop.checkout") : t("shop.cart")}
                  </span>
                  {!isCheckout && !ordered && cartCount > 0 && (
                    <span className="font-['JetBrains_Mono'] text-xs text-[#00AAFF] border border-[#00AAFF]/30 px-2 py-0.5 rounded-full">{cartCount}</span>
                  )}
                </div>
                <button onClick={closeCart} className="text-[#d4d8e8]/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {ordered ? (
                  <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                    <CheckCheck size={52} className="text-[#00AAFF]" style={{ filter: "drop-shadow(0 0 12px #00AAFF)" }} />
                    <div>
                      <p className="font-['Orbitron'] font-700 text-lg text-white mb-2">{t("shop.order.success")}</p>
                      <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/50">{t("shop.order.success.sub")}</p>
                    </div>
                  </div>
                ) : isCheckout ? (
                  <form onSubmit={submitOrder} noValidate className="flex flex-col gap-4">
                    <p className="font-['JetBrains_Mono'] text-xs text-[#00AAFF]/60 uppercase tracking-widest mb-2">{t("shop.order.title")}</p>
                    {(
                      [
                        { field: "name" as const, label: t("shop.order.name"), type: "text", placeholder: "John Doe" },
                        { field: "email" as const, label: t("shop.order.email"), type: "email", placeholder: "john@example.com" },
                        { field: "phone" as const, label: t("shop.order.phone"), type: "tel", placeholder: "+30 210 000 0000" },
                        { field: "address" as const, label: t("shop.order.address"), type: "text", placeholder: "Οδός Αρ., ΤΚ, Πόλη" },
                      ]
                    ).map(({ field, label, type, placeholder }) => (
                      <div key={field} className="flex flex-col gap-1.5">
                        <label className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">
                          {label} <span className="text-[#00AAFF]">*</span>
                        </label>
                        <input
                          type={type}
                          className="input-neon h-11 px-4 text-sm rounded-sm"
                          placeholder={placeholder}
                          value={orderForm[field]}
                          onChange={(e) => { setOrderForm((f) => ({ ...f, [field]: e.target.value })); setOrderErrors((er) => ({ ...er, [field]: undefined })); }}
                        />
                        {orderErrors[field] && <p className="font-['JetBrains_Mono'] text-[10px] text-red-400">{orderErrors[field]}</p>}
                      </div>
                    ))}
                    <div className="border-t border-[#00AAFF]/10 pt-4 mt-2">
                      <div className="flex justify-between mb-4">
                        <span className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/60">{t("shop.total")}</span>
                        <span className="font-['Orbitron'] font-700 text-lg text-white">€{cartTotal}</span>
                      </div>
                      <button
                        type="submit"
                        disabled={ordering}
                        className="btn-neon-filled w-full h-12 text-sm rounded-sm flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {ordering && (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                        {t("shop.order.submit")}
                      </button>
                    </div>
                  </form>
                ) : cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center opacity-40">
                    <ShoppingCart size={40} className="text-[#00AAFF]" />
                    <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/60">{t("shop.empty")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 border border-[#00AAFF]/10 rounded-sm p-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-['Orbitron'] text-xs font-700 text-white truncate">{item.name}</p>
                          <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/40 mt-0.5">€{item.price} × {item.qty}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 border border-[#00AAFF]/20 text-[#d4d8e8]/60 hover:text-[#00AAFF] hover:border-[#00AAFF]/50 rounded-sm flex items-center justify-center transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="font-['JetBrains_Mono'] text-sm text-white w-5 text-center">{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 border border-[#00AAFF]/20 text-[#d4d8e8]/60 hover:text-[#00AAFF] hover:border-[#00AAFF]/50 rounded-sm flex items-center justify-center transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-[#d4d8e8]/30 hover:text-red-400 transition-colors ml-1">
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!ordered && !isCheckout && cart.length > 0 && (
                <div className="px-6 py-5 border-t border-[#00AAFF]/10">
                  <div className="flex justify-between mb-4">
                    <span className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/60">{t("shop.total")}</span>
                    <span className="font-['Orbitron'] font-700 text-xl text-white">€{cartTotal}</span>
                  </div>
                  <button onClick={() => setIsCheckout(true)} className="btn-neon-filled w-full h-12 text-sm rounded-sm">
                    {t("shop.checkout")}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
