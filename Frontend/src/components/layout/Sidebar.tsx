"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  Timer,
  FileSpreadsheet,
  RefreshCw,
  User,
  SlidersHorizontal,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Problems", href: "/problems", icon: Code2 },
  { name: "Contests", href: "/contests", icon: Timer },
  { name: "Sheets", href: "/sheets", icon: FileSpreadsheet },
  { name: "Sync", href: "/sync", icon: RefreshCw },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: SlidersHorizontal },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleDisplay = user?.displayName || "algotracer";
  const userRank = "Grandmaster";
  const streak = "42d";

  return (
    <aside className="w-[240px] flex flex-col h-screen bg-[#FAF8F5] dark:bg-[#0A0A0A] border-r border-[#E8E4DC] dark:border-white/[0.06] select-none shrink-0 z-40">
      {/* Brand Header */}
      <div className="p-5 pb-4">
        <Link href="/dashboard" className="flex items-center space-x-1.5 group">
          <span className="font-mono text-xs font-semibold text-[#888888]">
            [CP:^]
          </span>
          <span className="font-serif font-bold text-lg text-[#181818] dark:text-white tracking-tight">
            CodePulse
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF3812] ml-0.5 inline-block" />
        </Link>

        {/* Sync Operational Badge */}
        <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#ECF7F0] dark:bg-[#141414] border border-[#CEEAD6] dark:border-white/[0.06] text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D8050] dark:bg-[#10B981] animate-pulse" />
          <span className="tracking-wider uppercase text-[#0D8050] dark:text-[#10B981] font-semibold text-[9px]">
            SYNC OPERATIONAL
          </span>
        </div>
      </div>

      {/* Navigation Label */}
      <div className="px-5 pt-4 pb-1.5">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#777777] dark:text-[#525252] font-semibold">
          NAVIGATION
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-3.5 py-2.5 rounded-lg text-xs transition-all duration-200 group active:scale-[0.98]",
                  active
                    ? "bg-[#EF3812] text-white font-semibold shadow-sm"
                    : "text-[#4B5563] dark:text-[#8E8E8E] hover:text-[#181818] dark:hover:text-white hover:bg-[#EFECE6] dark:hover:bg-white/[0.04] font-medium"
                )}
              >
                <item.icon
                  size={16}
                  className={cn(
                    "mr-3 shrink-0 transition-colors",
                    active ? "text-white" : "text-[#6B7280] dark:text-[#757575] group-hover:text-black dark:group-hover:text-white"
                  )}
                />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Info Card */}
      <div className="p-3.5 m-3 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-[#181818] dark:text-white font-mono leading-tight">
              @{handleDisplay}
            </p>
            <p className="text-[11px] font-mono text-[#0D8050] dark:text-[#2DD4BF] font-semibold mt-0.5">
              {userRank}
            </p>
          </div>
          <div className="flex items-center space-x-1 font-mono text-xs px-1.5 py-0.5 rounded bg-[#FDF0EE] dark:bg-[#201515] border border-[#F8D2CC] dark:border-transparent text-[#C23C2C] font-semibold">
            <span>{streak}</span>
            <span className="text-xs">🔥</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#EFECE6] dark:border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#666666] dark:text-[#5A5A5A]">
          <div className="flex items-center space-x-1.5">
            <span className="tracking-wider">STATUS</span>
            <span className="text-[#333333] dark:text-[#888888] font-semibold">ONLINE :: CF #892</span>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="text-gray-400 dark:text-[#666666] hover:text-[#A32616] transition-colors p-0.5 active:scale-90"
          >
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </aside>
  );
}
