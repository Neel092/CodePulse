"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Bell,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Radio,
  Share2,
  Check,
} from "lucide-react";
import { useContests, Contest } from "@/hooks/useContests";

export default function GlobalContestRadarPage() {
  const { contests: liveContests } = useContests();
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [currentMonth, setCurrentMonth] = useState("October 2024");
  const [alertSet, setAlertSet] = useState<Record<string, boolean>>({
    lc128: true,
  });

  // Countdown timers tick
  const [chrono, setChrono] = useState({
    lc: { h: 4, m: 18, s: 22 },
    cf: { h: 22, m: 45, s: 0 },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setChrono((prev) => {
        let newLcS = prev.lc.s - 1;
        let newLcM = prev.lc.m;
        let newLcH = prev.lc.h;
        if (newLcS < 0) {
          newLcS = 59;
          newLcM -= 1;
        }
        if (newLcM < 0) {
          newLcM = 59;
          newLcH -= 1;
        }

        let newCfS = prev.cf.s - 1;
        let newCfM = prev.cf.m;
        let newCfH = prev.cf.h;
        if (newCfS < 0) {
          newCfS = 59;
          newCfM -= 1;
        }
        if (newCfM < 0) {
          newCfM = 59;
          newCfH -= 1;
        }

        return {
          lc: { h: Math.max(0, newLcH), m: Math.max(0, newLcM), s: Math.max(0, newLcS) },
          cf: { h: Math.max(0, newCfH), m: Math.max(0, newCfM), s: Math.max(0, newCfS) },
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const toggleAlert = (id: string) => {
    setAlertSet((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  interface CalendarItem {
    label: string;
    color: string;
    isOrangePill?: boolean;
    isRatedEntry?: boolean;
  }

  interface CalendarDay {
    day: number;
    current: boolean;
    isToday?: boolean;
    hasCheck?: boolean;
    items: CalendarItem[];
  }

  // Calendar cells definition matching Image 2
  // Days of week: MON, TUE, WED, THU, FRI, SAT, SUN
  const calendarDays: CalendarDay[] = [
    // Row 1
    { day: 30, current: false, items: [] },
    { day: 1, current: true, items: [] },
    { day: 2, current: true, items: [{ label: "CC Sta..", color: "#EAB308" }] },
    { day: 3, current: true, items: [] },
    { day: 4, current: true, items: [] },
    { day: 5, current: true, items: [{ label: "ABC 348", color: "#2DD4BF" }] },
    { day: 6, current: true, items: [{ label: "LC Wee..", color: "#FFA116" }] },

    // Row 2
    { day: 7, current: true, items: [] },
    { day: 8, current: true, items: [] },
    { day: 9, current: true, items: [{ label: "CC Sta..", color: "#EAB308" }] },
    { day: 10, current: true, items: [] },
    { day: 11, current: true, items: [] },
    { day: 12, current: true, items: [{ label: "CF Div..", color: "#3B82F6" }] },
    {
      day: 13,
      current: true,
      hasCheck: true,
      items: [{ label: "RANK #412 +94 Rat..", color: "#10B981", isRatedEntry: true }],
    },

    // Row 3
    { day: 14, current: true, items: [] },
    { day: 15, current: true, items: [] },
    { day: 16, current: true, items: [{ label: "CC Sta..", color: "#EAB308" }] },
    { day: 17, current: true, items: [] },
    { day: 18, current: true, items: [] },
    {
      day: 19,
      current: true,
      isToday: true,
      items: [
        { label: "LC Biw..", color: "#FF4D1C", isOrangePill: true },
        { label: "ABC 349", color: "#2DD4BF" },
      ],
    },
    {
      day: 20,
      current: true,
      items: [
        { label: "CF Rd..", color: "#3B82F6" },
        { label: "LC Wee..", color: "#FFA116" },
      ],
    },

    // Row 4
    { day: 21, current: true, items: [{ label: "AtCode..", color: "#2DD4BF" }] },
    { day: 22, current: true, items: [] },
    { day: 23, current: true, items: [{ label: "CC Sta..", color: "#EAB308" }] },
    { day: 24, current: true, items: [] },
    { day: 25, current: true, items: [] },
    { day: 26, current: true, items: [{ label: "LC Biw..", color: "#FFA116" }] },
    { day: 27, current: true, items: [{ label: "CF Div..", color: "#3B82F6" }] },

    // Row 5
    { day: 28, current: true, items: [] },
    { day: 29, current: true, items: [] },
    { day: 30, current: true, items: [{ label: "CC Sta..", color: "#EAB308" }] },
    { day: 31, current: true, items: [] },
    { day: 1, current: false, items: [] },
    { day: 2, current: false, items: [] },
    { day: 3, current: false, items: [] },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-gray-500 dark:text-[#888888]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
            <span className="text-[#FF4D1C] font-semibold">
              RADAR MATRIX // TELEMETRY LINKED
            </span>
            <span>::</span>
            <span className="text-gray-400 dark:text-[#666666]">FEED VERIFIED 4m AGO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-black dark:text-white tracking-tight mt-1">
            Global Contest Radar
          </h1>
          <div className="flex items-center space-x-2 text-xs font-mono text-gray-500 dark:text-[#777777] mt-1">
            <span>// SYNCHRONIZED CALENDAR ACROSS 4 PLATFORMS</span>
            <span>•</span>
            <span>TIMEZONE:</span>
            <span className="text-black dark:text-white px-2 py-0.5 rounded bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#222222]">
              UTC+00:00
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#242424] hover:bg-gray-100 dark:bg-[#1C1C1C] text-xs font-mono font-medium text-gray-900 dark:text-[#E0E0E0] transition-colors">
            <CalendarIcon size={13} className="text-gray-500 dark:text-[#888888]" />
            <span>Subscribe to .ics</span>
            <span className="text-[10px] text-gray-400 dark:text-[#555555] px-1 bg-gray-100 dark:bg-[#1A1A1A] rounded">
              RFC-5545
            </span>
          </button>

          <button className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#FF4D1C] hover:bg-[#FF6236] text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-sm">
            <RefreshCw size={13} />
            <span>Google Calendar Sync ↗</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: CALENDAR SECTION (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] p-6 space-y-6">
            {/* Filter Pills & Month Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setPlatformFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    platformFilter === "ALL"
                      ? "bg-[#181818] text-white font-bold"
                      : "bg-[#EDE9E1] hover:bg-[#E2DDD3] text-[#333333] dark:bg-[#161616] dark:text-[#888888]"
                  }`}
                >
                  All Platforms (4)
                </button>
                <button
                  onClick={() => setPlatformFilter("LEETCODE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    platformFilter === "LEETCODE"
                      ? "bg-[#181818] text-white font-bold"
                      : "bg-[#FEF2E8] border border-[#FDDBC6] text-[#C05621] hover:bg-[#FDE2CF]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFA116]" />
                  <span>LeetCode</span>
                </button>
                <button
                  onClick={() => setPlatformFilter("CODEFORCES")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    platformFilter === "CODEFORCES"
                      ? "bg-[#181818] text-white font-bold"
                      : "bg-[#EBF3FE] border border-[#D3E3FD] text-[#1D63D8] hover:bg-[#DCEBFE]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span>Codeforces</span>
                </button>
                <button
                  onClick={() => setPlatformFilter("ATCODER")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    platformFilter === "ATCODER"
                      ? "bg-[#181818] text-white font-bold"
                      : "bg-[#E6F8F9] border border-[#C5F0F3] text-[#0E7490] hover:bg-[#D4F3F5]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  <span>AtCoder</span>
                </button>
                <button
                  onClick={() => setPlatformFilter("CODECHEF")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    platformFilter === "CODECHEF"
                      ? "bg-[#181818] text-white font-bold"
                      : "bg-[#FEF7E6] border border-[#FEEAC1] text-[#B7791F] hover:bg-[#FDE7B8]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                  <span>CodeChef</span>
                </button>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-serif italic font-bold text-[#181818] dark:text-white">
                  October 2024
                </span>
                <div className="flex items-center space-x-1 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#222222] rounded-lg p-0.5 text-xs font-mono">
                  <button
                    aria-label="Previous month"
                    className="p-1 rounded hover:bg-[#EDE9E1] dark:hover:bg-[#202020] text-[#777777] hover:text-[#181818] dark:hover:text-white"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button className="px-2 py-0.5 text-[11px] font-bold text-[#181818] dark:text-[#E0E0E0] hover:text-black dark:hover:text-white">
                    TODAY
                  </button>
                  <button
                    aria-label="Next month"
                    className="p-1 rounded hover:bg-[#EDE9E1] dark:hover:bg-[#202020] text-[#777777] hover:text-[#181818] dark:hover:text-white"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-header Legend */}
            <div className="flex items-center justify-between text-[11px] font-mono border-t border-[#EFECE6] dark:border-[#1C1C1C] pt-3">
              <div className="flex items-center space-x-2 text-[#777777]">
                <span>// MONTH OVERVIEW</span>
                <span>•</span>
                <span className="text-[#0D8050] font-bold">
                  23 Contests Active
                </span>
              </div>
              <div className="flex items-center space-x-4 text-[#777777] dark:text-[#888888]">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-[2px] bg-[#0D8050]" />
                  <span>Rated Entry</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full border border-[#0D8050] text-[#0D8050] flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </span>
                  <span>Solved / Rated</span>
                </span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="rounded-lg border border-[#E8E4DC] dark:border-[#202020] overflow-hidden bg-white dark:bg-[#0D0D0D] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              {/* Day column headers */}
              <div className="grid grid-cols-7 border-b border-[#E8E4DC] dark:border-[#202020] bg-[#FAF8F5] dark:bg-[#141414] text-center text-[10px] font-mono uppercase tracking-wider text-[#777777] dark:text-[#666666] py-2 font-semibold">
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
                <div>SUN</div>
              </div>

              {/* 35 Calendar Cells */}
              <div className="grid grid-cols-7 divide-x divide-y divide-[#EFECE6] dark:divide-[#1C1C1C] bg-white dark:bg-[#0E0E0E]">
                {calendarDays.map((cell, i) => (
                  <div
                    key={i}
                    className={`min-h-[86px] p-2 flex flex-col justify-between transition-colors ${
                      !cell.current ? "bg-[#FAF8F5] dark:bg-[#0A0A0A] text-[#999999] dark:text-[#444444]" : "text-[#181818] dark:text-[#A0A0A0]"
                    } ${
                      cell.isToday
                        ? "bg-[#FDF0EE] dark:bg-[#141414] ring-1 ring-[#A32616]/60"
                        : "hover:bg-[#FAF8F5] dark:hover:bg-[#131313]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span
                        className={
                          cell.isToday
                            ? "text-[#A32616] font-bold"
                            : cell.current
                            ? "text-[#555555] dark:text-[#888888] font-semibold"
                            : "text-[#999999] dark:text-[#444444]"
                        }
                      >
                        {cell.day.toString().padStart(2, "0")}
                      </span>

                      {cell.isToday && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#A32616] text-white uppercase">
                          TODAY
                        </span>
                      )}

                      {cell.hasCheck && (
                        <span className="text-[#0D8050]">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    {/* Cell contest labels */}
                    <div className="space-y-1 mt-1">
                      {cell.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`text-[9px] font-mono px-1 py-0.5 rounded truncate ${
                            item.isOrangePill
                              ? "bg-[#A32616] text-white font-bold"
                              : item.isRatedEntry
                              ? "bg-[#EAF7EE] text-[#0D8050] font-bold border border-[#CEEAD6]"
                              : "bg-[#FAF8F5] dark:bg-[#161616] border border-[#E8E4DC] dark:border-[#222222] text-[#333333] dark:text-[#CCCCCC]"
                          }`}
                        >
                          <span
                            className="inline-block w-1 h-1 rounded-full mr-1"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM 3 METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: 30D Participation */}
            <div className="rounded-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] p-5 space-y-2">
              <p className="text-[10px] font-mono text-gray-500 dark:text-[#777777] uppercase font-semibold">
                30D PARTICIPATION
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-serif font-bold text-black dark:text-white">8</span>
                <span className="text-lg font-serif text-black dark:text-white">Contests</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#10B981]">
                <span>100% ~ submission rate</span>
                {/* Mini SVG Sparkline */}
                <svg className="w-12 h-4" viewBox="0 0 50 15">
                  <path
                    d="M 0,12 L 10,8 L 20,10 L 30,4 L 40,7 L 50,2"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Card 2: Avg ELO Swing */}
            <div className="rounded-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] p-5 space-y-2">
              <p className="text-[10px] font-mono text-gray-500 dark:text-[#777777] uppercase font-semibold">
                AVG ELO SWING
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-serif font-bold text-[#EAB308]">
                  +38.4
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 dark:text-[#888888]">
                <span>σ = 14.2 / round</span>
                {/* Mini SVG Sparkline */}
                <svg className="w-12 h-4" viewBox="0 0 50 15">
                  <path
                    d="M 0,10 L 12,12 L 25,6 L 38,9 L 50,3"
                    fill="none"
                    stroke="#EAB308"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Card 3: Radar Reliability */}
            <div className="rounded-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] p-5 space-y-2">
              <p className="text-[10px] font-mono text-gray-500 dark:text-[#777777] uppercase font-semibold">
                RADAR RELIABILITY
              </p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-bold text-black dark:text-white">
                  99.98%
                </span>
                <span className="p-1.5 rounded-md bg-[#10B981]/10 text-[#10B981]">
                  <Radio size={16} className="animate-pulse" />
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#10B981] font-semibold">
                HEARTBEAT OK
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: UPCOMING RADAR (4 Cols on Desktop) */}
        <div className="lg:col-span-4 rounded-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] p-6 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-black dark:text-white font-bold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C]" />
              <span>UPCOMING RADAR</span>
            </span>
            <span className="text-gray-500 dark:text-[#888888] text-[10px] bg-gray-50 dark:bg-[#161616] px-2 py-0.5 rounded">
              LIVE CHRONO
            </span>
          </div>

          {/* 4 Contest Cards */}
          <div className="space-y-3.5">
            {/* Card 1: LeetCode */}
            <div className="rounded-xl bg-[#151515] border border-gray-200 dark:border-[#262626] p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="flex items-center space-x-1.5 text-[#FFA116] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFA116]" />
                  <span>LEETCODE // BIWEEKLY</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FF4D1C] text-black font-bold">
                  T - {pad(chrono.lc.h)}:{pad(chrono.lc.m)}:{pad(chrono.lc.s)}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-serif font-bold text-black dark:text-white">
                  Biweekly Contest 128
                </h4>
                <div className="flex items-center space-x-1 text-xs font-mono text-gray-500 dark:text-[#888888] mt-1">
                  <Clock size={12} className="text-gray-400 dark:text-[#666666]" />
                  <span>Sat, Oct 19 • 14:30 UTC • 90m</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-bold text-[10px]">
                  Rated for all users
                </span>
                <button
                  onClick={() => toggleAlert("lc128")}
                  className="inline-flex items-center space-x-1 text-[#FF4D1C] hover:underline font-bold"
                >
                  <Bell size={12} />
                  <span>{alertSet.lc128 ? "Alert Set" : "Notify"}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Codeforces */}
            <div className="rounded-xl bg-[#151515] border border-gray-200 dark:border-[#262626] p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="flex items-center space-x-1.5 text-[#3B82F6] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span>CODEFORCES // ROUND</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#F59E0B] text-black font-bold">
                  T - {pad(chrono.cf.h)}:{pad(chrono.cf.m)}:{pad(chrono.cf.s)}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-serif font-bold text-black dark:text-white">
                  Round 950 (Div. 2)
                </h4>
                <div className="flex items-center space-x-1 text-xs font-mono text-gray-500 dark:text-[#888888] mt-1">
                  <Clock size={12} className="text-gray-400 dark:text-[#666666]" />
                  <span>Sun, Oct 20 • 17:35 UTC • 120m</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <span className="text-gray-500 dark:text-[#777777] text-[10px]">
                  Rating ≤ 2100 • 6 problems
                </span>
                <button
                  onClick={() => toggleAlert("cf950")}
                  className="inline-flex items-center space-x-1 text-gray-500 dark:text-[#888888] hover:text-[#FF4D1C] font-semibold"
                >
                  <Bell size={12} />
                  <span>{alertSet.cf950 ? "Alert Set" : "Notify"}</span>
                </button>
              </div>
            </div>

            {/* Card 3: AtCoder */}
            <div className="rounded-xl bg-[#151515] border border-gray-200 dark:border-[#262626] p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="flex items-center space-x-1.5 text-[#2DD4BF] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  <span>ATCODER // ABC</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#222222] text-[#A0A0A0] font-bold">
                  IN 2 DAYS
                </span>
              </div>

              <div>
                <h4 className="text-lg font-serif font-bold text-black dark:text-white">
                  Beginner Contest 350
                </h4>
                <div className="flex items-center space-x-1 text-xs font-mono text-gray-500 dark:text-[#888888] mt-1">
                  <Clock size={12} className="text-gray-400 dark:text-[#666666]" />
                  <span>Mon, Oct 21 • 12:00 UTC • 100m</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <span className="text-gray-500 dark:text-[#777777] text-[10px]">
                  0-1999 • JP / EN text
                </span>
                <button
                  onClick={() => toggleAlert("atc350")}
                  className="inline-flex items-center space-x-1 text-gray-500 dark:text-[#888888] hover:text-[#FF4D1C] font-semibold"
                >
                  <Bell size={12} />
                  <span>{alertSet.atc350 ? "Alert Set" : "Notify"}</span>
                </button>
              </div>
            </div>

            {/* Card 4: CodeChef */}
            <div className="rounded-xl bg-[#151515] border border-gray-200 dark:border-[#262626] p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="flex items-center space-x-1.5 text-[#EAB308] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                  <span>CODECHEF // STARTERS</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#222222] text-[#A0A0A0] font-bold">
                  IN 4 DAYS
                </span>
              </div>

              <div>
                <h4 className="text-lg font-serif font-bold text-black dark:text-white">
                  Starters 130
                </h4>
                <div className="flex items-center space-x-1 text-xs font-mono text-gray-500 dark:text-[#888888] mt-1">
                  <Clock size={12} className="text-gray-400 dark:text-[#666666]" />
                  <span>Wed, Oct 23 • 14:30 UTC • 120m</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <span className="text-gray-500 dark:text-[#777777] text-[10px]">
                  Div 1, 2, 3, 4 rated
                </span>
                <button
                  onClick={() => toggleAlert("cc130")}
                  className="inline-flex items-center space-x-1 text-gray-500 dark:text-[#888888] hover:text-[#FF4D1C] font-semibold"
                >
                  <Bell size={12} />
                  <span>{alertSet.cc130 ? "Alert Set" : "Notify"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Timezone Tool & Webhook Alert Box */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#242424] space-y-3 font-mono text-xs">
            <p className="text-[10px] text-[#777777] uppercase tracking-wider font-semibold">
              SYNC WITH LOCAL TIMEZONE
            </p>
            <select className="w-full p-2 rounded-lg bg-white dark:bg-[#0E0E0E] border border-[#DDD8CF] dark:border-[#222222] text-[#181818] dark:text-[#E0E0E0] text-xs focus:outline-none focus:border-[#A32616]/60">
              <option>UTC+00:00 (Universal Standard Time)</option>
              <option>Asia/Kolkata (UTC+05:30 IST)</option>
              <option>America/New_York (UTC-05:00 EST)</option>
              <option>Europe/London (UTC+01:00 BST)</option>
            </select>

            <button className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-white dark:bg-[#1A1A1A] border border-[#DDD8CF] dark:border-[#333333] hover:border-[#A32616]/50 text-[#181818] dark:text-white font-bold text-[11px] transition-all shadow-sm">
              <Share2 size={13} className="text-[#A32616]" />
              <span>Set Alert (Telegram / Discord Webhook)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
