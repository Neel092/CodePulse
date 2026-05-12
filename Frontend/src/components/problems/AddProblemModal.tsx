"use client";

import React, { useState } from "react";
import { X, Send, AlertCircle } from "lucide-react";
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
        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg bg-surface-dark border border-border-dark rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between bg-elevated-dark/50">
          <h3 className="text-xl font-display font-bold">Add to Ledger</h3>

          <button
            onClick={onClose}
            className="p-1 hover:bg-elevated-dark rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-danger-dark/10 border border-danger-dark/20 rounded-xl flex items-center space-x-2 text-danger-dark text-sm font-bold">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">
                Problem ID / Name
              </label>

              <input
                autoFocus
                required
                type="text"
                placeholder="e.g. Two Sum or 123A"
                className="w-full px-4 py-3 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm font-mono"
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
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">
                  Platform
                </label>

                <select
                  className="w-full px-4 py-3 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm font-medium"
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
                  <option value="gfg">GeeksForGeeks</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">
                  Difficulty
                </label>

                <select
                  className="w-full px-4 py-3 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm font-medium"
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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">
                Status
              </label>

              <div className="grid grid-cols-3 gap-2">
                {["solved", "attempted", "unsolved"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: s,
                      })
                    }
                    className={cn(
                      "py-2 rounded-lg border text-xs font-bold capitalize transition-all",
                      formData.status === s
                        ? "bg-primary-dark border-primary-dark text-background-dark"
                        : "bg-elevated-dark border-border-dark text-muted-dark hover:border-muted-dark"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">
                Notes (Optional)
              </label>

              <textarea
                rows={3}
                placeholder="Key concepts, complexity, etc."
                className="w-full p-4 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm resize-none"
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
            className="w-full flex items-center justify-center space-x-2 py-4 bg-primary-dark text-background-dark font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary-dark/10"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}

            <span>{loading ? "Adding..." : "Add Problem"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}