"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Λάθος password / Wrong password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
            <rect width="48" height="48" fill="#000" />
            <line x1="6" y1="6" x2="42" y2="42" stroke="#00AAFF" strokeWidth="6" strokeLinecap="round" />
            <line x1="42" y1="6" x2="6" y2="42" stroke="#00AAFF" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <div className="text-center">
            <p className="font-['Orbitron'] font-900 text-lg tracking-widest text-white">
              STAGE<span className="text-[#00AAFF]">X</span> GARAGE
            </p>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#00AAFF]/50 uppercase tracking-[0.3em] mt-1">Admin Panel</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-sm p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/50 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                className="input-neon h-11 px-4 pr-11 text-sm rounded-sm w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4d8e8]/30 hover:text-[#00AAFF] transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p className="font-['JetBrains_Mono'] text-[10px] text-red-400 mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-neon-filled h-11 text-sm rounded-sm flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
