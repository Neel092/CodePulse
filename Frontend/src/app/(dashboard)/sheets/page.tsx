"use client";

import React from "react";
import { BookOpen, CheckCircle2, Lock, Play, Layers } from "lucide-react";
import Link from "next/link";

export default function SheetsPage() {
  const sheets = [
    {
      title: "Blind 75",
      subtitle: "Foundational patterns curated for high-velocity interviews",
      progress: 45,
      total: 75,
      status: "ACTIVE INGEST",
      color: "#FF4D1C",
    },
    {
      title: "Striver SDE Sheet",
      subtitle: "Comprehensive 180-node algorithmic interview monograph",
      progress: 120,
      total: 180,
      status: "IN PROGRESS",
      color: "#10B981",
    },
    {
      title: "NeetCode 150",
      subtitle: "Extensive categorical tree spanning all core CS paradigms",
      progress: 0,
      total: 150,
      status: "LOCKED",
      color: "#F59E0B",
      locked: true,
    },
    {
      title: "Love Babbar 450",
      subtitle: "Full-spectrum competitive data structures & algorithms catalog",
      progress: 450,
      total: 450,
      status: "COMPLETED",
      color: "#3B82F6",
      completed: true,
    },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* HEADER */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-gray-500 dark:text-[#888888]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
          <span className="text-[#FF4D1C] font-semibold">// CURATED REPOSITORIES</span>
          <span>::</span>
          <span className="text-gray-400 dark:text-[#666666]">SYSTEMATIC PROBLEM SHEETS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-black dark:text-white tracking-tight mt-1">
          Curated Sheets
        </h1>
        <p className="text-xs font-mono text-gray-500 dark:text-[#777777] uppercase tracking-wider mt-1">
          Master specific domains with community-vetted problem sets and algorithmic tracks.
        </p>
      </div>

      {/* 4 SHEET CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sheets.map((sheet) => {
          const percent = Math.round((sheet.progress / sheet.total) * 100);
          const accentColor = sheet.color === "#FF4D1C" ? "#A32616" : sheet.color;
          return (
            <div
              key={sheet.title}
              className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 space-y-5 hover:border-[#DDD8CF] dark:hover:border-[#333333] transition-all relative overflow-hidden group shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  >
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#181818] dark:text-white tracking-tight">
                      {sheet.title}
                    </h3>
                    <p className="text-[10px] font-mono text-[#777777] dark:text-[#777777] mt-0.5">
                      {sheet.subtitle}
                    </p>
                  </div>
                </div>

                {sheet.locked ? (
                  <span className="p-1 rounded bg-[#FAF8F5] dark:bg-[#181818] border border-[#DDD8CF] dark:border-transparent text-[#777777] dark:text-[#666666]">
                    <Lock size={14} />
                  </span>
                ) : sheet.completed ? (
                  <span className="px-2 py-0.5 rounded bg-[#0D8050]/10 text-[#0D8050] font-mono text-[10px] font-bold">
                    COMPLETED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#A32616]/10 text-[#A32616] font-mono text-[10px] font-bold">
                    {sheet.status}
                  </span>
                )}
              </div>

              {/* Progress metric */}
              <div className="space-y-2 pt-2 font-mono text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#666666] dark:text-[#888888] text-[11px]">
                    {sheet.progress} of {sheet.total} problems solved
                  </span>
                  <span className="font-bold text-[#181818] dark:text-white text-sm">{percent}%</span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-[#EAE5DD] dark:bg-[#1C1C1C] overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
              </div>

              {/* Card footer */}
              <div className="pt-2 border-t border-[#E8E4DC] dark:border-[#1C1C1C] flex items-center justify-between font-mono text-xs">
                <Link
                  href="/problems"
                  className="inline-flex items-center space-x-1.5 text-[#666666] dark:text-[#888888] hover:text-[#A32616] transition-colors"
                >
                  <Play size={12} className="text-[#A32616]" />
                  <span className="text-[11px] font-bold">OPEN IN PROBLEM LEDGER</span>
                </Link>

                <span className="text-[10px] text-[#888888] dark:text-[#555555]">
                  {sheet.total - sheet.progress} REMAINING
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
