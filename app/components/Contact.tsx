"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCheck } from "lucide-react";

type FormState = { name: string; email: string; phone: string; service: string; message: string };

const services = [
  "Custom Build",
  "Engine Tuning",
  "Suspension & Handling",
  "Maintenance",
  "Performance Upgrades",
  "Detailing & Wrap",
  "Other",
];

const contactInfo = [
  { icon: MapPin, label: "Address", value: "Stage X Garage, Industrial Zone 4, Unit 12" },
  { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
  { icon: Mail, label: "Email", value: "info@stagexgarage.com" },
];

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8">
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
            Get In Touch
          </p>
          <h2 className="font-['Orbitron'] font-900 text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
            Contact <span style={{ color: "#00AAFF", textShadow: "0 0 20px #00AAFF80" }}>Us</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/55 leading-relaxed">
              Ready to build something special? Drop us a message, call in, or swing by the shop.
              We work on a limited number of projects at a time — quality over quantity.
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-5">
              {contactInfo.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#00AAFF]/10 border border-[#00AAFF]/20 rounded-sm flex-shrink-0">
                      <Icon size={16} className="text-[#00AAFF]" />
                    </div>
                    <div>
                      <p className="font-['JetBrains_Mono'] text-[10px] text-[#00AAFF]/60 uppercase tracking-widest">
                        {c.label}
                      </p>
                      <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/80 mt-0.5">{c.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hours */}
            <div className="glass-card rounded-sm p-5">
              <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase mb-4">
                Opening Hours
              </p>
              {[
                { day: "Mon – Fri", time: "08:00 – 18:00" },
                { day: "Saturday", time: "09:00 – 15:00" },
                { day: "Sunday", time: "Closed" },
              ].map((h) => (
                <div key={h.day} className="flex justify-between py-2 border-b border-[#00AAFF]/08 last:border-0">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/50">{h.day}</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/80">{h.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <div className="glass-card rounded-sm p-10 flex flex-col items-center justify-center gap-6 h-full min-h-[400px] text-center">
                <CheckCheck size={48} className="text-[#00AAFF]" style={{ filter: "drop-shadow(0 0 12px #00AAFF)" }} />
                <h3 className="font-['Orbitron'] font-700 text-lg text-white">Message Received</h3>
                <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/55">
                  We&apos;ll be in touch within 24 hours. Stay tuned.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="glass-card rounded-sm p-6 sm:p-8 flex flex-col gap-5"
                aria-label="Contact form"
              >
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">
                      Name <span className="text-[#00AAFF]" aria-hidden>*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="input-neon h-11 px-4 text-sm rounded-sm"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="font-['JetBrains_Mono'] text-[10px] text-red-400" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">
                      Email <span className="text-[#00AAFF]" aria-hidden>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="input-neon h-11 px-4 text-sm rounded-sm"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="font-['JetBrains_Mono'] text-[10px] text-red-400" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className="input-neon h-11 px-4 text-sm rounded-sm"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                {/* Service */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="service" className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">
                    Service Needed
                  </label>
                  <select
                    id="service"
                    className="input-neon h-11 px-4 text-sm rounded-sm appearance-none"
                    value={form.service}
                    onChange={(e) => handleChange("service", e.target.value)}
                  >
                    <option value="" style={{ background: "#0d0f12" }}>Select a service</option>
                    {services.map((s) => (
                      <option key={s} value={s} style={{ background: "#0d0f12" }}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">
                    Message <span className="text-[#00AAFF]" aria-hidden>*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="input-neon px-4 py-3 text-sm rounded-sm resize-none"
                    placeholder="Tell us about your car and what you're looking for..."
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="font-['JetBrains_Mono'] text-[10px] text-red-400" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-neon-filled h-12 px-8 text-sm rounded-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  aria-label={loading ? "Sending message" : "Send message"}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
