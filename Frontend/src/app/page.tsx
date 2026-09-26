"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Calendar,
  Code2,
  Terminal,
  Activity,
  Layers,
  Radio,
  Clock,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const primaryHref = user ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#080808] text-gray-900 dark:text-[#E0E0E0] font-sans selection:bg-[#FF4D1C]/30 selection:text-black dark:text-white relative overflow-x-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-[#FF4D1C]/5 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-[#FF4D1C]/3 blur-[160px] pointer-events-none -z-10" />

      {/* Navigation Bar */}
      <header className="border-b border-gray-200 dark:border-[#1C1C1C] bg-white dark:bg-[#0A0A0A]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold text-gray-500 dark:text-[#888888]">
              [CP:^]
            </span>
            <span className="font-display font-bold text-lg text-black dark:text-white tracking-tight">
              CodePulse
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C]" />
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono text-[#8E8E8E] tracking-wider uppercase">
            <a href="#thesis" className="hover:text-[#FFFFFF] transition-colors">
              REPOSITORIES
            </a>
            <a href="#architecture" className="hover:text-[#FFFFFF] transition-colors">
              KEY CODES
            </a>
            <a href="#architecture" className="hover:text-[#FFFFFF] transition-colors">
              SCORING ENGINE
            </a>
            <a href="#metrics" className="hover:text-[#FFFFFF] transition-colors">
              TELEMETRY RADAR
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href={primaryHref}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md border border-gray-300 dark:border-[#333333] hover:border-[#FF4D1C]/60 bg-white dark:bg-[#121212] hover:bg-gray-50 dark:bg-[#161616] text-xs font-mono text-gray-900 dark:text-[#E5E5E5] transition-all"
            >
              <span>{user ? "OPEN DASHBOARD" : "CLAIM PROFILE"}</span>
              <ArrowUpRight size={13} className="text-[#FF4D1C]" />
            </Link>

            <div className="w-8 h-8 rounded-full bg-[#E58B68] text-[#1A1A1A] font-bold text-xs flex items-center justify-center border border-[#FF8A65]/40 shadow-sm">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="pt-16 pb-24 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] text-[11px] font-mono text-[#A3A3A3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C]" />
              <span className="tracking-wider uppercase">
                SUB-SYSTEM SYNTHESIS READY / RFC-954 TELEMETRY
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-serif font-bold text-black dark:text-white tracking-tight leading-[1.08]">
              Every contest, verdict, and rating spike.{" "}
              <span className="italic font-normal text-[#FF5520] tracking-normal">
                In one pulse.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#A0A0A0] leading-relaxed max-w-xl">
              Stop checking four different profiles. CodePulse synthesizes
              LeetCode, Codeforces, CodeChef, and AtCoder into an engineered
              single pane of glass.
            </p>

            {/* CTA Group */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={primaryHref}
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-md bg-[#EF3812] hover:bg-[#D42D0B] text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-md"
                >
                  <span>CONNECT HANDLES</span>
                  <ArrowUpRight size={16} />
                </Link>

                <div className="text-[11px] font-mono text-gray-500 dark:text-[#777777] space-y-0.5">
                  <p className="text-[#A3A3A3] font-medium">
                    42.1k LC + CF + CC / DUAL PIPELINE DATA
                  </p>
                  <p>Reads public contest ledgers + SEED seed-node</p>
                </div>
              </div>

              {/* Status pill */}
              <div className="inline-flex items-center space-x-3 px-3 py-1.5 rounded-md bg-white dark:bg-[#121212] border border-[#202020] text-xs font-mono text-gray-500 dark:text-[#888888]">
                <span className="flex items-center space-x-1.5 text-gray-900 dark:text-[#E0E0E0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C]" />
                  <span>813 submissions</span>
                </span>
                <span className="text-gray-400 dark:text-[#444444]">•</span>
                <span>143 days continuous record</span>
                <span className="px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic / Mockup */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-gray-200 dark:border-[#242424] bg-white dark:bg-[#111111] p-5 shadow-2xl space-y-4 relative group">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D1C]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-[10px] font-mono text-gray-400 dark:text-[#666666] ml-2">
                    CF-LC-CC DUAL WORKSPACE // LIVE_RUNNER_NODE#01
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#10B981]">● ACTIVE</span>
              </div>

              {/* Stat highlight */}
              <div>
                <p className="text-[10px] font-mono uppercase text-gray-500 dark:text-[#777777] tracking-wider">
                  PROJECTED 30D ELO
                </p>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="text-3xl font-serif font-bold text-black dark:text-white">
                    2,180
                  </span>
                  <span className="text-xs font-mono text-[#10B981]">
                    +116 this quarter
                  </span>
                </div>
              </div>

              {/* Sparkline Visual Simulation */}
              <div className="h-28 w-full rounded-lg bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1C1C1C] p-3 flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-gray-400 dark:text-[#555555]">
                  <span>2200</span>
                  <span className="text-[#FF4D1C]">PEAK: 2214</span>
                </div>
                {/* SVG Curve */}
                <svg className="w-full h-14 overflow-visible" viewBox="0 0 300 60">
                  <defs>
                    <linearGradient id="heroLineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4D1C" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FF4D1C" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,50 Q 50,45 80,48 T 150,30 T 220,25 T 300,8"
                    fill="none"
                    stroke="#FF4D1C"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 0,50 Q 50,45 80,48 T 150,30 T 220,25 T 300,8 L 300,60 L 0,60 Z"
                    fill="url(#heroLineGrad)"
                  />
                  <circle cx="300" cy="8" r="4" fill="#FF4D1C" />
                </svg>
                <div className="flex justify-between text-[10px] font-mono text-gray-400 dark:text-[#555555]">
                  <span>Q2 '23</span>
                  <span>Q4 '23</span>
                  <span>CURRENT</span>
                </div>
              </div>

              {/* Mini activity grid */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-gray-400 dark:text-[#666666]">
                  <span>SUBMISSION DENSITY (52 WEEKS)</span>
                  <span className="text-gray-900 dark:text-[#E0E0E0]">813 TOTAL</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 rounded-[2px]"
                      style={{
                        backgroundColor:
                          i % 5 === 0
                            ? "#FF4D1C"
                            : i % 3 === 0
                            ? "#C23E15"
                            : i % 2 === 0
                            ? "#4D1D0E"
                            : "#1A1A1A",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer specs */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-[#1C1C1C] text-center font-mono text-[10px]">
                <div className="bg-gray-50 dark:bg-[#141414] p-2 rounded">
                  <span className="text-gray-500 dark:text-[#777777] block">LCPS</span>
                  <span className="text-black dark:text-white font-bold">148</span>
                </div>
                <div className="bg-gray-50 dark:bg-[#141414] p-2 rounded">
                  <span className="text-gray-500 dark:text-[#777777] block">CF DIV 1/2</span>
                  <span className="text-black dark:text-white font-bold">78</span>
                </div>
                <div className="bg-gray-50 dark:bg-[#141414] p-2 rounded">
                  <span className="text-gray-500 dark:text-[#777777] block">HARD</span>
                  <span className="text-[#EF4444] font-bold">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THESIS */}
      <section id="thesis" className="py-20 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-mono text-[#FF4D1C] uppercase tracking-widest font-semibold">
              // THESIS : SILENT ENTROPY
            </p>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black dark:text-white tracking-tight leading-snug">
              You compete across four platforms, yet your history is fragmented
              across four different browser tabs.
            </h2>

            <p className="text-lg font-serif italic text-[#D4A373]">
              Ratings decay in silence. Streaks break unnoticed.
            </p>

            <p className="text-sm sm:text-base text-[#8E8E8E] leading-relaxed max-w-xl">
              Computational excellence demands systematic telemetry. When problem
              verification, contest countdowns, and percentile changes are trapped
              in separate walled gardens, you lose the macro narrative of your
              algorithmic trajectory.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-gray-200 dark:border-[#222222] bg-white dark:bg-[#111111] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500 dark:text-[#777777] uppercase tracking-wider">
                  AGGREGATED DAILY HEATMAP
                </span>
                <span className="text-gray-400 dark:text-[#555555]">2024</span>
              </div>

              <div>
                <p className="text-[10px] font-mono text-gray-500 dark:text-[#777777] uppercase">
                  CURRENT EXECUTION
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-2xl font-serif font-bold text-black dark:text-white">
                    42-Day Active Streak
                  </span>
                  <Flame className="text-[#FF4D1C]" size={20} />
                </div>
              </div>

              {/* Simulated Heatmap Box */}
              <div className="grid grid-cols-10 gap-1.5 py-2">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded-[2px]"
                    style={{
                      backgroundColor:
                        i > 25
                          ? "#FF4D1C"
                          : i > 15
                          ? "#B33914"
                          : i > 5
                          ? "#59200F"
                          : "#1C1C1C",
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 dark:text-[#666666] pt-2 border-t border-gray-200 dark:border-[#1C1C1C]">
                <span>LESS</span>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-[1px] bg-gray-100 dark:bg-[#1C1C1C]" />
                  <span className="w-2 h-2 rounded-[1px] bg-[#59200F]" />
                  <span className="w-2 h-2 rounded-[1px] bg-[#B33914]" />
                  <span className="w-2 h-2 rounded-[1px] bg-[#FF4D1C]" />
                </div>
                <span>MORE FREQUENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Channels bar */}
        <div className="max-w-7xl mx-auto px-6 mt-14">
          <div className="p-4 rounded-xl bg-[#0E0E0E] border border-[#202020] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <span className="text-gray-400 dark:text-[#666666] uppercase tracking-wider text-[11px]">
              LIVE INGESTION CHANNELS / RFC FEED PROTOCOL V4.18
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#262626] text-[#FFA116]">
                ● LEETCODE / 141 Solved
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#262626] text-[#3B82F6]">
                ● CODEFORCES / 174 Solved / 1842 Max Rating
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#262626] text-[#EAB308]">
                ● CODECHEF / 4★ Division 1
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#262626] text-[#2DD4BF]">
                ● ATCODER / 1221 Cyan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ARCHITECTURE */}
      <section id="architecture" className="py-20 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-mono text-[#FF4D1C] uppercase tracking-widest font-semibold">
                ENGINE ARCHITECTURE
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black dark:text-white tracking-tight mt-1">
                Constructed for execution rigor.
              </h2>
            </div>
            <p className="text-xs font-mono text-gray-500 dark:text-[#777777] max-w-sm text-left md:text-right">
              Telemetry pipelines decoupled from sources: &lt;200ms. Deterministic
              aggregation + vetted tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="rounded-xl border border-gray-200 dark:border-[#222222] bg-white dark:bg-[#111111] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500 dark:text-[#888888]">
                  MODULE:01 // MULTI-SERIES SYNTHESIS
                </span>
                <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-[10px]">
                  REAL-TIME TELEMETRY
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-black dark:text-white">
                Unified Command Dashboard
              </h3>
              <p className="text-xs text-[#8E8E8E] leading-relaxed">
                Normalized rating trajectories across disparate scoring matrices.
                Overlay your Codeforces rating against your LeetCode Guardian
                percentile with mathematical parity.
              </p>

              {/* Inner preview */}
              <div className="rounded-lg bg-white dark:bg-[#0A0A0A] border border-[#1E1E1E] p-4 space-y-3 font-mono text-xs">
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[#181818] text-[#FFA116]">
                    LeetCode Rank: 11
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#181818] text-[#3B82F6]">
                    CF Div. 1/2: 78
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#181818] text-[#10B981]">
                    AC Rate: 84.6%
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-[#1C1C1C] pt-2 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-gray-900 dark:text-[#E0E0E0]">
                    <span>Codeforces Round 948 (Div. 2)</span>
                    <span className="text-[#10B981]">Rank #412 (+94 h)</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-[#888888]">
                    <span>LeetCode Weekly Contest 398</span>
                    <span className="text-[#10B981]">Rank #121 (+43 h)</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-[#888888]">
                    <span>AtCoder Beginner Contest 349</span>
                    <span className="text-[#EF4444]">Rate: #854 (-19 h)</span>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-[#555555] pt-1">
                  <span>POLLING INTERVAL: 60 SEC</span>
                  <span className="text-[#FF4D1C]">VIEW TELEMETRY STACK →</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-gray-200 dark:border-[#222222] bg-white dark:bg-[#111111] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500 dark:text-[#888888]">MODULE:02 // TIME RADAR</span>
                <span className="text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded text-[10px]">
                  CALENDAR CLOUD READY
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-black dark:text-white">
                Global Contest Radar
              </h3>
              <p className="text-xs text-[#8E8E8E] leading-relaxed">
                Zero-friction multi-source contest aggregation with synchronized
                countdowns and one-click RFC-5545 calendar integration.
              </p>

              {/* Inner preview */}
              <div className="rounded-lg bg-white dark:bg-[#0A0A0A] border border-[#1E1E1E] p-4 space-y-2.5 font-mono text-xs">
                <div className="p-2 rounded bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#222222] flex items-center justify-between">
                  <div>
                    <span className="text-black dark:text-white font-bold block text-[11px]">
                      LeetCode Biweekly 128
                    </span>
                    <span className="text-gray-400 dark:text-[#666666] text-[10px]">
                      Saturday • 14:30 UTC
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF4D1C]/20 text-[#FF4D1C] font-bold">
                    T-04:18:22
                  </span>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#222222] flex items-center justify-between">
                  <div>
                    <span className="text-black dark:text-white font-bold block text-[11px]">
                      Codeforces Round 950 (Div. 2)
                    </span>
                    <span className="text-gray-400 dark:text-[#666666] text-[10px]">
                      Sunday • 17:35 UTC
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-bold">
                    T-22:45:00
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-[#555555] pt-1">
                  <span>SUBSCRIBE TO .ICS (RFC-5545)</span>
                  <span className="text-[#10B981]">FEED SYNCED</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-gray-200 dark:border-[#222222] bg-white dark:bg-[#111111] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500 dark:text-[#888888]">MODULE:03 // UNIFIED LEDGER</span>
                <span className="text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded text-[10px]">
                  AUTO-LABELED REPOSITORY
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-black dark:text-white">
                Problem Ledger & Submission Tracker
              </h3>
              <p className="text-xs text-[#8E8E8E] leading-relaxed">
                Cross-platform submission history with precise execution runtime,
                memory footprint, and custom domain algorithmic tags.
              </p>

              {/* Inner preview table */}
              <div className="rounded-lg bg-white dark:bg-[#0A0A0A] border border-[#1E1E1E] p-3 font-mono text-[11px] space-y-2">
                <div className="grid grid-cols-12 text-gray-400 dark:text-[#555555] text-[10px] border-b border-gray-200 dark:border-[#1C1C1C] pb-1">
                  <span className="col-span-5">PROBLEM</span>
                  <span className="col-span-3">PLATFORM</span>
                  <span className="col-span-2">VERDICT</span>
                  <span className="col-span-2 text-right">TIME</span>
                </div>
                <div className="grid grid-cols-12 text-gray-900 dark:text-[#E0E0E0] items-center">
                  <span className="col-span-5 truncate">Tree Distances II</span>
                  <span className="col-span-3 text-[#3B82F6]">CSES / CF</span>
                  <span className="col-span-2 text-[#10B981]">AC</span>
                  <span className="col-span-2 text-right text-gray-500 dark:text-[#777777]">24ms</span>
                </div>
                <div className="grid grid-cols-12 text-gray-900 dark:text-[#E0E0E0] items-center">
                  <span className="col-span-5 truncate">Reverse Nodes k-Group</span>
                  <span className="col-span-3 text-[#FFA116]">LeetCode</span>
                  <span className="col-span-2 text-[#10B981]">AC</span>
                  <span className="col-span-2 text-right text-gray-500 dark:text-[#777777]">8ms</span>
                </div>
                <div className="grid grid-cols-12 text-gray-900 dark:text-[#E0E0E0] items-center">
                  <span className="col-span-5 truncate">Roads in Berland</span>
                  <span className="col-span-3 text-[#3B82F6]">Codeforces</span>
                  <span className="col-span-2 text-[#10B981]">AC</span>
                  <span className="col-span-2 text-right text-gray-500 dark:text-[#777777]">182ms</span>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-gray-200 dark:border-[#222222] bg-white dark:bg-[#111111] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500 dark:text-[#888888]">
                  MODULE:04 // ENGINE INTEGRITY
                </span>
                <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-[10px]">
                  +99.98% UP
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-black dark:text-white">
                Engineered Scraper API & Redis Cache
              </h3>
              <p className="text-xs text-[#8E8E8E] leading-relaxed">
                Codeforces ratelimits API. CodePulse employs an isolated headless
                daemon with Redis caching to slash lookup latency by 98%.
              </p>

              {/* Code snippet */}
              <div className="rounded-lg bg-white dark:bg-[#0A0A0A] border border-[#1E1E1E] p-3.5 font-mono text-[11px] text-[#A0A0A0] leading-relaxed overflow-x-auto">
                <p className="text-gray-400 dark:text-[#666666]">// Redis memoized ingestion worker</p>
                <p>
                  <span className="text-[#FF5520]">async function</span>{" "}
                  <span className="text-[#F59E0B]">syncContests</span>(handle: string) &#123;
                </p>
                <p className="pl-3">
                  <span className="text-[#FF5520]">const</span> cached ={" "}
                  <span className="text-[#FF5520]">await</span> redis.get(
                  <span className="text-[#10B981]">`cf:$&#123;handle&#125;`</span>);
                </p>
                <p className="pl-3">
                  <span className="text-[#FF5520]">if</span> (cached) return JSON.parse(cached);
                </p>
                <p className="pl-3">
                  <span className="text-[#FF5520]">const</span> res ={" "}
                  <span className="text-[#FF5520]">await</span> headlessFetch(cf_endpoint);
                </p>
                <p className="pl-3">
                  <span className="text-[#FF5520]">await</span> redis.setex(
                  <span className="text-[#10B981]">`cf:$&#123;handle&#125;`</span>, 300, res);
                </p>
                <p>&#125;</p>
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-[#555555] pt-2 mt-2 border-t border-gray-200 dark:border-[#1C1C1C]">
                  <span>LATENCY: &lt;60ms P95</span>
                  <span className="text-[#10B981]">REDIS HITS: 94.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: AGGREGATED METRIC PROOF */}
      <section id="metrics" className="py-20 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <p className="text-xs font-mono text-[#FF4D1C] uppercase tracking-widest font-semibold">
            04 // AGGREGATED METRIC PROOF
          </p>

          <div className="space-y-12">
            {/* Metric 1 */}
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 border-b border-gray-200 dark:border-[#1C1C1C] pb-8">
              <span className="text-6xl sm:text-7xl font-serif font-bold text-black dark:text-white min-w-[200px]">
                261
              </span>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                  LeetCode algorithmic problems cataloged
                </h4>
                <p className="text-xs font-mono text-gray-500 dark:text-[#777777] uppercase tracking-wider mt-1">
                  DYNAMIC PROGRAMMING · GRAPH / TREE · STRING · DP/MATH
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 border-b border-gray-200 dark:border-[#1C1C1C] pb-8">
              <span className="text-6xl sm:text-7xl font-serif font-bold text-black dark:text-white min-w-[200px]">
                42
              </span>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                  Consecutive day active execution streak
                </h4>
                <p className="text-xs font-mono text-gray-500 dark:text-[#777777] uppercase tracking-wider mt-1">
                  ZERO EXCUSE DEFAULT RULE · SUBMISSION PULSE MONITORED
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 border-b border-gray-200 dark:border-[#1C1C1C] pb-8">
              <span className="text-6xl sm:text-7xl font-serif font-bold text-black dark:text-white min-w-[200px]">
                174
              </span>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                  Codeforces problems officially solved
                </h4>
                <p className="text-xs font-mono text-gray-500 dark:text-[#777777] uppercase tracking-wider mt-1">
                  DIV. 1 & DIV. 2 EXPERT BRACKET VERIFIED · 18.2 AVG RATING
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
              <span className="text-6xl sm:text-7xl font-serif font-bold text-black dark:text-white min-w-[200px]">
                813
              </span>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                  Total verified submissions across 143 days
                </h4>
                <p className="text-xs font-mono text-gray-500 dark:text-[#777777] uppercase tracking-wider mt-1">
                  VET FIL CHECK PASS VERIFICATION · 98.4% TIME TRACKING ACCURACY
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA FOOTER */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-black dark:text-white tracking-tight">
              Stop toggling tabs.
            </h2>
            <h2 className="text-4xl sm:text-5xl font-serif italic text-[#FF5520] tracking-tight mt-1">
              Start building rating.
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end space-y-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-md bg-[#FF4D1C] hover:bg-[#FF6236] text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-orange"
            >
              <span>SYNC YOUR PROFILES NOW — IT'S FREE</span>
              <ArrowUpRight size={16} />
            </Link>

            <p className="text-xs font-mono text-gray-500 dark:text-[#777777]">
              Imports profiles in under 30 seconds. No passwords required.
            </p>
            <p className="text-[10px] font-mono text-gray-400 dark:text-[#555555]">
              ● PUBLIC LEDGER SERVICE OPERATIONAL • DI API KEY READY
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
