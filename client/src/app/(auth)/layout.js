"use client";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-black/20">
      <nav
        className="pt-4 pl-4 text-2xl font-bold text-white cursor-pointer hover:drop-shadow-[0_0_10px_rgba(147,51,234,0.5)] transition-all"
        onClick={() => router.push("/")}
      >
        DevForge
      </nav>

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/35 text-white p-8 rounded-2xl w-full max-w-md backdrop-blur-lg border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          {children}
        </div>
      </div>
    </div>
  );
}
