"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import {
  Download,
  Plus,
  Flame,
  ArrowRight,
  Calendar,
  Clock,
  Bell,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import AddProblemModal from "@/components/problems/AddProblemModal";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/api/progress/dashboard");
        setDashboard(data);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Trajectory Chart Mock / Live Data
  const trajectoryData = [
    { label: "Q2 '23", lc: 1420, cf: 1380 },
    { label: "Q3 '23", lc: 1680, cf: 1540 },
    { label: "Q4 '23", lc: 1910, cf: 1680 },
    { label: "Q1 '24", lc: 2050, cf: 1720 },
    { label: "Current", lc: 2189, cf: 1748 },
  ];

  // Heuristics donut data
  const donutData = [
    { name: "Accepted", value: 84.6, color: "#10B981" },
    { name: "Runtime Margin", value: 10.4, color: "#F59E0B" },
    { name: "Unsolved", value: 5.0, color: "#EF4444" },
  ];

  // 53-Week LeetCode-style Submissions Density Heatmap
  const { heatmapWeeks, monthPositions, totalSubmissionsCount } = React.useMemo(() => {
    const today = new Date();
    const days: Array<{ dateStr: string; count: number; dayOfWeek: number; month: number }> = [];

    // 53 weeks * 7 days = 371 days
    const totalDays = 53 * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);

    let totalSubs = 0;
    const userHeatmap = dashboard?.heatmap || {};

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      
      let count = userHeatmap[dateStr] || 0;
      // If no real submissions yet, provide realistic mock activity reflecting the 42-day active streak
      if (Object.keys(userHeatmap).length === 0) {
        const daysAgo = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo <= 42) {
          count = (i % 3 === 0) ? 7 : (i % 2 === 0) ? 4 : 2;
        } else if (i % 7 === 0 || i % 11 === 0 || i % 5 === 0) {
          count = (i % 5 === 0) ? 5 : (i % 3 === 0) ? 2 : 1;
        }
      }
      totalSubs += count;

      days.push({
        dateStr,
        count,
        dayOfWeek: d.getDay(), // 0 = Sun, 6 = Sat
        month: d.getMonth(),
      });
    }

    // Group into 53 weeks
    const weeksArr: Array<typeof days> = [];
    for (let w = 0; w < 53; w++) {
      weeksArr.push(days.slice(w * 7, w * 7 + 7));
    }

    // Determine exact month start column index
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthColLabels: Record<number, string> = {};
    let lastMonth = -1;

    weeksArr.forEach((week, colIdx) => {
      const firstDayMonth = week[0].month;
      if (firstDayMonth !== lastMonth && colIdx < 51) {
        monthColLabels[colIdx] = monthNames[firstDayMonth];
        lastMonth = firstDayMonth;
      }
    });

    return {
      heatmapWeeks: weeksArr,
      monthPositions: monthColLabels,
      totalSubmissionsCount: totalSubs || 813,
    };
  }, [dashboard?.heatmap]);

  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const getHeatColor = (count: number) => {
    if (count >= 6) return "#EF3812";
    if (count >= 3) return "#F97316";
    if (count >= 1) return "#FCD34D";
    return "#EAE5DD";
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dashboard || { export: "codepulse-ledger" }, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "codepulse_ledger.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#EF3812] dark:text-[#EF3812] font-semibold">
              // TELEMETRY ACTIVE :
            </span>
            <span className="text-[#777777]">4 PLATFORMS AGGREGATED</span>
            <span className="text-[#0D8050] dark:text-[#2DD4BF] bg-[#ECF7F0] dark:bg-[#2DD4BF]/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-[#CEEAD6] dark:border-transparent">
              REALTIME DUAL-INGEST
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#181818] dark:text-white tracking-tight mt-1.5">
            Algorithmic Monograph & Ledger
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#141414] border border-[#DDD8CF] dark:border-[#242424] hover:bg-[#FAF8F5] text-xs font-mono font-medium text-[#181818] dark:text-[#E0E0E0] transition-colors shadow-sm"
          >
            <Download size={14} className="text-[#777777]" />
            <span>EXPORT LEDGER</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#EF3812] hover:bg-[#D42D0B] text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            <Plus size={15} />
            <span>+ LOG PROBLEM</span>
          </button>
        </div>
      </div>

      <AddProblemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />

      {/* ROW 1: SEC:01 (Mastery Profile) & SEC:02 (Trajectory) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SEC:01 / MASTERY AGGREGATE PROFILE (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#777777] font-semibold">
              SEC:01 / MASTERY AGGREGATE PROFILE
            </span>
            <span className="text-[#888888] text-[10px]">
              SYNCED: 12 SEC AGO
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Left big number */}
            <div className="sm:col-span-7 space-y-1">
              <p className="text-[10px] font-mono uppercase text-[#777777] tracking-wider font-semibold">
                TOTAL PROBLEMS SOLVED
              </p>
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-serif font-bold text-[#181818] dark:text-white">
                  {dashboard?.totalSolved || 261}
                </span>
                <span className="text-xs font-mono text-[#0D8050] font-semibold">
                  +18 this mo
                </span>
              </div>
              <p className="text-xs font-mono text-[#777777]">
                LeetCode (204) & Codeforces (57)
              </p>
            </div>

            {/* Right streak box */}
            <div className="sm:col-span-5 rounded-lg bg-[#FAF8F5] dark:bg-[#161616] border border-[#E8E4DC] dark:border-[#262626] p-4 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#777777]">
                <span>CURRENT STREAK</span>
                <span className="text-[#C23C2C] font-bold">42 DAYS</span>
              </div>
              <div className="flex items-center space-x-2 pt-0.5">
                <Flame size={18} className="text-[#EF3812]" />
                <span className="text-sm font-serif font-bold text-[#181818] dark:text-white">
                  Unbroken Velocity
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#777777] pt-1">
                813 total submissions / 143 days active
              </p>
            </div>
          </div>

          {/* Ratio bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#0D8050] font-bold">EASY :: 110</span>
              <span className="text-[#B56804] font-bold">MEDIUM :: 139</span>
              <span className="text-[#D93829] font-bold">HARD :: 12</span>
            </div>

            {/* 3-tone segmented bar */}
            <div className="h-2 w-full rounded-full bg-[#E8E4DC] dark:bg-[#1F1F1F] flex overflow-hidden">
              <div className="bg-[#0D8050] h-full" style={{ width: "42.1%" }} />
              <div className="bg-[#B56804] h-full" style={{ width: "53.2%" }} />
              <div className="bg-[#D93829] h-full" style={{ width: "4.7%" }} />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#777777]">
              <span>Target Ratio: 30 / 60 / 10</span>
              <span>Actual Distribution: 42.1% / 53.2% / 4.7%</span>
            </div>
          </div>

          {/* Platform rating tags */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#EFECE6] dark:border-[#1C1C1C]">
            <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#202020]">
              <p className="text-[10px] font-mono text-[#777777] uppercase font-semibold">
                CF MAX RATING
              </p>
              <p className="text-xl font-serif font-bold text-[#181818] dark:text-white mt-0.5">
                1,842
              </p>
              <p className="text-[10px] font-mono text-[#0E7490] font-semibold">
                Candidate Master
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#202020]">
              <p className="text-[10px] font-mono text-[#777777] uppercase font-semibold">
                CF CURRENT RATING
              </p>
              <p className="text-xl font-serif font-bold text-[#B56804] mt-0.5">
                1,748
              </p>
              <p className="text-[10px] font-mono text-[#777777]">
                Div. 2 Performer
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#202020]">
              <p className="text-[10px] font-mono text-[#777777] uppercase font-semibold">
                LEETCODE CONTEST
              </p>
              <p className="text-xl font-serif font-bold text-[#0D8050] dark:text-[#2DD4BF] mt-0.5">
                2,189
              </p>
              <p className="text-[10px] font-mono text-[#0D8050] font-semibold">
                Top 1.4% Global
              </p>
            </div>
          </div>
        </div>

        {/* SEC:02 / CROSS-PLATFORM TRAJECTORY (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#777777] font-semibold">
              SEC:02 / CROSS-PLATFORM TRAJECTORY
            </span>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center space-x-1 text-[#FF4D1C]">
                <span className="w-2 h-0.5 bg-[#FF4D1C]" />
                <span>LC ELO</span>
              </span>
              <span className="flex items-center space-x-1 text-[#F59E0B]">
                <span className="w-2 h-0.5 bg-[#F59E0B]" />
                <span>CF ELO</span>
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <XAxis
                  dataKey="label"
                  stroke="#444444"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#222222" }}
                />
                <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161616",
                    border: "1px solid #282828",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="lc"
                  stroke="#FF4D1C"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#FF4D1C" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="cf"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#F59E0B" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 dark:text-[#555555]">
            <span>Q2 '23 (BASE: 1420)</span>
            <span>Q4 '23</span>
            <span>Q1 '24</span>
            <span className="text-gray-900 dark:text-[#E0E0E0]">CURRENT (PEAK: 2214)</span>
          </div>

          {/* Projection footer */}
          <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#202020] flex items-center justify-between font-mono text-xs">
            <div>
              <p className="text-[10px] text-[#777777] uppercase font-semibold">
                PROJECTED 30D ELO
              </p>
              <p className="text-sm font-bold text-[#181818] dark:text-white mt-0.5">
                2,280 – 2,310
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#777777] uppercase font-semibold">
                CONFIDENCE RATING
              </p>
              <p className="text-xs font-bold text-[#0D8050] mt-0.5">
                σ = 18.4 (HIGH)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: SEC:03 / 52-WEEK SUBMISSIONS DENSITY LEDGER (Full Width) */}
      <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 space-y-4 relative shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
          <span className="text-[#777777] font-semibold">
            SEC:03 / 52-WEEK SUBMISSIONS DENSITY LEDGER
          </span>
          <div className="flex items-center space-x-4 text-[11px] text-[#777777]">
            <span>
              TOTAL: <strong className="text-[#181818] dark:text-white">{dashboard?.totalSolved ? `${dashboard.totalSolved} SUBMISSIONS` : `${totalSubmissionsCount} SUBMISSIONS`}</strong>
            </span>
            <span>
              CURRENT: <strong className="text-[#181818] dark:text-white">{dashboard?.streak ? `${dashboard.streak} DAYS` : "42 DAYS"}</strong>
            </span>
            <span>
              LONGEST: <strong className="text-[#181818] dark:text-white">88 DAYS</strong>
            </span>
          </div>
        </div>

        {/* Heatmap Grid - Contiguous LeetCode / GitHub Style (No strange spacing) */}
        <div className="overflow-x-auto pb-2">
          <div className="w-fit flex items-start space-x-2">
            {/* Days of week labels (Mon, Wed, Fri) */}
            <div className="pt-4 flex flex-col justify-between h-[96px] text-[9px] font-mono text-[#888888] select-none pr-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Matrix Container */}
            <div className="space-y-1">
              {/* Month Header Row - exactly aligned with week columns */}
              <div
                className="text-[10px] font-mono text-[#888888] select-none h-4"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(53, 11px)",
                  gap: "3px",
                }}
              >
                {Array.from({ length: 53 }).map((_, colIdx) => (
                  <div key={colIdx} className="overflow-visible whitespace-nowrap">
                    {monthPositions[colIdx] || ""}
                  </div>
                ))}
              </div>

              {/* 53 Columns x 7 Rows Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(53, 11px)",
                  gap: "3px",
                }}
              >
                {heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col space-y-[3px]">
                    {week.map((cell, dIdx) => (
                      <div
                        key={dIdx}
                        className="w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-125 cursor-pointer"
                        style={{ backgroundColor: getHeatColor(cell.count) }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({
                            dateStr: cell.dateStr,
                            count: cell.count,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Tooltip */}
        {hoveredCell && (
          <div
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 px-2.5 py-1.5 rounded bg-[#181818] border border-[#DDD8CF] dark:border-[#333333] shadow-xl text-[11px] font-mono text-white whitespace-nowrap"
            style={{ left: hoveredCell.x, top: hoveredCell.y - 6 }}
          >
            <span className="text-[#EF3812] font-bold">
              {hoveredCell.count} {hoveredCell.count === 1 ? "submission" : "submissions"}
            </span>{" "}
            on {hoveredCell.dateStr}
          </div>
        )}

        {/* Legend & ISO standard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-[#777777] pt-2 border-t border-[#EFECE6] dark:border-[#1C1C1C] gap-2">
          <div className="flex items-center space-x-2">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-[1px] bg-[#EAE5DD] dark:bg-[#171717]" />
              <span className="w-2.5 h-2.5 rounded-[1px] bg-[#FCD34D]" />
              <span className="w-2.5 h-2.5 rounded-[1px] bg-[#F97316]" />
              <span className="w-2.5 h-2.5 rounded-[1px] bg-[#EF3812]" />
            </div>
            <span>More Submissions</span>
          </div>
          <span>TIMEZONE SYNC: UTC+00:00 (ISO-8601 STANDARD)</span>
        </div>
      </div>

      {/* ROW 3: SEC:04 (Difficulty & Heuristics) & SEC:05 (Telemetry Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SEC:04 / DIFFICULTY & HEURISTICS (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#777777] font-semibold">
              SEC:04 / DIFFICULTY & HEURISTICS
            </span>
            <span className="text-[#0D8050] bg-[#ECF7F0] dark:bg-[#2DD4BF]/10 px-2 py-0.5 rounded text-[10px] font-bold border border-[#CEEAD6] dark:border-transparent">
              92.4% BEAT RATE
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Donut Chart with center label */}
            <div className="relative w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    innerRadius={36}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-sm font-serif font-bold text-[#181818] dark:text-white">
                  84.6%
                </span>
                <span className="text-[9px] font-mono text-[#777777]">
                  AC RATE
                </span>
              </div>
            </div>

            {/* Heuristics column */}
            <div className="space-y-2.5 font-mono text-xs flex-1">
              <div>
                <p className="text-[10px] text-[#777777] uppercase font-semibold">
                  AVG RUNTIME
                </p>
                <p className="text-[#181818] dark:text-white font-bold">
                  38 ms <span className="text-[#0E7490] text-[11px]">(P94)</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#777777] uppercase font-semibold">
                  MEMORY OVERHEAD
                </p>
                <p className="text-[#181818] dark:text-white font-bold">
                  16.4 MB <span className="text-[#B56804] text-[11px]">(P89)</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#777777] uppercase font-semibold">
                  CF DIV 1/2 SOLVES
                </p>
                <p className="text-[#181818] dark:text-white font-bold">57 Solved</p>
              </div>
            </div>
          </div>

          {/* Domains pills */}
          <div className="pt-2 border-t border-[#EFECE6] dark:border-[#1C1C1C] space-y-2">
            <p className="text-[10px] font-mono uppercase text-[#777777] tracking-wider font-semibold">
              TOP ALGORITHM DOMAINS
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] flex justify-between">
                <span className="text-[#333333] dark:text-[#C0C0C0] text-[11px] font-medium">Dynamic Prog.</span>
                <span className="text-[#0D8050] font-bold text-[11px]">64 AC</span>
              </div>
              <div className="p-2 rounded bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] flex justify-between">
                <span className="text-[#333333] dark:text-[#C0C0C0] text-[11px] font-medium">Graph & Tree</span>
                <span className="text-[#0D8050] font-bold text-[11px]">58 AC</span>
              </div>
              <div className="p-2 rounded bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] flex justify-between">
                <span className="text-[#333333] dark:text-[#C0C0C0] text-[11px] font-medium">Binary Search</span>
                <span className="text-[#0D8050] font-bold text-[11px]">41 AC</span>
              </div>
              <div className="p-2 rounded bg-[#FAF8F5] dark:bg-[#151515] border border-[#E8E4DC] dark:border-[#222222] flex justify-between">
                <span className="text-[#333333] dark:text-[#C0C0C0] text-[11px] font-medium">Segment Tree</span>
                <span className="text-[#0D8050] font-bold text-[11px]">19 AC</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEC:05 / TELEMETRY STREAM :: RECENT VERDICTS (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#777777] font-semibold">
              SEC:05 / TELEMETRY STREAM :: RECENT VERDICTS
            </span>
            <span className="text-[#777777] text-[10px]">AUTO-SYNC ON</span>
          </div>

          {/* Verdicts List */}
          <div className="space-y-2.5">
            {/* Verdict 1 */}
            <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#1F1F1F] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="px-1.5 py-0.5 rounded bg-[#EAF7EE] text-[#0D8050] font-bold text-[10px] border border-[#CEEAD6]">
                  AC
                </span>
                <div className="truncate">
                  <p className="text-[#181818] dark:text-white font-bold truncate">Tree Distances II</p>
                  <p className="text-[10px] text-[#777777] truncate">
                    CSES 1133 / CF Gym • Graph Re-rooting DP
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <p className="text-[#181818] dark:text-white text-[11px]">0.14s / 18.2 MB</p>
                <p className="text-[10px] text-[#777777]">2h ago</p>
              </div>
            </div>

            {/* Verdict 2 */}
            <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#1F1F1F] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="px-1.5 py-0.5 rounded bg-[#EAF7EE] text-[#0D8050] font-bold text-[10px] border border-[#CEEAD6]">
                  AC
                </span>
                <div className="truncate">
                  <p className="text-[#181818] dark:text-white font-bold truncate">
                    25. Reverse Nodes in k-Group
                  </p>
                  <p className="text-[10px] text-[#777777] truncate">
                    LeetCode #25 • Hard • Recursion & Pointers
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <p className="text-[#0D8050] text-[11px] font-bold">
                  0 ms Beats 100%
                </p>
                <p className="text-[10px] text-[#777777]">6h ago</p>
              </div>
            </div>

            {/* Verdict 3 */}
            <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#1F1F1F] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="px-1.5 py-0.5 rounded bg-[#EAF7EE] text-[#0D8050] font-bold text-[10px] border border-[#CEEAD6]">
                  AC
                </span>
                <div className="truncate">
                  <p className="text-[#181818] dark:text-white font-bold truncate">
                    25C. Roads in Berland
                  </p>
                  <p className="text-[10px] text-[#777777] truncate">
                    Codeforces 25C • 1900 ELO • Floyd-Warshall Dynamic
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <p className="text-[#181818] dark:text-white text-[11px]">1.82s / 5.4 MB</p>
                <p className="text-[10px] text-[#777777]">1d ago</p>
              </div>
            </div>

            {/* Verdict 4 */}
            <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#1F1F1F] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="px-1.5 py-0.5 rounded bg-[#EAF7EE] text-[#0D8050] font-bold text-[10px] border border-[#CEEAD6]">
                  AC
                </span>
                <div className="truncate">
                  <p className="text-[#181818] dark:text-white font-bold truncate">
                    410. Split Array Largest Sum
                  </p>
                  <p className="text-[10px] text-[#777777] truncate">
                    LeetCode #410 • Hard • Binary Search Answer
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <p className="text-[#0D8050] text-[11px] font-bold">
                  4 ms Beats 91.2%
                </p>
                <p className="text-[10px] text-[#777777]">1d ago</p>
              </div>
            </div>
          </div>

          <Link
            href="/problems"
            className="inline-flex items-center space-x-1 text-xs font-mono text-[#EF3812] hover:underline transition-colors pt-1 font-semibold"
          >
            <span>VIEW ALL 261 INGESTED SUBMISSIONS</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ROW 4: SEC:06 / SCHEDULED CONTESTS & COMPETITIONS (Full Width) */}
      <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#777777] font-semibold">
            SEC:06 / SCHEDULED CONTESTS & COMPETITIONS
          </span>
          <span className="text-[#B56804] bg-[#FEF6E9] dark:bg-[#F59E0B]/10 px-2 py-0.5 rounded text-[10px] font-bold border border-[#FEEAC1] dark:border-transparent">
            AUTO-REGISTER ENABLED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Contest 1: LeetCode */}
          <div className="rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#222222] p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#FEF2E8] border border-[#FDDBC6] text-[#C05621] font-bold">
                LEETCODE
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FDF0EE] text-[#C23C2C] border border-[#F8D2CC] font-bold">
                T-04:18:22
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#181818] dark:text-white leading-tight">
                Biweekly 128
              </h4>
              <p className="text-[11px] font-mono text-[#777777] mt-1">
                Sat 14:30 UTC • 4 Problems / 90m
              </p>
            </div>
            <div className="pt-2 border-t border-[#EFECE6] dark:border-[#1F1F1F] flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#0D8050] font-bold">REGISTERED</span>
              <Calendar size={13} className="text-[#777777]" />
            </div>
          </div>

          {/* Contest 2: Codeforces */}
          <div className="rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#222222] p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#EBF3FE] border border-[#D3E3FD] text-[#1D63D8] font-bold">
                CODEFORCES
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FEF6E9] border border-[#FEEAC1] text-[#B56804] font-bold">
                T-22:45:00
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#181818] dark:text-white leading-tight">
                Round 950 (Div. 2)
              </h4>
              <p className="text-[11px] font-mono text-[#777777] mt-1">
                Sun 17:35 UTC • Rated for &lt;2100
              </p>
            </div>
            <div className="pt-2 border-t border-[#EFECE6] dark:border-[#1F1F1F] flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#B56804] font-bold">REGISTER OPEN</span>
              <Calendar size={13} className="text-[#777777]" />
            </div>
          </div>

          {/* Contest 3: AtCoder */}
          <div className="rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#222222] p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#E6F8F9] border border-[#C5F0F3] text-[#0E7490] font-bold">
                ATCODER
              </span>
              <span className="px-2 py-0.5 rounded bg-[#EDE9E1] text-[#555555] font-bold">
                IN 2 DAYS
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#181818] dark:text-white leading-tight">
                ABC 350
              </h4>
              <p className="text-[11px] font-mono text-[#777777] mt-1">
                Mon 12:00 UTC • Tasks A through G
              </p>
            </div>
            <div className="pt-2 border-t border-[#EFECE6] dark:border-[#1F1F1F] flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#777777] font-medium">STANDBY</span>
              <Bell size={13} className="text-[#777777]" />
            </div>
          </div>

          {/* Contest 4: CodeChef */}
          <div className="rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#222222] p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#FEF7E6] border border-[#FEEAC1] text-[#B7791F] font-bold">
                CODECHEF
              </span>
              <span className="px-2 py-0.5 rounded bg-[#EDE9E1] text-[#555555] font-bold">
                IN 4 DAYS
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#181818] dark:text-white leading-tight">
                Starters 130
              </h4>
              <p className="text-[11px] font-mono text-[#777777] mt-1">
                Wed 14:30 UTC • Div 1 &amp; Div 2
              </p>
            </div>
            <div className="pt-2 border-t border-[#EFECE6] dark:border-[#1F1F1F] flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#777777] font-medium">SYNC PENDING</span>
              <Clock size={13} className="text-[#777777]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
