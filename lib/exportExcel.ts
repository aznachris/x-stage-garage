import * as XLSX from "xlsx";

const STATUS_LABELS: Record<string, string> = {
  pending: "Εκκρεμεί",
  confirmed: "Επιβεβαιωμένο",
  cancelled: "Ακυρωμένο",
  new: "Νέα",
  processing: "Σε εξέλιξη",
  completed: "Ολοκληρώθηκε",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("el-GR");
  } catch {
    return iso;
  }
}

function fileStamp() {
  return new Date().toISOString().slice(0, 10);
}

function downloadSheet(rows: Record<string, string | number>[], sheetName: string, filename: string) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

export interface ExportAppointment {
  id: string;
  date: string;
  time: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  notes: string;
  status: string;
  createdAt: string;
}

export interface ExportOrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface ExportOrder {
  id: string;
  items: ExportOrderItem[];
  total: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
}

export interface ExportMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function exportAppointmentsToExcel(appointments: ExportAppointment[]) {
  const rows = appointments.map((a) => ({
    ID: a.id,
    Ημερομηνία: a.date,
    Ώρα: a.time,
    Υπηρεσία: a.service,
    Όνομα: a.name,
    Email: a.email,
    Τηλέφωνο: a.phone,
    Όχημα: a.vehicle,
    Σημειώσεις: a.notes,
    Κατάσταση: STATUS_LABELS[a.status] ?? a.status,
    "Δημιουργήθηκε": formatDate(a.createdAt),
  }));
  downloadSheet(rows, "Ραντεβού", `stagex-rantevou-${fileStamp()}.xlsx`);
}

export function exportOrdersToExcel(orders: ExportOrder[]) {
  const rows = orders.map((o) => ({
    ID: o.id,
    Προϊόντα: o.items.map((i) => `${i.qty}× ${i.name} (€${i.price})`).join("; "),
    Σύνολο: o.total,
    Όνομα: o.name,
    Email: o.email,
    Τηλέφωνο: o.phone,
    Διεύθυνση: o.address,
    Κατάσταση: STATUS_LABELS[o.status] ?? o.status,
    Ημερομηνία: formatDate(o.createdAt),
  }));
  downloadSheet(rows, "Παραγγελίες", `stagex-paraggelies-${fileStamp()}.xlsx`);
}

export function exportMessagesToExcel(messages: ExportMessage[]) {
  const rows = messages.map((m) => ({
    ID: m.id,
    Όνομα: m.name,
    Email: m.email,
    Τηλέφωνο: m.phone,
    Υπηρεσία: m.service,
    Μήνυμα: m.message,
    Αναγνωσμένο: m.read ? "Ναι" : "Όχι",
    Ημερομηνία: formatDate(m.createdAt),
  }));
  downloadSheet(rows, "Μηνύματα", `stagex-minimata-${fileStamp()}.xlsx`);
}
