"use client";

import React, { useState } from "react";
import { X, Send, AlertCircle, Code2 } from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProblemModal({
  isOpen,
  onClose,
  onSuccess,
}: AddProblemModalProps) {
  const [formData, setFormData] = useState({
    problemId: "",
    platform: "leetcode",
    difficulty: "medium",
    status: "solved",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      problemId: "",
      platform: "leetcode",
      difficulty: "medium",
      status: "solved",
      notes: "",
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/api/progress", formData);

      onSuccess();
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add problem");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#242424] rounded-xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E4DC] dark:border-[#1C1C1C] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#141414]">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A32616]" />
            <h3 className="text-base font-serif font-bold text-[#181818] dark:text-white tracking-tight">
              Add Node to Algorithmic Ledger
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#777777] hover:text-[#181818] dark:hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg flex items-center space-x-2 text-[#EF4444] text-xs font-mono font-bold">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                PROBLEM IDENTIFIER / NAME
              </label>

              <input
                autoFocus
                required
                type="text"
                placeholder="e.g. 15. 3Sum or 1800E"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#777777] focus:outline-none focus:border-[#A32616] text-xs"
                value={formData.problemId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    problemId: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                  PLATFORM
                </label>

                <select
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] focus:outline-none focus:border-[#A32616] text-xs"
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platform: e.target.value,
                    })
                  }
                >
                  <option value="leetcode">LeetCode</option>
                  <option value="codeforces">Codeforces</option>
                  <option value="codechef">CodeChef</option>
                  <option value="atcoder">AtCoder</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                  DIFFICULTY
                </label>

                <select
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] focus:outline-none focus:border-[#A32616] text-xs"
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value,
                    })
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                STATUS / VERDICT
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "solved", label: "SOLVED (AC)" },
                  { key: "attempted", label: "ATTEMPTED" },
                  { key: "unsolved", label: "TODO" },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: s.key,
                      })
                    }
                    className={cn(
                      "py-2 rounded-md border text-[11px] font-bold transition-all",
                      formData.status === s.key
                        ? "bg-[#A32616] border-[#A32616] text-white"
                        : "bg-[#FAF8F5] dark:bg-[#161616] border-[#DDD8CF] dark:border-[#262626] text-[#555555] dark:text-[#777777] hover:text-[#181818] dark:hover:text-white"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                DOMAIN TAGS &amp; HEURISTICS (OPTIONAL)
              </label>

              <textarea
                rows={3}
                placeholder="e.g. Tree DP, O(N log N) runtime, 24ms"
                className="w-full p-3 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#777777] focus:outline-none focus:border-[#A32616] text-xs resize-none"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#A32616] hover:bg-[#8E1F11] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}

            <span>{loading ? "COMMITTING TO LEDGER..." : "COMMIT ENTRY"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
