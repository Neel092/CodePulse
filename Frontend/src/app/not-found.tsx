"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#080808] text-[#181818] dark:text-[#E0E0E0] font-sans flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] shadow-xl text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] text-[#EF3812] flex items-center justify-center mx-auto">
          <FileQuestion size={24} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-[#EF3812]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF3812]" />
            <span className="font-bold">// 404 UNMAPPED ROUTE</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#181818] dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs font-mono text-[#777777] dark:text-[#888888]">
            The requested telemetry endpoint does not exist or has been relocated.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#EF3812] hover:bg-[#D42D0B] text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
