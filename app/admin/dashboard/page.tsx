"use client";
import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { el as elLocale } from "date-fns/locale";
import { LogOut, RefreshCw, Calendar, ShoppingBag, Settings, Check, X, Package } from "lucide-react";

type AppStatus = "pending" | "confirmed" | "cancelled";
type OrderStatus = "new" | "processing" | "completed" | "cancelled";

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  notes: string;
  status: AppStatus;
  createdAt: string;
}

interface OrderItem { name: string; price: number; qty: number }
interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: OrderStatus;
  createdAt: string;
}

interface Availability {
  workingDays: number[];
  startHour: number;
  endHour: number;
  slotDuration: number;
  blockedDates: string[];
}

type Tab = "appointments" | "orders" | "availability";

const DAY_NAMES = ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"];
const DAY_FULL = ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"];

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 border-yellow-400/30 bg-yellow-400/08",
  confirmed: "text-green-400 border-green-400/30 bg-green-400/08",
  cancelled: "text-red-400 border-red-400/30 bg-red-400/08",
  new: "text-[#00AAFF] border-[#00AAFF]/30 bg-[#00AAFF]/08",
  processing: "text-yellow-400 border-yellow-400/30 bg-yellow-400/08",
  completed: "text-green-400 border-green-400/30 bg-green-400/08",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Εκκρεμεί",
  confirmed: "Επιβεβαιωμένο",
  cancelled: "Ακυρωμένο",
  new: "Νέα",
  processing: "Σε εξέλιξη",
  completed: "Ολοκληρώθηκε",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`font-['JetBrains_Mono'] text-[10px] border px-2 py-0.5 rounded-full ${STATUS_COLORS[status] ?? ""}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [avail, setAvail] = useState<Availability>({
    workingDays: [1, 2, 3, 4, 5, 6],
    startHour: 8,
    endHour: 18,
    slotDuration: 60,
    blockedDates: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appFilter, setAppFilter] = useState<AppStatus | "all">("all");
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [appsRes, ordersRes, availRes] = await Promise.all([
      fetch("/api/appointments"),
      fetch("/api/orders"),
      fetch("/api/availability"),
    ]);
    const [apps, ords, av] = await Promise.all([appsRes.json(), ordersRes.json(), availRes.json()]);
    setAppointments(apps);
    setOrders(ords);
    setAvail(av);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateAppStatus = async (id: string, status: AppStatus) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setAppointments((a) => a.map((ap) => ap.id === id ? { ...ap, status } : ap));
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((o) => o.map((or) => or.id === id ? { ...or, status } : or));
  };

  const saveAvailability = async () => {
    setSaving(true);
    await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(avail),
    });
    setSaving(false);
  };

  const toggleBlockedDate = (dates: Date[] | undefined) => {
    setAvail((a) => ({ ...a, blockedDates: (dates ?? []).map((d) => format(d, "yyyy-MM-dd")) }));
  };

  const filteredApps = appFilter === "all" ? appointments : appointments.filter((a) => a.status === appFilter);
  const filteredOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const newOrdersCount = orders.filter((o) => o.status === "new").length;

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white">
      {/* Top bar */}
      <header className="border-b border-[#00AAFF]/10 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0d0f12]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
              <rect width="32" height="32" fill="#000" />
              <line x1="4" y1="4" x2="28" y2="28" stroke="#00AAFF" strokeWidth="4" strokeLinecap="round" />
              <line x1="28" y1="4" x2="4" y2="28" stroke="#00AAFF" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="font-['Orbitron'] font-700 text-sm tracking-widest text-white hidden sm:block">
              STAGE<span className="text-[#00AAFF]">X</span> <span className="text-[#d4d8e8]/40 text-xs">ADMIN</span>
            </span>
          </div>
          {/* Stats */}
          <div className="hidden md:flex items-center gap-4 ml-4 pl-4 border-l border-[#00AAFF]/10">
            {pendingCount > 0 && (
              <span className="font-['JetBrains_Mono'] text-xs text-yellow-400 flex items-center gap-1.5">
                <Calendar size={12} /> {pendingCount} εκκρεμή
              </span>
            )}
            {newOrdersCount > 0 && (
              <span className="font-['JetBrains_Mono'] text-xs text-[#00AAFF] flex items-center gap-1.5">
                <ShoppingBag size={12} /> {newOrdersCount} νέες
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll} disabled={loading} className="text-[#d4d8e8]/40 hover:text-[#00AAFF] transition-colors disabled:opacity-30">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <a href="/" target="_blank" className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/40 hover:text-[#00AAFF] transition-colors hidden sm:block">
            ← Site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="btn-neon h-8 px-4 text-xs rounded-sm flex items-center gap-2"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Έξοδος</span>
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-[#00AAFF]/08 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0 max-w-7xl mx-auto">
          {([
            { key: "appointments" as Tab, label: "Ραντεβού", icon: Calendar, count: pendingCount },
            { key: "orders" as Tab, label: "Παραγγελίες", icon: ShoppingBag, count: newOrdersCount },
            { key: "availability" as Tab, label: "Διαθεσιμότητα", icon: Settings, count: 0 },
          ]).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-4 font-['JetBrains_Mono'] text-xs uppercase tracking-widest border-b-2 transition-all duration-200 ${
                tab === key
                  ? "border-[#00AAFF] text-[#00AAFF]"
                  : "border-transparent text-[#d4d8e8]/40 hover:text-[#d4d8e8]/70"
              }`}
            >
              <Icon size={14} />
              {label}
              {count > 0 && (
                <span className="font-['JetBrains_Mono'] text-[9px] bg-[#00AAFF] text-black rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Appointments */}
        {tab === "appointments" && (
          <div>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setAppFilter(f)}
                  className={`font-['JetBrains_Mono'] text-[11px] px-4 py-1.5 rounded-sm border transition-all ${
                    appFilter === f ? "border-[#00AAFF] text-[#00AAFF] bg-[#00AAFF]/08" : "border-[#00AAFF]/15 text-[#d4d8e8]/40 hover:border-[#00AAFF]/40"
                  }`}
                >
                  {f === "all" ? "Όλα" : STATUS_LABELS[f]}
                  {f !== "all" && (
                    <span className="ml-2 opacity-60">({appointments.filter((a) => a.status === f).length})</span>
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Φόρτωση...</p>
            ) : filteredApps.length === 0 ? (
              <div className="glass-card rounded-sm p-12 text-center">
                <Calendar size={32} className="text-[#00AAFF]/30 mx-auto mb-4" />
                <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Δεν υπάρχουν ραντεβού</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredApps.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((app) => (
                  <div key={app.id} className="glass-card rounded-sm p-5 grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="font-['Orbitron'] text-xs font-700 text-white">{app.service}</p>
                      <p className="font-['JetBrains_Mono'] text-[11px] text-[#00AAFF] mt-0.5">{app.date} · {app.time}</p>
                    </div>
                    <div>
                      <p className="font-['JetBrains_Mono'] text-xs text-white font-500">{app.name}</p>
                      <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/45 mt-0.5">{app.phone}</p>
                      <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/35">{app.email}</p>
                    </div>
                    <div>
                      {app.vehicle && <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/60">{app.vehicle}</p>}
                      {app.notes && <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/35 mt-0.5 line-clamp-2">{app.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateAppStatus(app.id, "confirmed")}
                            className="w-9 h-9 flex items-center justify-center border border-green-400/30 text-green-400/70 hover:bg-green-400/10 hover:text-green-400 rounded-sm transition-all"
                            title="Επιβεβαίωση"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => updateAppStatus(app.id, "cancelled")}
                            className="w-9 h-9 flex items-center justify-center border border-red-400/30 text-red-400/70 hover:bg-red-400/10 hover:text-red-400 rounded-sm transition-all"
                            title="Ακύρωση"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                      {app.status === "confirmed" && (
                        <button
                          onClick={() => updateAppStatus(app.id, "cancelled")}
                          className="w-9 h-9 flex items-center justify-center border border-red-400/30 text-red-400/70 hover:bg-red-400/10 hover:text-red-400 rounded-sm transition-all"
                          title="Ακύρωση"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {(["all", "new", "processing", "completed", "cancelled"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className={`font-['JetBrains_Mono'] text-[11px] px-4 py-1.5 rounded-sm border transition-all ${
                    orderFilter === f ? "border-[#00AAFF] text-[#00AAFF] bg-[#00AAFF]/08" : "border-[#00AAFF]/15 text-[#d4d8e8]/40 hover:border-[#00AAFF]/40"
                  }`}
                >
                  {f === "all" ? "Όλες" : STATUS_LABELS[f]}
                  {f !== "all" && (
                    <span className="ml-2 opacity-60">({orders.filter((o) => o.status === f).length})</span>
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Φόρτωση...</p>
            ) : filteredOrders.length === 0 ? (
              <div className="glass-card rounded-sm p-12 text-center">
                <ShoppingBag size={32} className="text-[#00AAFF]/30 mx-auto mb-4" />
                <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Δεν υπάρχουν παραγγελίες</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((order) => (
                  <div key={order.id} className="glass-card rounded-sm p-5 grid sm:grid-cols-[1fr_1fr_auto_auto] gap-4 items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={order.status} />
                        <span className="font-['Orbitron'] font-700 text-sm text-white">€{order.total}</span>
                      </div>
                      <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/40 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("el-GR")}
                      </p>
                      <div className="mt-2 flex flex-col gap-0.5">
                        {order.items.map((item, i) => (
                          <p key={i} className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/55">
                            {item.qty}× {item.name} · €{item.price}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-['JetBrains_Mono'] text-xs text-white">{order.name}</p>
                      <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/45 mt-0.5">{order.phone}</p>
                      <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/35">{order.email}</p>
                      <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/35 mt-0.5">{order.address}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {order.status === "new" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "processing")}
                          className="font-['JetBrains_Mono'] text-[10px] border border-yellow-400/30 text-yellow-400/70 hover:bg-yellow-400/10 hover:text-yellow-400 px-3 py-1.5 rounded-sm transition-all flex items-center gap-1.5"
                        >
                          <Package size={11} /> Σε εξέλιξη
                        </button>
                      )}
                      {(order.status === "new" || order.status === "processing") && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "completed")}
                          className="font-['JetBrains_Mono'] text-[10px] border border-green-400/30 text-green-400/70 hover:bg-green-400/10 hover:text-green-400 px-3 py-1.5 rounded-sm transition-all flex items-center gap-1.5"
                        >
                          <Check size={11} /> Ολοκλήρωση
                        </button>
                      )}
                      {order.status !== "cancelled" && order.status !== "completed" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                          className="font-['JetBrains_Mono'] text-[10px] border border-red-400/30 text-red-400/70 hover:bg-red-400/10 hover:text-red-400 px-3 py-1.5 rounded-sm transition-all flex items-center gap-1.5"
                        >
                          <X size={11} /> Ακύρωση
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Availability */}
        {tab === "availability" && (
          <div className="max-w-2xl">
            <div className="glass-card rounded-sm p-6 sm:p-8 flex flex-col gap-7">
              {/* Working days */}
              <div>
                <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase mb-4">Εργάσιμες Μέρες</p>
                <div className="flex flex-wrap gap-2">
                  {DAY_NAMES.map((name, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setAvail((a) => ({
                          ...a,
                          workingDays: a.workingDays.includes(idx)
                            ? a.workingDays.filter((d) => d !== idx)
                            : [...a.workingDays, idx].sort(),
                        }))
                      }
                      className={`font-['JetBrains_Mono'] text-xs px-4 py-2 rounded-sm border transition-all ${
                        avail.workingDays.includes(idx)
                          ? "border-[#00AAFF] bg-[#00AAFF]/10 text-[#00AAFF]"
                          : "border-[#00AAFF]/15 text-[#d4d8e8]/40 hover:border-[#00AAFF]/40"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours + slot */}
              <div className="grid sm:grid-cols-3 gap-4">
                {([
                  { label: "Από", field: "startHour" as const, min: 0, max: 23 },
                  { label: "Έως", field: "endHour" as const, min: 1, max: 24 },
                ] as const).map(({ label, field, min, max }) => (
                  <div key={field} className="flex flex-col gap-1.5">
                    <label className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">{label}</label>
                    <input
                      type="number"
                      min={min}
                      max={max}
                      className="input-neon h-11 px-4 text-sm rounded-sm"
                      value={avail[field]}
                      onChange={(e) => setAvail((a) => ({ ...a, [field]: Number(e.target.value) }))}
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">Slot (λεπτά)</label>
                  <select
                    className="input-neon h-11 px-4 text-sm rounded-sm appearance-none"
                    value={avail.slotDuration}
                    onChange={(e) => setAvail((a) => ({ ...a, slotDuration: Number(e.target.value) }))}
                  >
                    {[30, 60, 90, 120].map((v) => (
                      <option key={v} value={v} style={{ background: "#0d0f12" }}>{v} λεπτά</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Blocked dates */}
              <div>
                <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase mb-4">
                  Αποκλεισμένες Ημερομηνίες
                  {avail.blockedDates.length > 0 && (
                    <span className="ml-2 font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/40 normal-case tracking-normal">
                      ({avail.blockedDates.length} επιλεγμένες)
                    </span>
                  )}
                </p>
                <div className="booking-cal">
                  <DayPicker
                    mode="multiple"
                    selected={avail.blockedDates.map((d) => new Date(d + "T12:00:00"))}
                    onSelect={toggleBlockedDate}
                    locale={elLocale}
                  />
                </div>
                {avail.blockedDates.length > 0 && (
                  <button
                    onClick={() => setAvail((a) => ({ ...a, blockedDates: [] }))}
                    className="mt-2 font-['JetBrains_Mono'] text-[11px] text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    Καθαρισμός όλων
                  </button>
                )}
              </div>

              <button
                onClick={saveAvailability}
                disabled={saving}
                className="btn-neon-filled h-12 text-sm rounded-sm flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {saving && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                Αποθήκευση
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
