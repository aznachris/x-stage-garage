"use client";
import { useRef, useState } from "react";
import { Plus, Trash2, Upload, Pencil, X } from "lucide-react";
import type { MerchPhoto, MerchProduct } from "@/lib/merch";
import { getProductPhotos, getStockStatus } from "@/lib/merch";
import StockBubble from "@/app/components/StockBubble";
import StockMeter from "@/app/components/StockMeter";
import MerchImageCarousel from "@/app/components/MerchImageCarousel";

type MerchForm = {
  name: string;
  price: string;
  tag: string;
  desc: string;
  stock: string;
  lowStockThreshold: string;
  photos: MerchPhoto[];
  active: boolean;
};

const BLANK: MerchForm = {
  name: "",
  price: "",
  tag: "NEW",
  desc: "",
  stock: "10",
  lowStockThreshold: "5",
  photos: [],
  active: true,
};

const inputCls = "input-neon h-10 px-3 text-sm rounded-sm w-full";

interface MerchPanelProps {
  products: MerchProduct[];
  loading: boolean;
  onRefresh: () => void;
}

export default function MerchPanel({ products, loading, onRefresh }: MerchPanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState<MerchForm>(BLANK);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MerchForm>(BLANK);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addPhotoUrl, setAddPhotoUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<"new" | "edit">("new");

  const toPayload = (f: MerchForm) => ({
    name: f.name.trim(),
    price: Number(f.price),
    tag: f.tag.trim() || "NEW",
    desc: f.desc.trim(),
    stock: Math.max(0, Number(f.stock) || 0),
    lowStockThreshold: Math.max(1, Number(f.lowStockThreshold) || 5),
    photos: f.photos.filter((p) => p.url.trim()),
    active: f.active,
  });

  const appendPhotos = (target: "new" | "edit", photos: MerchPhoto[]) => {
    if (target === "new") setNewForm((f) => ({ ...f, photos: [...f.photos, ...photos] }));
    else setEditForm((f) => ({ ...f, photos: [...f.photos, ...photos] }));
  };

  const removePhoto = (target: "new" | "edit", photoId: string) => {
    const filter = (photos: MerchPhoto[]) => photos.filter((p) => p.id !== photoId);
    if (target === "new") setNewForm((f) => ({ ...f, photos: filter(f.photos) }));
    else setEditForm((f) => ({ ...f, photos: filter(f.photos) }));
  };

  const uploadFiles = async (files: FileList | null, target: "new" | "edit") => {
    if (!files?.length) return;
    setUploading(true);
    const added: MerchPhoto[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) continue;
      const { url } = await res.json();
      added.push({ id: crypto.randomUUID(), url, caption: "" });
    }
    if (added.length) appendPhotos(target, added);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addPhotoByUrl = (target: "new" | "edit") => {
    const url = addPhotoUrl.trim();
    if (!url) return;
    appendPhotos(target, [{ id: crypto.randomUUID(), url, caption: "" }]);
    setAddPhotoUrl("");
  };

  const createProduct = async () => {
    setSaving(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(newForm)),
    });
    setNewForm(BLANK);
    setShowAdd(false);
    setSaving(false);
    onRefresh();
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(editForm)),
    });
    setEditingId(null);
    setSaving(false);
    onRefresh();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Διαγραφή προϊόντος;")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (expandedId === id) setExpandedId(null);
    onRefresh();
  };

  const startEdit = (p: MerchProduct) => {
    setEditingId(p.id);
    setExpandedId(p.id);
    setEditForm({
      name: p.name,
      price: String(p.price),
      tag: p.tag,
      desc: p.desc,
      stock: String(p.stock),
      lowStockThreshold: String(p.lowStockThreshold),
      photos: getProductPhotos(p),
      active: p.active,
    });
  };

  const lowCount = products.filter((p) => getStockStatus(p) === "low").length;
  const outCount = products.filter((p) => getStockStatus(p) === "out_of_stock").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase">{products.length} Προϊόντα</p>
          {lowCount > 0 && <StockBubble status="low" size="md" />}
          {outCount > 0 && <StockBubble status="out_of_stock" size="md" />}
        </div>
        <button type="button" onClick={() => setShowAdd((v) => !v)} className="btn-neon h-9 px-4 text-xs rounded-sm flex items-center gap-2">
          <Plus size={14} /> Νέο Merch
        </button>
      </div>
      
      {showAdd && (
        <MerchFormCard
          title="Νέο Merch"
          form={newForm}
          setForm={setNewForm}
          photoUrl={addPhotoUrl}
          setPhotoUrl={setAddPhotoUrl}
          onAddPhotoUrl={() => addPhotoByUrl("new")}
          onRemovePhoto={(id) => removePhoto("new", id)}
          onCancel={() => setShowAdd(false)}
          onSave={createProduct}
          saving={saving}
          uploading={uploading}
          onUploadClick={() => { setUploadTarget("new"); fileRef.current?.click(); }}
          inputCls={inputCls}
        />
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files, uploadTarget)} />

      {loading ? (
        <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/40">Φόρτωση...</p>
      ) : (
        products.map((p) => {
          const status = getStockStatus(p);
          const photos = getProductPhotos(p);
          return (
            <div key={p.id} className="glass-card rounded-sm overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#00AAFF]/03 transition-colors"
                onClick={() => setExpandedId((id) => (id === p.id ? null : p.id))}
              >
                <div className="w-16 h-16 rounded-sm flex-shrink-0 overflow-hidden">
                  <MerchImageCarousel photos={photos} alt={p.name} heightClass="h-16" showArrows={photos.length > 1} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-['Orbitron'] text-sm font-700 text-white">{p.name}</span>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#00AAFF] border border-[#00AAFF]/30 px-2 py-0.5 rounded-full">{p.tag}</span>
                    {!p.active && <span className="font-['JetBrains_Mono'] text-[9px] text-[#d4d8e8]/40 border border-[#d4d8e8]/20 px-2 py-0.5 rounded-full">Ανενεργό</span>}
                    {status !== "in_stock" && <StockBubble status={status} stock={p.stock} />}
                  </div>
                  <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/45 mt-0.5 line-clamp-1">{p.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#00AAFF]/60">€{p.price}</span>
                    <StockMeter status={status} stock={p.stock} lowStockThreshold={p.lowStockThreshold} />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={(e) => { e.stopPropagation(); startEdit(p); }} className="w-8 h-8 flex items-center justify-center text-[#d4d8e8]/30 hover:text-[#00AAFF] border border-transparent hover:border-[#00AAFF]/30 rounded-sm"><Pencil size={13} /></button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }} className="w-8 h-8 flex items-center justify-center text-[#d4d8e8]/30 hover:text-red-400 border border-transparent hover:border-red-400/30 rounded-sm"><Trash2 size={13} /></button>
                </div>
              </div>
              {expandedId === p.id && editingId === p.id && (
                <div className="border-t border-[#00AAFF]/08 p-5">
                  <MerchFormCard title="Επεξεργασία Merch" form={editForm} setForm={setEditForm} photoUrl={addPhotoUrl} setPhotoUrl={setAddPhotoUrl} onAddPhotoUrl={() => addPhotoByUrl("edit")} onRemovePhoto={(id) => removePhoto("edit", id)} onCancel={() => setEditingId(null)} onSave={() => saveEdit(p.id)} saving={saving} uploading={uploading} onUploadClick={() => { setUploadTarget("edit"); fileRef.current?.click(); }} inputCls={inputCls} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function MerchFormCard({ title, form, setForm, photoUrl, setPhotoUrl, onAddPhotoUrl, onRemovePhoto, onCancel, onSave, saving, uploading, onUploadClick, inputCls }: { title: string; form: MerchForm; setForm: React.Dispatch<React.SetStateAction<MerchForm>>; photoUrl: string; setPhotoUrl: (v: string) => void; onAddPhotoUrl: () => void; onRemovePhoto: (id: string) => void; onCancel: () => void; onSave: () => void; saving: boolean; uploading: boolean; onUploadClick: () => void; inputCls: string }) {
  return (
    <div className="glass-card rounded-sm p-5 flex flex-col gap-4 border border-[#00AAFF]/20">
      <p className="font-['Orbitron'] text-xs font-700 text-[#00AAFF] tracking-widest uppercase">{title}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Όνομα"><input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Stage X Hoodie" /></Field>
        <Field label="Τιμή (€)"><input type="number" min={0} step={0.01} className={inputCls} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></Field>
        <Field label="Tag"><input className={inputCls} value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} placeholder="BESTSELLER" /></Field>
        <Field label="Stock"><input type="number" min={0} className={inputCls} value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} /></Field>
        <Field label="Alert όταν ≤"><input type="number" min={1} className={inputCls} value={form.lowStockThreshold} onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: e.target.value }))} /></Field>
        <Field label="Ενεργό"><label className="flex items-center gap-2 h-10 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="accent-[#00AAFF]" /><span className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/60">Εμφάνιση στο shop</span></label></Field>
        <div className="sm:col-span-2 flex flex-col gap-1"><label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Περιγραφή</label><textarea className="input-neon px-3 py-2 text-sm rounded-sm resize-none" rows={2} value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} /></div>
        <div className="sm:col-span-2 flex flex-col gap-3">
          <label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">Φωτογραφίες</label>
          {form.photos.length > 0 && <MerchImageCarousel photos={form.photos} alt={form.name} heightClass="h-40" />}
          {form.photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {form.photos.map((photo) => (
                <div key={photo.id} className="relative group aspect-square rounded-sm overflow-hidden border border-[#00AAFF]/10">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => onRemovePhoto(photo.id)} className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-red-400 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <input className={inputCls + " flex-1 min-w-[200px]"} placeholder="URL φωτογραφίας" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAddPhotoUrl())} />
            <button type="button" onClick={onAddPhotoUrl} disabled={!photoUrl.trim()} className="btn-neon h-10 px-4 text-xs rounded-sm disabled:opacity-40">URL</button>
            <button type="button" onClick={onUploadClick} disabled={uploading} className="btn-neon h-10 px-4 text-xs rounded-sm flex items-center gap-2 disabled:opacity-50"><Upload size={13} /> {uploading ? "..." : "Upload"}</button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-neon h-9 px-4 text-xs rounded-sm">Άκυρο</button>
        <button type="button" onClick={onSave} disabled={saving || !form.name.trim()} className="btn-neon-filled h-9 px-5 text-xs rounded-sm disabled:opacity-50">Αποθήκευση</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div className="flex flex-col gap-1"><label className="font-['JetBrains_Mono'] text-[10px] text-[#d4d8e8]/50 uppercase tracking-widest">{label}</label>{children}</div>);
}
