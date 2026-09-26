"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import {
  Search,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Tag,
  RefreshCw,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  Settings,
} from "lucide-react";
import AddProblemModal from "@/components/problems/AddProblemModal";

interface ProblemItem {
  id: string;
  name: string;
  identifier: string;
  platform: "LEETCODE" | "CF / CSES" | "CF 1800E" | "CODECHEF" | "ATCODER" | string;
  difficulty: "HARD" | "MED" | "EASY";
  solvedDate: string;
  streakDay?: number;
  status: "AC" | "TLE" | "TODO";
  execText: string;
  execPercent: number;
  origin: "SYNCED" | "MANUAL";
}

const DEFAULT_PROBLEMS: ProblemItem[] = [
  {
    id: "cses-tree-dist",
    name: "Tree Distances II",
    identifier: "CSES / CF-1138 • Tree DP Benchmark",
    platform: "CF / CSES",
    difficulty: "HARD",
    solvedDate: "Oct 24, 2023",
    streakDay: 42,
    status: "AC",
    execText: "24ms / 1st try",
    execPercent: 92,
    origin: "SYNCED",
  },
  {
    id: "lc-25",
    name: "Reverse Nodes in k-Group",
    identifier: "LeetCode #25 • Core Recursive Linear Logic",
    platform: "LEETCODE",
    difficulty: "HARD",
    solvedDate: "Oct 23, 2023",
    streakDay: 41,
    status: "AC",
    execText: "8ms / Beats 96.2%",
    execPercent: 96,
    origin: "SYNCED",
  },
  {
    id: "cf-1800e",
    name: "Beautiful Subarrays",
    identifier: "Codeforces 1800E • Prefix Parity",
    platform: "CF 1800E",
    difficulty: "MED",
    solvedDate: "Oct 21, 2023",
    streakDay: 39,
    status: "AC",
    execText: "142ms / 42.1MB",
    execPercent: 78,
    origin: "SYNCED",
  },
  {
    id: "lc-630",
    name: "Course Schedule III",
    identifier: "LeetCode #630 • Mock Interview Re-run",
    platform: "LEETCODE",
    difficulty: "HARD",
    solvedDate: "Oct 19, 2023",
    streakDay: 37,
    status: "AC",
    execText: "38ms / Beats 88.7%",
    execPercent: 88,
    origin: "MANUAL",
  },
  {
    id: "cc-starters-67",
    name: "Chef and Minimum Coloring",
    identifier: "CodeChef STARTERS 67 • Interval Bound",
    platform: "CODECHEF",
    difficulty: "MED",
    solvedDate: "Oct 16, 2023",
    streakDay: 34,
    status: "AC",
    execText: "0.04s / 14.8MB",
    execPercent: 84,
    origin: "SYNCED",
  },
  {
    id: "atc-abc294",
    name: "Distance Queries on a Tree",
    identifier: "AtCoder ABC 294 • Up-pointer LCA",
    platform: "ATCODER",
    difficulty: "MED",
    solvedDate: "Oct 12, 2023",
    streakDay: 30,
    status: "AC",
    execText: "98ms / O(log N)",
    execPercent: 72,
    origin: "SYNCED",
  },
  {
    id: "lc-4",
    name: "Median of Two Sorted Arrays",
    identifier: "LeetCode #4 • TLE on test 2084/2094",
    platform: "LEETCODE",
    difficulty: "HARD",
    solvedDate: "Oct 08, 2023 RE-TRY PENDING",
    status: "TLE",
    execText: "TLE / >2000ms",
    execPercent: 100,
    origin: "SYNCED",
  },
];

