"use client";

import React, { useState, useEffect } from "react";
import { RefreshCcw, Lock, Code } from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

interface SyncCardProps {
  platform: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  endpoint: string;
}

const getRelativeTime = (isoString: string) => {
  if (!isoString) return "never";

  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minutes ago`;

  const hrs = Math.floor(mins / 60);

  if (hrs < 24) return `${hrs} hours ago`;

  return `${Math.floor(hrs / 24)} days ago`;
};

function SyncCard({
  platform,
  icon,
  color,
  description,
  endpoint,
}: SyncCardProps) {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSync, setLastSync] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(`lastSync_${platform}`);
    if (stored) setLastSync(stored);
  }, [platform]);

  const handleSync = async () => {
    if (!handle || loading) return;

    setLoading(true);
    setProgress(0);

    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 15 : p));
    }, 400);

    try {
      const payload =
        platform === "leetcode"
          ? { username: handle }
          : { handle };

      const { data } = await api.post(endpoint, payload);

      clearInterval(interval);
      setProgress(100);

      const now = new Date().toISOString();

      localStorage.setItem(`lastSync_${platform}`, now);
      setLastSync(now);

      toast.success(
        data.message ||
        `Successfully synced ${data.totalFetched || 0} problems`
      );

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    } catch (err: any) {
      clearInterval(interval);

      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Sync failed"
      );

      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col space-y-6 relative overflow-hidden hover:-translate-y-1 transition-transform duration-200">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-elevated-dark z-0">
          <div
            className="h-full bg-primary-dark transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-center space-x-4 relative z-10">
        <div className={cn("p-3 rounded-xl bg-elevated-dark", color)}>
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-display font-bold capitalize">
            {platform}
          </h3>

          <p className="text-xs text-muted-dark font-mono uppercase font-bold tracking-widest">
            Last synced: {getRelativeTime(lastSync)}
          </p>
        </div>
      </div>

      <p className="text-muted-dark text-sm leading-relaxed relative z-10">
        {description}
      </p>

      <div className="space-y-4 relative z-10">
        <input
          type="text"
          placeholder={`Enter ${platform} handle...`}
          className="w-full px-4 py-3 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark transition-all text-sm font-mono"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />

        <button
          onClick={handleSync}
          disabled={loading || !handle}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-primary-dark text-background-dark font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <RefreshCcw
            size={18}
            className={loading ? "animate-spin" : ""}
          />

          <span>
            {loading
              ? `Synchronizing (${Math.round(progress)}%)`
              : "Sync Now"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function SyncPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-display font-bold text-heading-dark">
          Data Ingestion
        </h1>

        <p className="text-muted-dark font-medium">
          Synchronize your conquest from external platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SyncCard
          platform="leetcode"
          icon={<Code size={24} />}
          color="text-[#FFA116]"
          description="Imports all accepted submissions, heatmap, and profile stats via GraphQL API."
          endpoint="/api/sync/leetcode"
        />

        <SyncCard
          platform="codeforces"
          icon={<RefreshCcw size={24} />}
          color="text-info-dark"
          description="Fetches all AC submissions and your entire rating history."
          endpoint="/api/sync/codeforces"
        />

        <SyncCard
          platform="codechef"
          icon={<Code size={24} />}
          color="text-[#5B4638]"
          description="Fetches all solved problems, star rating, and competition history."
          endpoint="/api/sync/codechef"
        />
      </div>

      <div className="pt-8">
        <h3 className="text-sm font-bold text-muted-dark uppercase tracking-widest mb-4">
          Coming Soon
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 grayscale">
          {["GFG", "HackerRank", "AtCoder"].map((plat) => (
            <div
              key={plat}
              className="p-4 bg-surface-dark border border-border-dark rounded-xl flex items-center justify-between cursor-not-allowed"
            >
              <span className="text-sm font-bold">{plat}</span>
              <Lock size={14} className="text-muted-dark" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}