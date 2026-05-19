"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { signOut } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { el as elLocale } from "date-fns/locale";
import {
  LogOut, RefreshCw, Calendar, ShoppingBag, Settings, Check, X,
  Package, Images, Plus, Trash2, Upload, Pencil, MessageSquare, Mail, Shirt, Download,
} from "lucide-react";
import {
  exportAppointmentsToExcel,
  exportOrdersToExcel,
  exportMessagesToExcel,
} from "@/lib/exportExcel";
import type { Project } from "@/lib/projects";
import type { MerchProduct } from "@/lib/merch";
import { getStockStatus } from "@/lib/merch";
import type { Message } from "@/app/api/messages/route";
import MerchPanel from "@/app/admin/MerchPanel";

type AppStatus = "pending" | "confirmed" | "cancelled";
type OrderStatus = "new" | "processing" | "completed" | "cancelled";
type Tab = "appointments" | "orders" | "merch" | "availability" | "portfolio" | "messages";

interface Appointment {
  id: string; date: string; time: string; service: string;
  name: string; email: string; phone: string; vehicle: string; notes: string;
  status: AppStatus; createdAt: string;
}
interface OrderItem { name: string; price: number; qty: number }
interface Order {
  id: string; items: OrderItem[]; total: number;
  name: string; email: string; phone: string; address: string;
  status: OrderStatus; createdAt: string;
}
interface Availability {
  workingDays: number[]; startHour: number; endHour: number;
  slotDuration: number; blockedDates: string[];
}

