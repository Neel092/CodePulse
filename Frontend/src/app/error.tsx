"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] shadow-xl text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#FDF0EE] dark:bg-[#201515] border border-[#F8D2CC] dark:border-transparent text-[#EF3812] flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-[#EF3812]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF3812] animate-pulse" />
            <span className="font-bold">// ROUTE SEGMENT EXCEPTION</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#181818] dark:text-white">
            Segment Telemetry Disrupted
          </h1>
          <p className="text-xs font-mono text-[#777777] dark:text-[#888888]">
            An unexpected error occurred while rendering this view.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] text-left font-mono text-[11px] text-[#555555] dark:text-[#AAA] overflow-x-auto max-h-32">
            {error.message}
          </div>
        )}

        <button
          onClick={() => reset()}
          className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#EF3812] hover:bg-[#D42D0B] text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
        >
          <RefreshCw size={14} />
          <span>RETRY LOAD</span>
        </button>
      </div>
    </div>
  );
}
