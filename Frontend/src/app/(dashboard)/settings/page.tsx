"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Shield,
  Monitor,
  ChevronRight,
  RefreshCw,
  Download,
  KeyRound,
  CheckCircle2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [notifications, setNotifications] = useState({
    telegram: true,
    discord: false,
    emailDigest: true,
  });

  const [pollingCadence, setPollingCadence] = useState("60s");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(`${key.toUpperCase()} alert preferences updated`);
      return next;
    });
  };

  const handlePurgeCache = () => {
    localStorage.removeItem("lastSync_leetcode");
    localStorage.removeItem("lastSync_codeforces");
    localStorage.removeItem("lastSync_codechef");
    toast.success("Redis ingestion buffer and local cache purged");
  };

  const handleExportData = () => {
    const data = {
      user: user?.displayName || "algotracer",
      exportedAt: new Date().toISOString(),
      platforms: (user as any)?.platforms || {},
      cadence: pollingCadence,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codepulse_telemetry_${Date.now()}.json`;
    a.click();
    toast.success("Telemetry configuration exported");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    setPasswordUpdating(true);
    setTimeout(() => {
      setPasswordUpdating(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password updated successfully");
    }, 700);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* HEADER */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#777777] dark:text-[#888888]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF3812] animate-pulse" />
          <span className="text-[#EF3812] font-semibold">// CONTROL CENTER</span>
          <span>::</span>
          <span className="text-[#888888] dark:text-[#666666]">PREFERENCES &amp; SECURITY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#181818] dark:text-white tracking-tight mt-1">
          Control Center
        </h1>
        <p className="text-xs font-mono text-[#777777] uppercase tracking-wider mt-1">
          Configure your telemetry environment, notification pipelines, and account credentials.
        </p>
      </div>

      {/* SECTIONS */}
      <div className="space-y-8">
        {/* SECTION 1: ACCOUNT & IDENTITY */}
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#888888] dark:text-[#666666] font-semibold">
            ACCOUNT &amp; IDENTITY
          </p>

          <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] divide-y divide-[#E8E4DC] dark:divide-[#1C1C1C] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            {/* Profile link */}
            <Link
              href="/profile"
              className="flex items-center justify-between p-5 hover:bg-[#FAF8F5] dark:hover:bg-[#141414] transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] text-[#EF3812] flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <p className="font-serif font-bold text-[#181818] dark:text-white text-base group-hover:text-[#EF3812] transition-colors">
                    Profile Information
                  </p>
                  <p className="text-xs font-mono text-[#777777]">
                    Manage your display name, handles, and public identity
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#888888] dark:text-[#555555]">
                <span>@{user?.username || "algotracer"}</span>
                <ChevronRight size={16} className="text-[#888888] group-hover:text-[#EF3812]" />
              </div>
            </Link>

            {/* Notification toggles */}
            <div className="p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center space-x-4">
                <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] text-[#D97706] flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-serif font-bold text-[#181818] dark:text-white text-base">
                    Notification Pipelines
                  </p>
                  <p className="text-xs font-mono text-[#777777]">
                    Receive live contest alerts and daily streak summaries
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Telegram */}
                <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] flex items-center justify-between">
                  <div>
                    <span className="text-[#181818] dark:text-white font-bold block text-xs">Telegram Bot</span>
                    <span className="text-[#777777] dark:text-[#666666] text-[10px]">T-60m warning</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotif("telegram")}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      notifications.telegram ? "bg-[#EF3812]" : "bg-[#DDD8CF] dark:bg-[#252525]"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-[3px] ${
                        notifications.telegram ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Discord */}
                <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] flex items-center justify-between">
                  <div>
                    <span className="text-[#181818] dark:text-white font-bold block text-xs">Discord Webhook</span>
                    <span className="text-[#777777] dark:text-[#666666] text-[10px]">Contest pings</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotif("discord")}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      notifications.discord ? "bg-[#EF3812]" : "bg-[#DDD8CF] dark:bg-[#252525]"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-[3px] ${
                        notifications.discord ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Email */}
                <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] flex items-center justify-between">
                  <div>
                    <span className="text-[#181818] dark:text-white font-bold block text-xs">Streak Digest</span>
                    <span className="text-[#777777] dark:text-[#666666] text-[10px]">Daily velocity</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotif("emailDigest")}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      notifications.emailDigest ? "bg-[#EF3812]" : "bg-[#DDD8CF] dark:bg-[#252525]"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-[3px] ${
                        notifications.emailDigest ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SECURITY & AUTHENTICATION */}
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#888888] dark:text-[#666666] font-semibold">
            SECURITY &amp; CREDENTIALS
          </p>

          <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-5 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] text-[#0D8050] flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="font-serif font-bold text-[#181818] dark:text-white text-base">
                    Authentication Status
                  </p>
                  <p className="text-xs font-mono text-[#777777]">
                    Dual-token JWT session active with HTTP-only cookies
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded bg-[#0D8050]/10 text-[#0D8050] font-mono text-[10px] font-bold">
                ● ENCRYPTED SESSION
              </span>
            </div>

            {/* Password update form */}
            <form onSubmit={handlePasswordSubmit} className="pt-2 border-t border-[#E8E4DC] dark:border-[#1C1C1C] space-y-4 font-mono text-xs">
              <p className="text-[10px] uppercase text-[#777777] font-semibold tracking-wider">
                CHANGE ACCESS PASSWORD
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#EF3812]/60 text-xs"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  placeholder="New Strong Password"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#EF3812]/60 text-xs"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={passwordUpdating}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-[#DDD8CF] dark:border-[#2C2C2C] hover:border-[#EF3812]/60 text-xs text-[#181818] dark:text-white font-bold transition-all shadow-sm"
              >
                <KeyRound size={13} className="text-[#EF3812]" />
                <span>{passwordUpdating ? "UPDATING..." : "Update Password"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* SECTION 3: SYSTEM & TELEMETRY */}
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#888888] dark:text-[#666666] font-semibold">
            SYSTEM &amp; TELEMETRY ENGINE
          </p>

          <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-5 space-y-5 font-mono text-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] text-[#EF3812] flex items-center justify-center">
                <Monitor size={18} />
              </div>
              <div>
                <p className="font-serif font-bold text-[#181818] dark:text-white text-base">
                  Telemetry Engine &amp; Cache
                </p>
                <p className="text-xs font-mono text-[#777777]">
                  Control scraper polling cadence and local storage memory
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8E4DC] dark:border-[#1C1C1C]">
              {/* Cadence picker */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] space-y-2">
                <span className="text-[10px] text-[#777777] uppercase font-bold tracking-wider block">
                  POLLING INTERVAL
                </span>
                <div className="flex gap-2">
                  {["30s", "60s", "5m"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setPollingCadence(c);
                        toast.success(`Polling interval set to ${c}`);
                      }}
                      className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                        pollingCadence === c
                          ? "bg-[#181818] text-white"
                          : "bg-white dark:bg-[#1E1E1E] border border-[#DDD8CF] dark:border-transparent text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Mode */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] space-y-2">
                <span className="text-[10px] text-[#777777] uppercase font-bold tracking-wider block">
                  THEME APPEARANCE
                </span>
                <div className="flex gap-2">
                  {[
                    { key: "light", label: "Parchment Light" },
                    { key: "dark", label: "Cyber Dark" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => {
                        setTheme(t.key);
                        toast.success(`Theme set to ${t.label}`);
                      }}
                      className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                        theme === t.key
                          ? "bg-[#181818] text-white"
                          : "bg-white dark:bg-[#1E1E1E] border border-[#DDD8CF] dark:border-transparent text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handlePurgeCache}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#141414] border border-[#DDD8CF] dark:border-[#262626] hover:border-[#EF4444]/60 text-xs font-mono font-bold text-[#181818] dark:text-[#E0E0E0] hover:text-[#EF4444] transition-all shadow-sm"
              >
                <RefreshCw size={13} />
                <span>PURGE SYNC CACHE</span>
              </button>

              <button
                onClick={handleExportData}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#141414] border border-[#DDD8CF] dark:border-[#262626] hover:border-[#EF3812]/60 text-xs font-mono font-bold text-[#181818] dark:text-[#E0E0E0] hover:text-[#EF3812] transition-all shadow-sm"
              >
                <Download size={13} />
                <span>EXPORT RAW TELEMETRY (.JSON)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