const DAY_NAMES = ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"];

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 border-yellow-400/30 bg-yellow-400/08",
  confirmed: "text-green-400 border-green-400/30 bg-green-400/08",
  cancelled: "text-red-400 border-red-400/30 bg-red-400/08",
  new: "text-[#00AAFF] border-[#00AAFF]/30 bg-[#00AAFF]/08",
  processing: "text-yellow-400 border-yellow-400/30 bg-yellow-400/08",
  completed: "text-green-400 border-green-400/30 bg-green-400/08",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "Εκκρεμεί", confirmed: "Επιβεβαιωμένο", cancelled: "Ακυρωμένο",
  new: "Νέα", processing: "Σε εξέλιξη", completed: "Ολοκληρώθηκε",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`font-['JetBrains_Mono'] text-[10px] border px-2 py-0.5 rounded-full ${STATUS_COLORS[status] ?? ""}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function ExportExcelButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="font-['JetBrains_Mono'] text-[11px] px-4 py-1.5 rounded-sm border border-[#00AAFF]/30 text-[#00AAFF] hover:bg-[#00AAFF]/08 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed sm:ml-auto"
    >
      <Download size={13} />
      Excel
    </button>
  );
}

type ProjectForm = { title: string; category: "German" | "Japanese"; specs: string; description: string; year: string; color: string; accent: string };
const BLANK_PROJECT: ProjectForm = { title: "", category: "German", specs: "", description: "", year: String(new Date().getFullYear()), color: "#1A2B3C", accent: "#00AAFF" };

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [merch, setMerch] = useState<MerchProduct[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedMsgId, setExpandedMsgId] = useState<string | null>(null);
  const [avail, setAvail] = useState<Availability>({ workingDays: [1,2,3,4,5,6], startHour: 8, endHour: 18, slotDuration: 60, blockedDates: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appFilter, setAppFilter] = useState<AppStatus | "all">("all");
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");

  // Portfolio state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addPhotoUrl, setAddPhotoUrl] = useState("");
  const [addPhotoCaption, setAddPhotoCaption] = useState("");
  const [addingPhoto, setAddingPhoto] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState(BLANK_PROJECT);
  const [savingProject, setSavingProject] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(BLANK_PROJECT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [appsRes, ordersRes, merchRes, availRes, projectsRes, msgsRes] = await Promise.all([
      fetch("/api/appointments"),
      fetch("/api/orders"),
      fetch("/api/products?all=1"),
      fetch("/api/availability"),
      fetch("/api/projects"),
      fetch("/api/messages"),
    ]);
    const [apps, ords, merchItems, av, projs, msgs] = await Promise.all([
      appsRes.json(), ordersRes.json(), merchRes.json(), availRes.json(), projectsRes.json(), msgsRes.json(),
    ]);
    setAppointments(apps);
    setOrders(ords);
    setMerch(merchItems);
    setAvail(av);
    setProjects(projs);
    setMessages(msgs);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateAppStatus = async (id: string, status: AppStatus) => {
    await fetch(`/api/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setAppointments((a) => a.map((ap) => ap.id === id ? { ...ap, status } : ap));
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setOrders((o) => o.map((or) => or.id === id ? { ...or, status } : or));
  };

  const saveAvailability = async () => {
    setSaving(true);
    await fetch("/api/availability", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(avail) });
    setSaving(false);
  };

  const toggleBlockedDate = (dates: Date[] | undefined) => {
    setAvail((a) => ({ ...a, blockedDates: (dates ?? []).map((d) => format(d, "yyyy-MM-dd")) }));
  };

  // Portfolio actions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    setAddPhotoUrl(url);
    setUploadingFile(false);
  };

  const addPhoto = async (projectId: string) => {
    if (!addPhotoUrl.trim()) return;
    setAddingPhoto(true);
    const res = await fetch(`/api/projects/${projectId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: addPhotoUrl.trim(), caption: addPhotoCaption.trim() }),
    });
    const photo = await res.json();
    setProjects((ps) => ps.map((p) => p.id === projectId ? { ...p, photos: [...p.photos, photo] } : p));
    setAddPhotoUrl("");
    setAddPhotoCaption("");
    setAddingPhoto(false);
  };

  const deletePhoto = async (projectId: string, photoId: string) => {
    await fetch(`/api/projects/${projectId}/photos/${photoId}`, { method: "DELETE" });
    setProjects((ps) => ps.map((p) => p.id === projectId ? { ...p, photos: p.photos.filter((ph) => ph.id !== photoId) } : p));
  };

  const createProject = async () => {
    setSavingProject(true);
    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newProject) });
    const p = await res.json();
    setProjects((ps) => [...ps, p]);
    setNewProject(BLANK_PROJECT);
    setShowAddProject(false);
    setExpandedId(p.id);
    setSavingProject(false);
  };

  const saveEditProject = async (id: string) => {
    setSavingProject(true);
    const res = await fetch(`/api/projects/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
    const updated = await res.json();
    setProjects((ps) => ps.map((p) => p.id === id ? { ...p, ...updated } : p));
    setEditingId(null);
    setSavingProject(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Διαγραφή project;")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((ps) => ps.filter((p) => p.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const markMessageRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    setMessages((ms) => ms.map((m) => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages((ms) => ms.filter((m) => m.id !== id));
    if (expandedMsgId === id) setExpandedMsgId(null);
  };

  const filteredApps = appFilter === "all" ? appointments : appointments.filter((a) => a.status === appFilter);
  const filteredOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const lowStockCount = merch.filter((p) => getStockStatus(p) === "low").length;
  const outStockCount = merch.filter((p) => getStockStatus(p) === "out_of_stock").length;
  const unreadMsgCount = messages.filter((m) => !m.read).length;

  const inputCls = "input-neon h-10 px-3 text-sm rounded-sm w-full";

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white">
      {/* Top bar */}
      <header className="border-b border-[#00AAFF]/10 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0d0f12]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="font-['Orbitron'] font-700 text-sm tracking-widest text-white">
              Stage <span className="text-[#00AAFF]">X</span> Garage{" "}
              <span className="text-[#d4d8e8]/40 text-xs font-normal tracking-wide">Admin</span>
            </span>
          </div>
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
            {unreadMsgCount > 0 && (
              <span className="font-['JetBrains_Mono'] text-xs text-purple-400 flex items-center gap-1.5">
                <Mail size={12} /> {unreadMsgCount} αδιάβαστα
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll} disabled={loading} className="text-[#d4d8e8]/40 hover:text-[#00AAFF] transition-colors disabled:opacity-30">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <a href="/" target="_blank" className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/40 hover:text-[#00AAFF] transition-colors hidden sm:block">← Site</a>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="btn-neon h-8 px-4 text-xs rounded-sm flex items-center gap-2">
            <LogOut size={13} /><span className="hidden sm:inline">Έξοδος</span>
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-[#00AAFF]/08 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0 max-w-7xl mx-auto overflow-x-auto">
          {([
            { key: "appointments" as Tab, label: "Ραντεβού", icon: Calendar, count: pendingCount },
            { key: "orders" as Tab, label: "Παραγγελίες", icon: ShoppingBag, count: newOrdersCount },
            { key: "merch" as Tab, label: "Merch", icon: Shirt, count: lowStockCount + outStockCount },
            { key: "availability" as Tab, label: "Διαθεσιμότητα", icon: Settings, count: 0 },
            { key: "portfolio" as Tab, label: "Portfolio", icon: Images, count: 0 },
            { key: "messages" as Tab, label: "Μηνύματα", icon: MessageSquare, count: unreadMsgCount },
          ]).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-4 font-['JetBrains_Mono'] text-xs uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap ${
                tab === key ? "border-[#00AAFF] text-[#00AAFF]" : "border-transparent text-[#d4d8e8]/40 hover:text-[#d4d8e8]/70"
              }`}
            >
              <Icon size={14} />
              {label}
              {count > 0 && (
                <span className="font-['JetBrains_Mono'] text-[9px] bg-[#00AAFF] text-black rounded-full w-4 h-4 flex items-center justify-center font-bold">{count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Appointments ── */}
        {tab === "appointments" && (
          <div>
            <div className="flex items-center gap-3 mb-6 flex-wrap w-full">
              {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
                <button key={f} onClick={() => setAppFilter(f)}
                  className={`font-['JetBrains_Mono'] text-[11px] px-4 py-1.5 rounded-sm border transition-all ${appFilter === f ? "border-[#00AAFF] text-[#00AAFF] bg-[#00AAFF]/08" : "border-[#00AAFF]/15 text-[#d4d8e8]/40 hover:border-[#00AAFF]/40"}`}>
                  {f === "all" ? "Όλα" : STATUS_LABELS[f]}
                  {f !== "all" && <span className="ml-2 opacity-60">({appointments.filter((a) => a.status === f).length})</span>}
                </button>
              ))}
              <ExportExcelButton
                onClick={() => exportAppointmentsToExcel(filteredApps)}
                disabled={loading || filteredApps.length === 0}
              />
            </div>
            {loading ? <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Φόρτωση...</p>
              : filteredApps.length === 0 ? (
                <div className="glass-card rounded-sm p-12 text-center">
                  <Calendar size={32} className="text-[#00AAFF]/30 mx-auto mb-4" />
                  <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Δεν υπάρχουν ραντεβού</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredApps.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((app) => (
                    <div key={app.id} className="glass-card rounded-sm p-5 grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1"><StatusBadge status={app.status} /></div>
                        <p className="font-['Orbitron'] text-xs font-700 text-white">{app.service}</p>
                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#00AAFF] mt-0.5">{app.date} · {app.time}</p>
                      </div>
                      <div>
                        <p className="font-['JetBrains_Mono'] text-xs text-white">{app.name}</p>
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
                            <button onClick={() => updateAppStatus(app.id, "confirmed")} title="Επιβεβαίωση"
                              className="w-9 h-9 flex items-center justify-center border border-green-400/30 text-green-400/70 hover:bg-green-400/10 hover:text-green-400 rounded-sm transition-all">
                              <Check size={15} />
                            </button>
                            <button onClick={() => updateAppStatus(app.id, "cancelled")} title="Ακύρωση"
                              className="w-9 h-9 flex items-center justify-center border border-red-400/30 text-red-400/70 hover:bg-red-400/10 hover:text-red-400 rounded-sm transition-all">
                              <X size={15} />
                            </button>
                          </>
                        )}
                        {app.status === "confirmed" && (
                          <button onClick={() => updateAppStatus(app.id, "cancelled")} title="Ακύρωση"
                            className="w-9 h-9 flex items-center justify-center border border-red-400/30 text-red-400/70 hover:bg-red-400/10 hover:text-red-400 rounded-sm transition-all">
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

        {/* ── Orders ── */}
        {tab === "orders" && (
          <div>
            <div className="flex items-center gap-3 mb-6 flex-wrap w-full">
              {(["all", "new", "processing", "completed", "cancelled"] as const).map((f) => (
                <button key={f} onClick={() => setOrderFilter(f)}
                  className={`font-['JetBrains_Mono'] text-[11px] px-4 py-1.5 rounded-sm border transition-all ${orderFilter === f ? "border-[#00AAFF] text-[#00AAFF] bg-[#00AAFF]/08" : "border-[#00AAFF]/15 text-[#d4d8e8]/40 hover:border-[#00AAFF]/40"}`}>
                  {f === "all" ? "Όλες" : STATUS_LABELS[f]}
                  {f !== "all" && <span className="ml-2 opacity-60">({orders.filter((o) => o.status === f).length})</span>}
                </button>
              ))}
              <ExportExcelButton
                onClick={() => exportOrdersToExcel(filteredOrders)}
                disabled={loading || filteredOrders.length === 0}
              />
            </div>
            {loading ? <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Φόρτωση...</p>
              : filteredOrders.length === 0 ? (
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
                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/40 mt-0.5">{new Date(order.createdAt).toLocaleDateString("el-GR")}</p>
                        <div className="mt-2 flex flex-col gap-0.5">
                          {order.items.map((item, i) => (
                            <p key={i} className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/55">{item.qty}× {item.name} · €{item.price}</p>
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
                          <button onClick={() => updateOrderStatus(order.id, "processing")}
                            className="font-['JetBrains_Mono'] text-[10px] border border-yellow-400/30 text-yellow-400/70 hover:bg-yellow-400/10 hover:text-yellow-400 px-3 py-1.5 rounded-sm transition-all flex items-center gap-1.5">
                            <Package size={11} /> Σε εξέλιξη
                          </button>
                        )}
                        {(order.status === "new" || order.status === "processing") && (
                          <button onClick={() => updateOrderStatus(order.id, "completed")}
                            className="font-['JetBrains_Mono'] text-[10px] border border-green-400/30 text-green-400/70 hover:bg-green-400/10 hover:text-green-400 px-3 py-1.5 rounded-sm transition-all flex items-center gap-1.5">
                            <Check size={11} /> Ολοκλήρωση
                          </button>
                        )}
                        {order.status !== "cancelled" && order.status !== "completed" && (
                          <button onClick={() => updateOrderStatus(order.id, "cancelled")}
                            className="font-['JetBrains_Mono'] text-[10px] border border-red-400/30 text-red-400/70 hover:bg-red-400/10 hover:text-red-400 px-3 py-1.5 rounded-sm transition-all flex items-center gap-1.5">
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

        {/* ── Merch ── */}
        {tab === "merch" && (
          <MerchPanel products={merch} loading={loading} onRefresh={fetchAll} />
        )}

        {/* ── Availability ── */}
        {tab === "availability" && (
          <div className="max-w-2xl">
            <div className="glass-card rounded-sm p-6 sm:p-8 flex flex-col gap-7">
              <div>
                <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase mb-4">Εργάσιμες Μέρες</p>
                <div className="flex flex-wrap gap-2">
                  {DAY_NAMES.map((name, idx) => (
                    <button key={idx}
                      onClick={() => setAvail((a) => ({ ...a, workingDays: a.workingDays.includes(idx) ? a.workingDays.filter((d) => d !== idx) : [...a.workingDays, idx].sort() }))}
                      className={`font-['JetBrains_Mono'] text-xs px-4 py-2 rounded-sm border transition-all ${avail.workingDays.includes(idx) ? "border-[#00AAFF] bg-[#00AAFF]/10 text-[#00AAFF]" : "border-[#00AAFF]/15 text-[#d4d8e8]/40 hover:border-[#00AAFF]/40"}`}>
                      {name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {([{ label: "Από", field: "startHour" as const, min: 0, max: 23 }, { label: "Έως", field: "endHour" as const, min: 1, max: 24 }]).map(({ label, field, min, max }) => (
                  <div key={field} className="flex flex-col gap-1.5">
                    <label className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">{label}</label>
                    <input type="number" min={min} max={max} className="input-neon h-11 px-4 text-sm rounded-sm"
                      value={avail[field]} onChange={(e) => setAvail((a) => ({ ...a, [field]: Number(e.target.value) }))} />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">Slot (λεπτά)</label>
                  <select className="input-neon h-11 px-4 text-sm rounded-sm appearance-none" value={avail.slotDuration}
                    onChange={(e) => setAvail((a) => ({ ...a, slotDuration: Number(e.target.value) }))}>
                    {[30, 60, 90, 120].map((v) => <option key={v} value={v} style={{ background: "#0d0f12" }}>{v} λεπτά</option>)}
                  </select>
                </div>
              </div>
              <div>
                <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase mb-4">
                  Αποκλεισμένες Ημερομηνίες
                  {avail.blockedDates.length > 0 && <span className="ml-2 font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/40 normal-case tracking-normal">({avail.blockedDates.length} επιλεγμένες)</span>}
                </p>
                <div className="booking-cal">
                  <DayPicker mode="multiple" selected={avail.blockedDates.map((d) => new Date(d + "T12:00:00"))} onSelect={toggleBlockedDate} locale={elLocale} />
                </div>
                {avail.blockedDates.length > 0 && (
                  <button onClick={() => setAvail((a) => ({ ...a, blockedDates: [] }))} className="mt-2 font-['JetBrains_Mono'] text-[11px] text-red-400/60 hover:text-red-400 transition-colors">
                    Καθαρισμός όλων
                  </button>
                )}
              </div>
              <button onClick={saveAvailability} disabled={saving} className="btn-neon-filled h-12 text-sm rounded-sm flex items-center justify-center gap-3 disabled:opacity-50">
                {saving && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                Αποθήκευση
              </button>
            </div>
          </div>
        )}

        {/* ── Portfolio ── */}
        {tab === "portfolio" && (
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase">
                {projects.length} Projects
              </p>
              <button onClick={() => setShowAddProject((v) => !v)} className="btn-neon h-9 px-4 text-xs rounded-sm flex items-center gap-2">
                <Plus size={14} /> Νέο Project
              </button>
            </div>

            {/* Add project form */}
            {showAddProject && (
              <div className="glass-card rounded-sm p-5 flex flex-col gap-4 border border-[#00AAFF]/20">
                <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase">Νέο Project</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Τίτλος</label>
                    <input className={inputCls} value={newProject.title} onChange={(e) => setNewProject((f) => ({ ...f, title: e.target.value }))} placeholder="BMW M3 E92" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Κατηγορία</label>
                    <select className={inputCls + " appearance-none"} value={newProject.category} onChange={(e) => setNewProject((f) => ({ ...f, category: e.target.value as "German" | "Japanese" }))}>
                      <option value="German" style={{ background: "#0d0f12" }}>German</option>
                      <option value="Japanese" style={{ background: "#0d0f12" }}>Japanese</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Specs</label>
                    <input className={inputCls} value={newProject.specs} onChange={(e) => setNewProject((f) => ({ ...f, specs: e.target.value }))} placeholder="S65 V8 | 480HP" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Έτος</label>
                    <input className={inputCls} value={newProject.year} onChange={(e) => setNewProject((f) => ({ ...f, year: e.target.value }))} placeholder="2024" />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Περιγραφή</label>
                    <textarea className="input-neon px-3 py-2 text-sm rounded-sm resize-none" rows={2} value={newProject.description} onChange={(e) => setNewProject((f) => ({ ...f, description: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowAddProject(false)} className="btn-neon h-9 px-4 text-xs rounded-sm">Άκυρο</button>
                  <button onClick={createProject} disabled={savingProject || !newProject.title.trim()} className="btn-neon-filled h-9 px-5 text-xs rounded-sm disabled:opacity-50">
                    Δημιουργία
                  </button>
                </div>
              </div>
            )}

            {/* Project list */}
            {loading ? <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Φόρτωση...</p> : projects.map((project) => (
              <div key={project.id} className="glass-card rounded-sm overflow-hidden">
                {/* Project row */}
                <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#00AAFF]/03 transition-colors"
                  onClick={() => setExpandedId((id) => id === project.id ? null : project.id)}>
                  <div
                    className="w-12 h-12 rounded-sm flex-shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${project.color} 0%, #050608 100%)` }}
                  >
                    {project.photos.length > 0
                      ? <img src={project.photos[0].url} alt="" className="w-full h-full object-cover rounded-sm" />
                      : <svg viewBox="0 0 80 30" className="w-8 opacity-50" fill="none">
                          <path d="M8 20 L14 12 L28 8 L52 8 L66 12 L72 20 Z" fill={project.accent} opacity="0.6" />
                          <circle cx="20" cy="22" r="5" fill={project.accent} opacity="0.7" />
                          <circle cx="60" cy="22" r="5" fill={project.accent} opacity="0.7" />
                        </svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-['Orbitron'] text-sm font-700 text-white">{project.title}</span>
                      <span className="font-['JetBrains_Mono'] text-[9px] border px-1.5 py-0.5 rounded-sm" style={{ color: project.accent, borderColor: `${project.accent}40` }}>{project.category}</span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/30">{project.year}</span>
                    </div>
                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#00AAFF]/50 mt-0.5">{project.specs}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/40 flex items-center gap-1.5">
                      <Images size={12} /> {project.photos.length}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(project.id); setEditForm({ title: project.title, category: project.category, specs: project.specs, description: project.description, year: project.year, color: project.color, accent: project.accent }); setExpandedId(project.id); }}
                      className="w-8 h-8 flex items-center justify-center text-[#d4d8e8]/30 hover:text-[#00AAFF] transition-colors border border-transparent hover:border-[#00AAFF]/30 rounded-sm">
                      <Pencil size={13} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                      className="w-8 h-8 flex items-center justify-center text-[#d4d8e8]/30 hover:text-red-400 transition-colors border border-transparent hover:border-red-400/30 rounded-sm">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded section */}
                {expandedId === project.id && (
                  <div className="border-t border-[#00AAFF]/08 p-5 flex flex-col gap-5">

                    {/* Edit form */}
                    {editingId === project.id && (
                      <div className="flex flex-col gap-3 p-4 border border-[#00AAFF]/15 rounded-sm bg-[#00AAFF]/03">
                        <p className="font-['Orbitron'] text-[10px] text-[#00AAFF] tracking-widest uppercase">Επεξεργασία</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Τίτλος</label>
                            <input className={inputCls} value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Κατηγορία</label>
                            <select className={inputCls + " appearance-none"} value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value as "German" | "Japanese" }))}>
                              <option value="German" style={{ background: "#0d0f12" }}>German</option>
                              <option value="Japanese" style={{ background: "#0d0f12" }}>Japanese</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Specs</label>
                            <input className={inputCls} value={editForm.specs} onChange={(e) => setEditForm((f) => ({ ...f, specs: e.target.value }))} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Έτος</label>
                            <input className={inputCls} value={editForm.year} onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))} />
                          </div>
                          <div className="sm:col-span-2 flex flex-col gap-1">
                            <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Περιγραφή</label>
                            <textarea className="input-neon px-3 py-2 text-sm rounded-sm resize-none" rows={2} value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button onClick={() => setEditingId(null)} className="btn-neon h-9 px-4 text-xs rounded-sm">Άκυρο</button>
                          <button onClick={() => saveEditProject(project.id)} disabled={savingProject} className="btn-neon-filled h-9 px-5 text-xs rounded-sm disabled:opacity-50">Αποθήκευση</button>
                        </div>
                      </div>
                    )}

                    {/* Photos grid */}
                    {project.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {project.photos.map((photo) => (
                          <div key={photo.id} className="relative group aspect-video rounded-sm overflow-hidden border border-[#00AAFF]/10">
                            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                            {photo.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                                <p className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/70 truncate">{photo.caption}</p>
                              </div>
                            )}
                            <button
                              onClick={() => deletePhoto(project.id, photo.id)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 text-red-400/70 hover:text-red-400 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-400/20"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add photo form */}
                    <div className="flex flex-col gap-3 pt-3 border-t border-[#00AAFF]/08">
                      <p className="font-['Orbitron'] text-[10px] text-[#00AAFF]/70 tracking-widest uppercase">Προσθήκη Φωτογραφίας</p>
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <input
                          className={inputCls + " flex-1 min-w-0"}
                          placeholder="URL φωτογραφίας"
                          value={addPhotoUrl}
                          onChange={(e) => setAddPhotoUrl(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addPhoto(project.id)}
                        />
                        <input
                          className={inputCls + " flex-1 min-w-0"}
                          placeholder="Λεζάντα (προαιρετικό)"
                          value={addPhotoCaption}
                          onChange={(e) => setAddPhotoCaption(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addPhoto(project.id)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {/* File upload */}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingFile}
                          className="btn-neon h-9 px-4 text-xs rounded-sm flex items-center gap-2 disabled:opacity-50"
                        >
                          <Upload size={13} />
                          {uploadingFile ? "Ανέβασμα..." : "Ανέβασε αρχείο"}
                        </button>
                        <button
                          onClick={() => addPhoto(project.id)}
                          disabled={addingPhoto || !addPhotoUrl.trim()}
                          className="btn-neon-filled h-9 px-5 text-xs rounded-sm flex items-center gap-2 disabled:opacity-50"
                        >
                          <Plus size={13} />
                          Προσθήκη
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* ── Messages ── */}
        {tab === "messages" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end mb-2">
              <ExportExcelButton
                onClick={() => exportMessagesToExcel(messages)}
                disabled={loading || messages.length === 0}
              />
            </div>
            {loading ? (
              <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Φόρτωση...</p>
            ) : messages.length === 0 ? (
              <div className="glass-card rounded-sm p-12 text-center">
                <MessageSquare size={32} className="text-[#00AAFF]/30 mx-auto mb-4" />
                <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Δεν υπάρχουν μηνύματα</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`glass-card rounded-sm overflow-hidden border transition-colors ${
                    !msg.read ? "border-purple-400/25 bg-purple-400/02" : "border-[#00AAFF]/08"
                  }`}
                >
                  {/* Row */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/02 transition-colors"
                    onClick={() => setExpandedMsgId((id) => id === msg.id ? null : msg.id)}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!msg.read ? "bg-purple-400" : "bg-transparent"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-['Orbitron'] text-xs font-700 text-white">{msg.name}</span>
                        <span className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/40">{msg.email}</span>
                        {msg.service && (
                          <span className="font-['JetBrains_Mono'] text-[9px] text-[#00AAFF]/60 border border-[#00AAFF]/20 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                            {msg.service}
                          </span>
                        )}
                      </div>
                      <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/45 mt-0.5 truncate">{msg.message}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/30">
                        {new Date(msg.createdAt).toLocaleDateString("el-GR")}
                      </span>
                      {!msg.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markMessageRead(msg.id); }}
                          title="Σήμανση ως αναγνωσμένο"
                          className="w-8 h-8 flex items-center justify-center border border-purple-400/30 text-purple-400/70 hover:bg-purple-400/10 hover:text-purple-400 rounded-sm transition-all"
                        >
                          <Check size={13} />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                        className="w-8 h-8 flex items-center justify-center border border-transparent text-[#d4d8e8]/25 hover:border-red-400/30 hover:text-red-400 rounded-sm transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded */}
                  {expandedMsgId === msg.id && (
                    <div className="border-t border-[#00AAFF]/08 px-5 py-4 flex flex-col gap-3 bg-white/01">
                      {msg.phone && (
                        <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/50">
                          <span className="text-[#00AAFF]/50 uppercase tracking-widest text-[10px] mr-2">Τηλ.</span>{msg.phone}
                        </p>
                      )}
                      <div className="border border-[#00AAFF]/10 rounded-sm p-4 bg-[#0d0f12]">
                        <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/75 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      {!msg.read && (
                        <button
                          onClick={() => markMessageRead(msg.id)}
                          className="self-start font-['JetBrains_Mono'] text-[11px] text-purple-400/70 hover:text-purple-400 transition-colors flex items-center gap-1.5"
                        >
                          <Check size={12} /> Σήμανση ως αναγνωσμένο
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
