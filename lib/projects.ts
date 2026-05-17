export interface Photo {
  id: string;
  url: string;
  caption: string;
}

export interface Project {
  id: string;
  title: string;
  category: "German" | "Japanese";
  specs: string;
  description: string;
  color: string;
  accent: string;
  year: string;
  photos: Photo[];
}

export const DEFAULT_PROJECTS: Project[] = [
  { id: "1", title: "BMW M3 E92", category: "German", specs: "S65 V8 | 480HP | Full Cage", description: "Full track build on a E92 M3. Engine refreshed, suspension rebuilt, roll cage, bucket seats.", color: "#1A2B3C", accent: "#00AAFF", year: "2024", photos: [] },
  { id: "2", title: "Nissan Skyline R34", category: "Japanese", specs: "RB26 TT | 650HP | Time Attack", description: "Iconic R34 GTR running twin-turbo RB26 built for track dominance. Sequential gearbox, full aero.", color: "#0D1A0D", accent: "#00FF88", year: "2024", photos: [] },
  { id: "3", title: "Porsche 911 GT3", category: "German", specs: "9000RPM | 520HP | Clubsport", description: "Naturally aspirated 992 GT3 with custom exhaust, aero package and suspension geometry.", color: "#1A1A2B", accent: "#00AAFF", year: "2023", photos: [] },
  { id: "4", title: "Toyota Supra A90", category: "Japanese", specs: "B58 | 700HP | Street/Strip", description: "Pure street machine. Single turbo upgrade, ECU flash, custom intake manifold and exhaust.", color: "#1A0D0D", accent: "#FF6600", year: "2023", photos: [] },
  { id: "5", title: "Mercedes AMG C63", category: "German", specs: "M156 V8 | 560HP | Stanced", description: "W205 C63 with full air suspension, forged wheels, dyno-tuned V8 with headers and full exhaust.", color: "#0D0D1A", accent: "#00AAFF", year: "2023", photos: [] },
  { id: "6", title: "Honda NSX NA1", category: "Japanese", specs: "C30A | 280HP | Restored", description: "Full NSX restoration and upgrade. Engine rebuild, suspension refresh, Mugen aero, recaro interior.", color: "#1A1A0D", accent: "#FFD700", year: "2022", photos: [] },
  { id: "7", title: "BMW E30 M3", category: "German", specs: "S54 Swap | 343HP | Restomod", description: "Classic E30 shell, modern S54 engine swap with custom mounts, 6-speed gearbox, full rebuild.", color: "#1A2B3C", accent: "#00AAFF", year: "2022", photos: [] },
  { id: "8", title: "Nissan 350Z", category: "Japanese", specs: "VQ35HR | 420HP | Drift", description: "Dedicated drift build. Engine built, hydraulic handbrake, custom cage, angle kit, wide body kit.", color: "#1A0D1A", accent: "#FF00AA", year: "2022", photos: [] },
  { id: "9", title: "Porsche 993 Turbo", category: "German", specs: "3.6TT | 480HP | OEM+", description: "Timeless 993 Turbo with period-correct upgrades. Engine rebuild, new turbos, fresh everything.", color: "#1A1A2B", accent: "#00AAFF", year: "2021", photos: [] },
];
