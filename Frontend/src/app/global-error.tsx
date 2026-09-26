"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-[#FAF8F5] text-[#181818] font-sans flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-[#E8E4DC] shadow-xl text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#FDF0EE] border border-[#F8D2CC] text-[#EF3812] flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-xs font-mono text-[#EF3812]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF3812] animate-pulse" />
              <span className="font-bold">// TELEMETRY FAULT</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#181818]">System Exception</h1>
            <p className="text-xs font-mono text-[#777777]">
              An unhandled exception interrupted the telemetry pipeline.
            </p>
          </div>

          {error?.message && (
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#DDD8CF] text-left font-mono text-[11px] text-[#555555] overflow-x-auto max-h-32">
              {error.message}
            </div>
          )}

          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#EF3812] hover:bg-[#D42D0B] text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            <RefreshCw size={14} />
            <span>Reset Telemetry Engine</span>
          </button>
        </div>
      </body>
    </html>
  );
}