export default function ProblemLedgerPage() {
  const [problems, setProblems] = useState<ProblemItem[]>(DEFAULT_PROBLEMS);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [diffFilter, setDiffFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [originFilter, setOriginFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  // Fetch real progress from backend if available
  const fetchProgress = async () => {
    try {
      const { data } = await api.get("/api/progress");
      if (data?.progress && data.progress.length > 0) {
        const mapped: ProblemItem[] = data.progress.map((p: any) => ({
          id: p._id || p.problemId,
          name: p.problemId,
          identifier: `${p.platform.toUpperCase()} • ${p.notes || "Algorithm Node"}`,
          platform: p.platform.toUpperCase(),
          difficulty:
            p.difficulty?.toUpperCase() === "EASY"
              ? "EASY"
              : p.difficulty?.toUpperCase() === "HARD"
              ? "HARD"
              : "MED",
          solvedDate: p.solvedAt
            ? new Date(p.solvedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent",
          streakDay: 42,
          status: p.status === "solved" ? "AC" : p.status === "attempted" ? "TLE" : "TODO",
          execText: "24ms / Optimal",
          execPercent: 90,
          origin: "MANUAL",
        }));
        setProblems([...DEFAULT_PROBLEMS, ...mapped]);
      }
    } catch (e) {
      console.error("Progress fetch error:", e);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  // Filter logic
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.identifier.toLowerCase().includes(search.toLowerCase()) ||
        p.platform.toLowerCase().includes(search.toLowerCase());

      const matchesPlatform =
        platformFilter === "ALL" ||
        p.platform.toLowerCase().includes(platformFilter.toLowerCase());

      const matchesDiff =
        diffFilter === "ALL" || p.difficulty === diffFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "AC" && p.status === "AC") ||
        (statusFilter === "TLE" && p.status === "TLE") ||
        (statusFilter === "TODO" && p.status === "TODO");

      const matchesOrigin =
        originFilter === "ALL" || p.origin === originFilter;

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesDiff &&
        matchesStatus &&
        matchesOrigin
      );
    });
  }, [problems, search, platformFilter, diffFilter, statusFilter, originFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProblems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProblems.map((p) => p.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const exportCsv = () => {
    const rows = [
      ["Problem", "Identifier", "Platform", "Difficulty", "Status", "Solved Date"],
      ...filteredProblems.map((p) => [
        p.name,
        p.identifier,
        p.platform,
        p.difficulty,
        p.status,
        p.solvedDate,
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.map((x) => `"${x}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "codepulse_problems.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-[#FDF0EE] dark:bg-[#201515] border border-[#F8D2CC] dark:border-transparent text-[#C23C2C] font-bold text-[10px] tracking-wider uppercase">
              CATALOG NO. 09-E
            </span>
            <span className="text-[#888888]">•</span>
            <span className="text-[#777777] font-semibold">
              // REPOSITORY HEURISTICS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#181818] dark:text-white tracking-tight mt-1.5">
            Problem Ledger
          </h1>
          <p className="text-xs font-mono text-[#555555] dark:text-[#777777] uppercase tracking-wider mt-1.5">
            <strong className="text-[#0D8050] font-bold">813</strong> SUBMISSIONS INDEXED · <strong className="text-[#0D8050] font-bold">261</strong> UNIQUE ALGORITHMIC NODES · <strong className="text-[#C23C2C] font-bold">98.4%</strong> <span className="text-[#C23C2C] font-bold">TELEMETRY FIDELITY</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#222222] font-mono text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="text-[#777777] uppercase text-[10px] block font-semibold">
              HARDEST GRAPH SOLVED
            </span>
            <span className="text-[#181818] dark:text-white font-bold flex items-center gap-1.5 mt-0.5">
              <span>CSES: Tree Distances II</span>
              <span className="bg-[#FDECEB] text-[#D93829] border border-[#F8D2CC] text-[10px] font-bold px-1.5 py-0.2 rounded">HARD</span>
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#141414] border border-[#E8E4DC] dark:border-[#222222] font-mono text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="text-[#777777] uppercase text-[10px] block font-semibold">
              SYNC CADENCE
            </span>
            <span className="text-[#0D8050] font-bold flex items-center space-x-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D8050]" />
              <span>T-3m Ago</span>
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#EF3812] hover:bg-[#D42D0B] text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            <Plus size={15} />
            <span>+ Manual Entry</span>
          </button>
        </div>
      </div>

      <AddProblemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProgress}
      />

      {/* TOP 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: LeetCode Solved */}
        <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-5 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#777777]">
            <span className="uppercase font-semibold">LEETCODE SOLVED</span>
            <span className="text-[#C05621] font-bold">LC / 261</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-serif font-bold text-[#181818] dark:text-white">148</span>
            <span className="text-xs font-mono text-[#0D8050] font-semibold">
              ↑ 12 this wk
            </span>
          </div>
        </div>

        {/* Card 2: Codeforces Index */}
        <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-5 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#777777]">
            <span className="uppercase font-semibold">CODEFORCES INDEX</span>
            <span className="text-[#C23C2C] font-bold">CF / 174</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-serif font-bold text-[#181818] dark:text-white">78</span>
            <span className="text-xs font-mono text-[#777777]">Div 1/2</span>
          </div>
        </div>

        {/* Card 3: Runtime Dominance */}
        <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-5 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#777777] uppercase font-semibold">
              RUNTIME DOMINANCE
            </span>
            <span className="text-[#0D8050] font-bold text-[11px]">
              &gt;90% BEAT
            </span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-serif font-bold text-[#0D8050]">
              91.4%
            </span>
            <span className="text-xs font-mono text-[#777777]">Median beats</span>
          </div>
        </div>

        {/* Card 4: Current Streak Run */}
        <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-5 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#777777] uppercase font-semibold">
              CURRENT STREAK RUN
            </span>
            <span className="text-[#C23C2C] font-bold text-[11px]">
              DAILY LOG
            </span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-serif font-bold text-[#C23C2C]">
              42d
            </span>
            <span className="text-xs font-mono text-[#777777]">Active Streak</span>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Search input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-[#777777]" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problem name, tags (DP, Graphs, Segment Tree), or problem ID..."
            className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#DDD8CF] dark:border-[#222222] rounded-lg pl-10 pr-28 py-2.5 text-xs text-[#181818] dark:text-[#E5E5E5] placeholder-[#777777] font-mono focus:outline-none focus:border-[#A32616]"
          />
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 text-[10px] font-mono px-2 py-1 rounded bg-[#ECE8E1] dark:bg-[#202020] text-[#555555] dark:text-[#888888] hover:text-black dark:hover:text-white"
          >
            ESC CLEAR
          </button>
        </div>

        {/* Filter Rows */}
        <div className="space-y-2.5 pt-1 text-xs font-mono">
          {/* Platform row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#777777] uppercase text-[10px] tracking-wider w-24 shrink-0 font-semibold">
              PLATFORM:
            </span>
            {[
              { key: "ALL", label: "ALL (261)" },
              { key: "LEETCODE", label: "LEETCODE (148)" },
              { key: "CODEFORCES", label: "CODEFORCES (78)" },
              { key: "CODECHEF", label: "CODECHEF (21)" },
              { key: "ATCODER", label: "ATCODER (14)" },
            ].map((p) => {
              const isActive = platformFilter === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setPlatformFilter(p.key)}
                  className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#181818] text-white"
                      : "bg-[#EDE9E1] hover:bg-[#E2DDD3] text-[#333333] dark:bg-[#161616] dark:text-[#888888]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Difficulty row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#777777] uppercase text-[10px] tracking-wider w-24 shrink-0 font-semibold">
              DIFFICULTY:
            </span>
            {[
              { key: "ALL", label: "ALL" },
              { key: "EASY", label: "EASY (110)", pillClass: "bg-[#EAF7EE] text-[#0D8050] hover:bg-[#DFEFE5]" },
              { key: "MED", label: "MEDIUM (139)", pillClass: "bg-[#FEF6E9] text-[#B56804] hover:bg-[#FBEED7]" },
              { key: "HARD", label: "HARD (12)", pillClass: "bg-[#FDECEB] text-[#D93829] hover:bg-[#F9DDDC]" },
            ].map((d) => {
              const isActive = diffFilter === d.key;
              return (
                <button
                  key={d.key}
                  onClick={() => setDiffFilter(d.key)}
                  className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#181818] text-white"
                      : d.pillClass || "bg-[#EDE9E1] hover:bg-[#E2DDD3] text-[#333333] dark:bg-[#161616] dark:text-[#888888]"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#777777] uppercase text-[10px] tracking-wider w-24 shrink-0 font-semibold">
              STATUS:
            </span>
            {[
              { key: "ALL", label: "ALL ENTRIES" },
              { key: "AC", label: "SOLVED (AC)", pillClass: "bg-[#EAF7EE] text-[#0D8050] hover:bg-[#DFEFE5]" },
              { key: "TLE", label: "ATTEMPTED / TLE", pillClass: "bg-[#FDECEB] text-[#D93829] hover:bg-[#F9DDDC]" },
              { key: "TODO", label: "TODO / STARRED", pillClass: "bg-[#EDE9E1] text-[#444444] hover:bg-[#E2DDD3]" },
            ].map((s) => {
              const isActive = statusFilter === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#181818] text-white"
                      : s.pillClass || "bg-[#EDE9E1] hover:bg-[#E2DDD3] text-[#333333]"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Origin row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#777777] uppercase text-[10px] tracking-wider w-24 shrink-0 font-semibold">
              ORIGIN:
            </span>
            {[
              { key: "ALL", label: "ALL PIPELINES" },
              { key: "SYNCED", label: "SYNCED (API/DAEMON)", pillClass: "bg-[#EDE9E1] text-[#444444] hover:bg-[#E2DDD3]" },
              { key: "MANUAL", label: "LOGGED MANUALLY", pillClass: "bg-[#EDE9E1] text-[#444444] hover:bg-[#E2DDD3]" },
            ].map((o) => {
              const isActive = originFilter === o.key;
              return (
                <button
                  key={o.key}
                  onClick={() => setOriginFilter(o.key)}
                  className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#181818] text-white"
                      : o.pillClass || "bg-[#EDE9E1] hover:bg-[#E2DDD3] text-[#333333]"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Table Action Toolbar */}
        <div className="p-3.5 px-4 border-b border-[#E8E4DC] dark:border-[#1C1C1C] flex items-center justify-between text-xs font-mono bg-white dark:bg-[#111111]">
          <label className="flex items-center space-x-2.5 cursor-pointer text-[#444444] dark:text-[#888888] hover:text-black dark:hover:text-white">
            <input
              type="checkbox"
              checked={
                selectedIds.size === filteredProblems.length &&
                filteredProblems.length > 0
              }
              onChange={toggleSelectAll}
              className="rounded bg-white border-[#DDD8CF] text-[#A32616] focus:ring-0 focus:ring-offset-0"
            />
            <span className="uppercase text-[11px] font-semibold tracking-wider">
              SELECT ALL ON PAGE
            </span>
          </label>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={exportCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#DDD8CF] bg-white text-[#444444] hover:bg-[#FAF8F5] transition-colors text-[11px] font-semibold uppercase tracking-wider"
            >
              <Download size={13} />
              <span>EXPORT CSV</span>
            </button>
            <button className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#DDD8CF] bg-white text-[#444444] hover:bg-[#FAF8F5] transition-colors text-[11px] font-semibold uppercase tracking-wider">
              <Tag size={13} />
              <span>BATCH TAG</span>
            </button>
          </div>
        </div>

        {/* Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E4DC] dark:border-[#1C1C1C] text-[#666666] dark:text-[#888888] text-[10px] uppercase tracking-wider bg-[#FAF8F5] dark:bg-[#0E0E0E] font-semibold">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4 w-14">STAT</th>
                <th className="py-3 px-4">PROBLEM &amp; IDENTIFIER</th>
                <th className="py-3 px-4 w-28">PLATFORM</th>
                <th className="py-3 px-4 w-20">DIFF</th>
                <th className="py-3 px-4 w-44">SOLVED &amp; STREAK</th>
                <th className="py-3 px-4 w-48">EXEC HEURISTICS</th>
                <th className="py-3 px-4 w-28">ORIGIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] dark:divide-[#181818] bg-white dark:bg-[#111111]">
              {filteredProblems.map((problem) => {
                const isSelected = selectedIds.has(problem.id);
                const isTLE = problem.status === "TLE";
                const isAmber = problem.id === "cf-1800e" || problem.id === "cc-starters-67";
                
                return (
                  <tr
                    key={problem.id}
                    className={`hover:bg-[#FAF8F5] dark:hover:bg-[#141414] transition-colors ${
                      isSelected ? "bg-[#F7F5F0] dark:bg-[#141414]" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(problem.id)}
                        className="rounded bg-white border-[#DDD8CF] text-[#A32616] focus:ring-0 focus:ring-offset-0"
                      />
                    </td>

                    {/* Stat Icon */}
                    <td className="py-3.5 px-4">
                      {problem.status === "AC" ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#EAF7EE] text-[#0D8050]">
                          <CheckCircle2 size={13} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#FDECEB] text-[#D93829]">
                          <Clock size={13} />
                        </span>
                      )}
                    </td>

                    {/* Problem & Identifier */}
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <p className="text-[#181818] dark:text-white font-serif font-bold text-sm leading-tight hover:text-[#A32616] cursor-pointer">
                        {problem.name}
                      </p>
                      <p className={`text-[10px] font-mono mt-0.5 ${
                        isTLE ? "text-[#D93829] font-medium" : "text-[#777777]"
                      }`}>
                        {problem.identifier}
                      </p>
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        problem.platform === "LEETCODE"
                          ? "bg-[#FEF2E8] text-[#C05621] border border-[#FDDBC6]"
                          : problem.platform === "CODECHEF"
                          ? "bg-[#FEF7E6] text-[#B7791F] border border-[#FEEAC1]"
                          : problem.platform === "ATCODER"
                          ? "bg-[#E6F8F9] text-[#0E7490] border border-[#C5F0F3]"
                          : "bg-[#EBF3FE] text-[#1D63D8] border border-[#D3E3FD]"
                      }`}>
                        {problem.platform}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          problem.difficulty === "HARD"
                            ? "bg-[#FDECEB] text-[#D93829] border-[#F8D2CC]"
                            : problem.difficulty === "MED"
                            ? "bg-[#FEF6E9] text-[#B56804] border-[#FEEAC1]"
                            : "bg-[#EAF7EE] text-[#0D8050] border-[#CEEAD6]"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Solved & Streak */}
                    <td className="py-3.5 px-4 text-[#555555] text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <span>{problem.solvedDate}</span>
                        {problem.streakDay && (
                          <span className="inline-flex items-center text-[#D93829] font-bold">
                            DAY {problem.streakDay} 🔥
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Exec Heuristics */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`text-[11px] font-bold ${
                            isTLE
                              ? "text-[#D93829]"
                              : isAmber
                              ? "text-[#8A5720]"
                              : "text-[#0D8050]"
                          }`}
                        >
                          {problem.execText}
                        </span>
                        <div className="w-full h-1 rounded-full bg-[#E8E4DC] dark:bg-[#202020] overflow-hidden">
                          <div
                            className={`h-full ${
                              isTLE
                                ? "bg-[#D93829]"
                                : isAmber
                                ? "bg-[#8A5720]"
                                : "bg-[#0D8050]"
                            }`}
                            style={{ width: `${problem.execPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Origin */}
                    <td className="py-3.5 px-4">
                      {problem.origin === "SYNCED" ? (
                        <span className="inline-flex items-center space-x-1 bg-[#F0F5F2] text-[#3B6E57] border border-[#D5E6DC] px-2 py-0.5 rounded text-[10px] font-bold">
                          <RefreshCw size={10} />
                          <span>SYNCED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 bg-[#FDF0EE] text-[#C23C2C] border border-[#F8D2CC] px-2 py-0.5 rounded text-[10px] font-bold">
                          <Edit3 size={10} />
                          <span>MANUAL</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-[#E8E4DC] dark:border-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#777777] gap-3 bg-white dark:bg-[#111111]">
          <div className="flex items-center space-x-2">
            <span>
              Showing <strong className="text-[#181818] dark:text-white">1-25</strong> of{" "}
              <strong className="text-[#181818] dark:text-white">261</strong> unique problems
            </span>
            <span className="text-[#DDD8CF]">|</span>
            <span className="flex items-center space-x-1">
              <span>PAGE DENSITY:</span>
              <span className="border border-[#DDD8CF] px-1.5 py-0.5 rounded text-[#181818] font-bold text-[11px]">
                25 NODES ▾
              </span>
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              aria-label="First page"
              className="p-1 rounded hover:bg-[#EDE9E1] text-[#777777] hover:text-[#181818]"
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              aria-label="Previous page"
              className="p-1 rounded hover:bg-[#EDE9E1] text-[#777777] hover:text-[#181818]"
            >
              <ChevronLeft size={14} />
            </button>
            <button className="w-6 h-6 rounded bg-[#A32616] text-white font-bold flex items-center justify-center text-xs">
              1
            </button>
            <button className="w-6 h-6 rounded hover:bg-[#EDE9E1] text-[#555555] hover:text-[#181818] flex items-center justify-center text-xs">
              2
            </button>
            <button className="w-6 h-6 rounded hover:bg-[#EDE9E1] text-[#555555] hover:text-[#181818] flex items-center justify-center text-xs">
              3
            </button>
            <span className="px-1 text-[#999999]">...</span>
            <button className="w-6 h-6 rounded hover:bg-[#EDE9E1] text-[#555555] hover:text-[#181818] flex items-center justify-center text-xs">
              11
            </button>
            <button
              aria-label="Next page"
              className="p-1 rounded hover:bg-[#EDE9E1] text-[#777777] hover:text-[#181818]"
            >
              <ChevronRight size={14} />
            </button>
            <button
              aria-label="Last page"
              className="p-1 rounded hover:bg-[#EDE9E1] text-[#777777] hover:text-[#181818]"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM STATUS BAR */}
      <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#0E0E0E] border border-[#E8E4DC] dark:border-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#666666] gap-2">
        <div className="flex items-center space-x-2">
          <Settings size={13} className="text-[#A32616]" />
          <span>
            AUTOMATED CRON SYNC ACTIVE VIA CF-REST &amp; LC-GQL SCRAPER v4.18
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span>INDEX CHECK: 0x90B3FA</span>
          <a
            href="#"
            className="flex items-center space-x-1 text-[#777777] hover:text-[#A32616] transition-colors"
          >
            <span>RETURN TO TOP</span>
            <ArrowUp size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
