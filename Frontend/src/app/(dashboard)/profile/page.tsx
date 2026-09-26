"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Save,
  CheckCircle2,
  AlertTriangle,
  Github,
  Code2,
  RefreshCw,
  Globe,
  Sparkles,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface ProfileFormData {
  displayName: string;
  location: string;
  college: string;
  graduationYear: string;
  profileDetails: string;
  visibility: "public" | "private";
  coverImage?: string;
  hideCoverImage?: boolean;
  platforms: {
    github?: string;
    leetcode?: string;
    codeforces?: string;
    codechef?: string;
    [key: string]: string | undefined;
  };
}

export default function ProfilePage() {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: "",
    location: "",
    college: "",
    graduationYear: "",
    profileDetails: "",
    visibility: "public",
    coverImage: "",
    hideCoverImage: false,
    platforms: {
      github: "github handle",
      leetcode: "Tushar_waghmare12",
      codeforces: "neelpatil092",
      codechef: "compiler7",
    },
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    setFormData({
      displayName: user.displayName || "User",
      location: (user as any).location || "",
      college: (user as any).college || "",
      graduationYear: (user as any).graduationYear || "",
      profileDetails: (user as any).profileDetails || "",
      visibility: (user as any).visibility || "public",
      coverImage: (user as any).coverImage || "",
      hideCoverImage: (user as any).hideCoverImage || false,
      platforms: {
        github: (user as any).platforms?.github || "github handle",
        leetcode: (user as any).platforms?.leetcode || "Tushar_waghmare12",
        codeforces: (user as any).platforms?.codeforces || "neelpatil092",
        codechef: (user as any).platforms?.codechef || "compiler7",
      },
    });
  }, [user]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await api.put("/api/auth/update-profile", formData);
      if (refreshUser) await refreshUser();

      setStatus({
        type: "success",
        message: "Profile and platform telemetry saved successfully",
      });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update profile";
      setStatus({
        type: "error",
        message: msg,
      });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      visibility: prev.visibility === "public" ? "private" : "public",
    }));
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* COVER IMAGE */}
      {!formData.hideCoverImage && formData.coverImage && (
        <div 
          className="w-full h-48 md:h-64 rounded-2xl bg-cover bg-center border border-[#E8E4DC] dark:border-[#1C1C1C] shadow-sm mb-4"
          style={{ backgroundImage: `url(${formData.coverImage})` }}
        />
      )}

      {/* HEADER WITH AVATAR & SAVE BUTTON */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E4DC] dark:border-[#1C1C1C]">
        <div className="flex items-center space-x-5">
          {/* Avatar Container */}
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#141414] border-2 border-[#A32616] flex items-center justify-center text-[#181818] dark:text-white text-3xl font-serif font-bold shadow-sm relative">
            <span>{formData.displayName ? formData.displayName.charAt(0).toUpperCase() : "U"}</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0D8050] border-2 border-white dark:border-[#080808]" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-serif font-bold text-[#181818] dark:text-white tracking-tight">
                {formData.displayName || "User"}
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#0D8050]/10 text-[#0D8050] font-mono text-[10px] font-bold">
                Grandmaster
              </span>
            </div>
            <p className="text-xs font-mono text-[#777777] dark:text-[#777777] mt-0.5">
              @{user?.username || "algotracer"}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#A32616] hover:bg-[#8B2012] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>{loading ? "SAVING..." : "Save Profile"}</span>
        </button>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-3 text-xs font-mono font-bold border ${
            status.type === "success"
              ? "bg-[#0D8050]/10 border-[#0D8050]/30 text-[#0D8050]"
              : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* TWO-COLUMN FORM LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Personal Details (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="border-b border-[#E8E4DC] dark:border-[#1C1C1C] pb-3">
            <h3 className="text-xl font-serif font-bold text-[#181818] dark:text-white">
              Personal Details
            </h3>
            <p className="text-[11px] font-mono text-[#777777] dark:text-[#777777] mt-0.5">
              General identifier and academic credentials.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-[#777777]">
                  DISPLAY NAME
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] dark:text-[#555555]" size={14} />
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-[#777777]">
                  LOCATION
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] dark:text-[#555555]" size={14} />
                  <input
                    type="text"
                    placeholder="City, Country"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-[#777777]">
                  COLLEGE / UNIVERSITY
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] dark:text-[#555555]" size={14} />
                  <input
                    type="text"
                    placeholder="Institution Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                    value={formData.college}
                    onChange={(e) =>
                      setFormData({ ...formData, college: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-[#777777]">
                  GRADUATION YEAR
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] dark:text-[#555555]" size={14} />
                  <input
                    type="text"
                    placeholder="2026"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                    value={formData.graduationYear}
                    onChange={(e) =>
                      setFormData({ ...formData, graduationYear: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-[#777777]">
                BIO / PROFILE DETAILS
              </label>
              <textarea
                rows={4}
                placeholder="Competitive programmer, algorithms researcher, candidate master..."
                className="w-full p-3.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs resize-none"
                value={formData.profileDetails}
                onChange={(e) =>
                  setFormData({ ...formData, profileDetails: e.target.value })
                }
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-[#777777]">
                  COVER IMAGE URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] dark:text-[#555555]" size={14} />
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                    value={formData.coverImage || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5 flex flex-col justify-center pt-5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#A32616]"
                    checked={formData.hideCoverImage || false}
                    onChange={(e) =>
                      setFormData({ ...formData, hideCoverImage: e.target.checked })
                    }
                  />
                  <span className="text-[11px] font-bold text-[#666666] dark:text-[#777777] uppercase tracking-wider">
                    Make Completely Not Visible
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Platform Identity (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] p-6 space-y-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="space-y-6">
            <div className="border-b border-[#E8E4DC] dark:border-[#1C1C1C] pb-3">
              <h3 className="text-xl font-serif font-bold text-[#181818] dark:text-white">
                Platform Identity
              </h3>
              <p className="text-[11px] font-mono text-[#777777] dark:text-[#777777] mt-0.5">
                Handles used for automatic daemon ingestion.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-[#777777]">
                  GITHUB
                </label>
                <input
                  type="text"
                  placeholder="github handle"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                  value={formData.platforms.github || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platforms: { ...formData.platforms, github: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#FFA116]">
                  LEETCODE
                </label>
                <input
                  type="text"
                  placeholder="Tushar_waghmare12"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                  value={formData.platforms.leetcode || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platforms: { ...formData.platforms, leetcode: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6]">
                  CODEFORCES
                </label>
                <input
                  type="text"
                  placeholder="neelpatil092"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                  value={formData.platforms.codeforces || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platforms: { ...formData.platforms, codeforces: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#EAB308]">
                  CODECHEF
                </label>
                <input
                  type="text"
                  placeholder="compiler7"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#161616] border border-[#DDD8CF] dark:border-[#262626] rounded-lg text-[#181818] dark:text-[#E0E0E0] placeholder-[#888888] focus:outline-none focus:border-[#A32616]/60 text-xs"
                  value={formData.platforms.codechef || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platforms: { ...formData.platforms, codechef: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Public Profile Toggle */}
          <div className="pt-4 border-t border-[#E8E4DC] dark:border-[#1C1C1C] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#181818] dark:text-white font-serif">
                Public Profile
              </p>
              <p className="text-[10px] font-mono text-[#888888] dark:text-[#666666]">
                Make your profile visible to others
              </p>
            </div>

            <button
              type="button"
              onClick={toggleVisibility}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                formData.visibility === "public" ? "bg-[#A32616]" : "bg-[#DDD8CF] dark:bg-[#222222]"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.visibility === "public" ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
