"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { el as elLocale, enUS } from "date-fns/locale";
import { CheckCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

type FormData = { name: string; email: string; phone: string; vehicle: string; notes: string };
type Avail = { workingDays: number[]; startHour: number; endHour: number; slotDuration: number; blockedDates: string[] };

const SERVICES = [
  "Custom Build",
  "Engine Tuning",
  "Suspension & Handling",
  "Maintenance",
  "Performance Upgrades",
  "Detailing & Wrap",
];

function genSlots(a: Avail): string[] {
  const slots: string[] = [];
  const total = (a.endHour - a.startHour) * 60;
  for (let m = 0; m < total; m += a.slotDuration) {
    const h = a.startHour + Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return slots;
}

export default function Booking() {
  const { t, locale } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", vehicle: "", notes: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [avail, setAvail] = useState<Avail | null>(null);
  const [booked, setBooked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch("/api/availability").then((r) => r.json()).then(setAvail);
  }, []);

  useEffect(() => {
    if (!date) return;
    setSlotsLoading(true);
    fetch(`/api/appointments?date=${format(date, "yyyy-MM-dd")}`)
      .then((r) => r.json())
      .then((times: string[]) => { setBooked(times); setSlotsLoading(false); });
  }, [date]);

  const isDisabled = useCallback(
    (d: Date) => {
      if (!avail) return true;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (d < today) return true;
      if (!avail.workingDays.includes(d.getDay())) return true;
      if (avail.blockedDates.includes(format(d, "yyyy-MM-dd"))) return true;
      return false;
    },
    [avail]
  );

  const allSlots = avail && date ? genSlots(avail) : [];

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = t("error.name");
    if (!form.email.trim()) e.email = t("error.email");
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t("error.email.invalid");
    if (!form.phone.trim()) e.phone = t("error.phone");
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: format(date!, "yyyy-MM-dd"), time, service, ...form }),
    });
    setLoading(false);
    setSubmitted(true);
  };

  const steps = [t("booking.step1"), t("booking.step2"), t("booking.step3"), t("booking.step4")];

  if (submitted) {
    return (
      <section id="booking" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AAFF]/30 to-transparent" />
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-sm p-14 flex flex-col items-center gap-6 text-center"
          >
            <CheckCheck size={56} className="text-[#00AAFF]" style={{ filter: "drop-shadow(0 0 16px #00AAFF)" }} />
            <h3 className="font-['Orbitron'] font-700 text-2xl text-white">{t("booking.success")}</h3>
            <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/55">{t("booking.success.sub")}</p>
            <div className="border border-[#00AAFF]/20 rounded-sm p-5 w-full text-left bg-[#00AAFF]/05">
              <p className="font-['JetBrains_Mono'] text-[10px] text-[#00AAFF]/60 uppercase tracking-widest mb-3">{t("booking.summary")}</p>
              {[
                [t("booking.summary.service"), service],
                [t("booking.summary.date"), date ? format(date, "dd/MM/yyyy") : ""],
                [t("booking.summary.time"), time],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-[#00AAFF]/08 last:border-0">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/50">{label}</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-white">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AAFF]/30 to-transparent" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="font-['JetBrains_Mono'] text-xs tracking-[0.4em] text-[#00AAFF] uppercase mb-3">{t("booking.label")}</p>
          <h2 className="font-['Orbitron'] font-900 text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
            {t("booking.title1")}{" "}
            <span style={{ color: "#00AAFF", textShadow: "0 0 20px #00AAFF80" }}>{t("booking.title2")}</span>
          </h2>
          <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/45 mt-4">{t("booking.subtitle")}</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={s} className="flex items-center">
                <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${active || done ? "opacity-100" : "opacity-35"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold font-['Orbitron'] transition-all duration-300 ${
                      done
                        ? "bg-[#00AAFF] border-[#00AAFF] text-black"
                        : active
                        ? "border-[#00AAFF] text-[#00AAFF] shadow-[0_0_12px_#00AAFF50]"
                        : "border-[#00AAFF]/20 text-[#d4d8e8]/30"
                    }`}
                  >
                    {done ? "✓" : n}
                  </div>
                  <span
                    className={`hidden sm:block font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest transition-colors duration-300 ${
                      active ? "text-[#00AAFF]" : "text-[#d4d8e8]/30"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-10 sm:w-16 h-px mx-2 mb-4 transition-all duration-500 ${step > n ? "bg-[#00AAFF]" : "bg-[#00AAFF]/12"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step card */}
        <div className="glass-card rounded-sm p-6 sm:p-10 min-h-[380px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* Step 1 — Service */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex-1">
                <p className="font-['JetBrains_Mono'] text-xs text-[#00AAFF]/60 uppercase tracking-widest mb-5">{t("booking.select.service")}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SERVICES.map((svc) => (
                    <button
                      key={svc}
                      onClick={() => { setService(svc); setStep(2); }}
                      className={`p-4 text-left border rounded-sm transition-all duration-200 font-['JetBrains_Mono'] text-sm leading-snug ${
                        service === svc
                          ? "border-[#00AAFF] bg-[#00AAFF]/10 text-white shadow-[0_0_12px_#00AAFF25]"
                          : "border-[#00AAFF]/12 bg-transparent text-[#d4d8e8]/55 hover:border-[#00AAFF]/40 hover:text-white hover:bg-[#00AAFF]/06"
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2 — Date */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col">
                <p className="font-['JetBrains_Mono'] text-xs text-[#00AAFF]/60 uppercase tracking-widest mb-5">{t("booking.select.date")}</p>
                <div className="flex justify-center booking-cal flex-1">
                  {mounted ? (
                    <DayPicker
                      mode="single"
                      selected={date}
                      onSelect={(d) => { setDate(d); if (d) { setTime(""); setStep(3); } }}
                      disabled={isDisabled}
                      locale={locale === "el" ? elLocale : enUS}
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <span className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/30">{t("loading")}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="btn-neon h-10 px-6 text-xs rounded-sm">{t("booking.back")}</button>
                  {date && (
                    <button onClick={() => setStep(3)} className="btn-neon-filled h-10 px-6 text-xs rounded-sm">{t("booking.next")}</button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3 — Time */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col">
                <p className="font-['JetBrains_Mono'] text-xs text-[#00AAFF]/60 uppercase tracking-widest mb-1">{t("booking.select.time")}</p>
                {date && (
                  <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/35 mb-5">
                    {format(date, "EEEE dd/MM/yyyy", { locale: locale === "el" ? elLocale : enUS })}
                  </p>
                )}
                {slotsLoading ? (
                  <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">{t("loading")}</p>
                ) : allSlots.length === 0 ? (
                  <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">{t("booking.no.slots")}</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 flex-1">
                    {allSlots.map((slot) => {
                      const taken = booked.includes(slot);
                      return (
                        <button
                          key={slot}
                          disabled={taken}
                          onClick={() => { setTime(slot); setStep(4); }}
                          className={`h-11 rounded-sm font-['JetBrains_Mono'] text-sm transition-all duration-200 ${
                            taken
                              ? "border border-white/05 text-white/15 cursor-not-allowed line-through"
                              : time === slot
                              ? "border border-[#00AAFF] bg-[#00AAFF]/15 text-[#00AAFF] shadow-[0_0_10px_#00AAFF30]"
                              : "border border-[#00AAFF]/18 text-[#d4d8e8]/65 hover:border-[#00AAFF]/50 hover:text-white hover:bg-[#00AAFF]/08"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(2)} className="btn-neon h-10 px-6 text-xs rounded-sm">{t("booking.back")}</button>
                  {time && (
                    <button onClick={() => setStep(4)} className="btn-neon-filled h-10 px-6 text-xs rounded-sm">{t("booking.next")}</button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4 — Details */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col">
                {/* Summary pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {[service, date ? format(date, "dd/MM/yyyy") : "", time].filter(Boolean).map((val) => (
                    <span key={val} className="font-['JetBrains_Mono'] text-[10px] border border-[#00AAFF]/25 text-[#00AAFF]/70 px-3 py-1 rounded-full">
                      {val}
                    </span>
                  ))}
                </div>
                <form onSubmit={handleSubmit} noValidate className="grid sm:grid-cols-2 gap-4 flex-1">
                  {(
                    [
                      { field: "name" as const, type: "text", placeholder: "John Doe", required: true },
                      { field: "email" as const, type: "email", placeholder: "john@example.com", required: true },
                      { field: "phone" as const, type: "tel", placeholder: "+30 210 000 0000", required: true },
                      { field: "vehicle" as const, type: "text", placeholder: t("booking.vehicle.placeholder"), required: false },
                    ]
                  ).map(({ field, type, placeholder, required }) => (
                    <div key={field} className="flex flex-col gap-1.5">
                      <label className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">
                        {t(`booking.${field}` as Parameters<typeof t>[0])}{" "}
                        {required && <span className="text-[#00AAFF]">*</span>}
                      </label>
                      <input
                        type={type}
                        className="input-neon h-11 px-4 text-sm rounded-sm"
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={(e) => { setForm((f) => ({ ...f, [field]: e.target.value })); setErrors((er) => ({ ...er, [field]: undefined })); }}
                      />
                      {errors[field] && <p className="font-['JetBrains_Mono'] text-[10px] text-red-400">{errors[field]}</p>}
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">{t("booking.notes")}</label>
                    <textarea
                      rows={3}
                      className="input-neon px-4 py-3 text-sm rounded-sm resize-none"
                      placeholder={t("booking.notes.placeholder")}
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-between mt-2">
                    <button type="button" onClick={() => setStep(3)} className="btn-neon h-12 px-8 text-sm rounded-sm">{t("booking.back")}</button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-neon-filled h-12 px-8 text-sm rounded-sm flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      {t("booking.submit")}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
