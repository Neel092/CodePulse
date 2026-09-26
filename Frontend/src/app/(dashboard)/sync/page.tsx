"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Lock, Code2, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

interface SyncCardProps {
  platform: "leetcode" | "codeforces" | "codechef";
  title: string;
  badgeColor: string;
  defaultHandle?: string;
  description: string;
  endpoint: string;
}

const getRelativeTime = (isoString: string, defaultFallback: string) => {
  if (!isoString) return defaultFallback;

  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;
};

function SyncCard({
  platform,
  title,
  badgeColor,
  defaultHandle = "",
  description,
  endpoint,
}: SyncCardProps) {
  const [handle, setHandle] = useState(defaultHandle);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSync, setLastSync] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (defaultHandle && !handle) {
      setHandle(defaultHandle);
    }
  }, [defaultHandle]);

  useEffect(() => {
    const stored = localStorage.getItem(`lastSync_${platform}`);
    if (stored) setLastSync(stored);
  }, [platform]);

  const defaultDays: Record<string, string> = {
    leetcode: "52 DAYS AGO",
    codeforces: "90 DAYS AGO",
    codechef: "84 DAYS AGO",
  };

  const handleSync = async () => {
    if (!handle || loading) return;

    setLoading(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((p) => (p < 88 ? p + Math.floor(Math.random() * 18 + 5) : p));
    }, 400);

    try {
      const payload =
        platform === "leetcode" ? { username: handle.trim() } : { handle: handle.trim() };

      const { data } = await api.post(endpoint, payload);

      clearInterval(interval);
      setProgress(100);

      const now = new Date().toISOString();
      localStorage.setItem(`lastSync_${platform}`, now);
      setLastSync(now);

      toast.success(
        data.message || `Synchronized ${data.totalFetched || data.created || 0} problems from ${title}`
      );

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 600);
    } catch (err: any) {
      clearInterval(interval);
      toast.error(
        err.response?.data?.message || err.response?.data?.error || `Failed to sync ${title}`
      );
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-[#DDD8CF] dark:hover:border-[#333333] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Top progress bar */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#EAE5DD] dark:bg-[#1C1C1C] overflow-hidden z-20">
          <div
            className="h-full bg-[#A32616] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: `${badgeColor}18`, color: badgeColor }}
            >
              {platform === "codeforces" ? <RefreshCw size={18} /> : <Code2 size={18} />}
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[#181818] dark:text-white tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-[10px] font-mono text-[#777777] uppercase tracking-wider mt-0.5">
                LAST SYNCED: {getRelativeTime(lastSync, defaultDays[platform] || "NEVER")}
              </p>
            </div>
          </div>

          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: badgeColor }}
          />
        </div>

        <p className="text-xs text-[#666666] dark:text-[#8E8E8E] leading-relaxed mt-4">
          {description}
        </p>
      </div>

      <div className="space-y-3 font-mono text-xs pt-2">
        <input
          type="text"
          placeholder={`Enter ${platform} handle...`}
          className="w-full px-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />

        <button
          onClick={handleSync}
          disabled={loading || !handle}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-[#A32616] hover:bg-[#8B2012] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>
            {loading ? `SYNCHRONIZING (${Math.min(100, Math.round(progress))}%)` : "Sync Now"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function SyncPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* HEADER */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#777777] dark:text-[#888888]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A32616] animate-pulse" />
          <span className="text-[#A32616] font-semibold">// INGESTION PIPELINE</span>
          <span>::</span>
          <span className="text-[#888888] dark:text-[#666666]">RFC-954 PROTOCOL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#181818] dark:text-white tracking-tight mt-1">
          Data Ingestion
        </h1>
        <p className="text-xs font-mono text-[#777777] uppercase tracking-wider mt-1">
          Synchronize your conquest from external platforms into the unified ledger.
        </p>
      </div>

      {/* 3 ACTIVE SYNC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SyncCard
          platform="leetcode"
          title="Leetcode"
          badgeColor="#FFA116"
          defaultHandle={(user as any)?.platforms?.leetcode || "Tushar_waghmare12"}
          description="Imports all accepted submissions, heatmap, and profile stats via GraphQL API."
          endpoint="/api/sync/leetcode"
        />

        <SyncCard
          platform="codeforces"
          title="Codeforces"
          badgeColor="#3B82F6"
          defaultHandle={(user as any)?.platforms?.codeforces || "neelpatil092"}
          description="Fetches all AC submissions and your entire rating history."
          endpoint="/api/sync/codeforces"
        />

        <SyncCard
          platform="codechef"
          title="Codechef"
          badgeColor="#EAB308"
          defaultHandle={(user as any)?.platforms?.codechef || "compiler7"}
          description="Fetches all solved problems, star rating, and competition history."
          endpoint="/api/sync/codechef"
        />
      </div>

      {/* COMING SOON SECTION */}
      <div className="space-y-4 pt-4 border-t border-[#E8E4DC] dark:border-[#1C1C1C]">
        <p className="text-[10px] font-mono text-[#888888] dark:text-[#666666] uppercase tracking-widest font-semibold">
          COMING SOON
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "GFG", sub: "GeeksforGeeks API Ingest" },
            { name: "HackerRank", sub: "Skill Matrix Ingest" },
            { name: "AtCoder", sub: "AtCoder Tasks & Kenkoooo" },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-4 flex items-center justify-between opacity-60 cursor-not-allowed select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div>
                <p className="font-serif font-bold text-[#181818] dark:text-white text-sm">{item.name}</p>
                <p className="font-mono text-[10px] text-[#777777] dark:text-[#666666]">{item.sub}</p>
              </div>
              <Lock size={15} className="text-[#888888] dark:text-[#666666]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
