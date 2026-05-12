"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Globe,
  Save,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface ProfileFormData {
  displayName: string;
  location: string;
  college: string;
  graduationYear: string;
  profileDetails: string;
  visibility: 'public' | 'private';
  platforms: Record<string, string>;
}

export default function ProfilePage() {
  const { user, refreshUser, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    setFormData({
      displayName: user.displayName || "",
      location: (user as any).location || "",
      college: (user as any).college || "",
      graduationYear: (user as any).graduationYear || "",
      profileDetails: (user as any).profileDetails || "",
      visibility: (user as any).visibility || "public",
      platforms: { ...(user as any).platforms },
    });
  }, [user]);

  const handleSave = async () => {
    if (!formData) return;

    setLoading(true);
    setStatus(null);

    try {
      await api.put("/api/auth/update-profile", formData);
      await refreshUser();

      setStatus({
        type: "success",
        message: "Profile updated successfully",
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="w-10 h-10 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-3xl bg-elevated-dark border-2 border-primary-dark flex items-center justify-center text-primary-dark text-4xl font-display font-bold">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-heading-dark">{user?.displayName || 'User'}</h1>
            <p className="text-muted-dark font-mono">@{user?.username}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 px-8 py-3 bg-primary-dark text-background-dark font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary-dark/10"
        >
          <Save size={20} />
          <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>

      {status && (
        <div
          className={cn(
            "p-4 rounded-xl flex items-center space-x-3 text-sm font-bold border",
            status.type === 'success' ? "bg-secondary-dark/10 border-secondary-dark/20 text-secondary-dark" : "bg-danger-dark/10 border-danger-dark/20 text-danger-dark"
          )}
        >
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-dark border border-border-dark rounded-xl p-6 space-y-6">
            <h3 className="text-xl font-display font-bold border-b border-border-dark pb-4">Personal Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={16} />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={16} />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">College / University</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={16} />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">Graduation Year</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={16} />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm font-mono"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-dark">Bio / Profile Details</label>
              <textarea
                rows={4}
                className="w-full p-4 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm resize-none"
                value={formData.profileDetails}
                onChange={(e) => setFormData({ ...formData, profileDetails: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Platform Handles */}
        <div className="space-y-8">
          <div className="bg-surface-dark border border-border-dark rounded-xl p-6 space-y-6">
            <h3 className="text-xl font-display font-bold border-b border-border-dark pb-4">Platform Identity</h3>

            <div className="space-y-4">
              {['github', 'leetcode', 'codeforces', 'codechef'].map((plat) => (
                <div key={plat} className="space-y-2 group">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-dark group-focus-within:text-primary-dark capitalize">{plat}</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`${plat} handle`}
                      className="w-full px-4 py-2.5 bg-elevated-dark/50 border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark text-sm font-mono"
                      value={formData.platforms[plat] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        platforms: { ...formData.platforms, [plat]: e.target.value }
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-foreground-dark">Public Profile</h4>
                <p className="text-xs text-muted-dark">Make your profile visible to others.</p>
              </div>
              <button
                onClick={() => setFormData({
                  ...formData,
                  visibility: formData.visibility === 'public' ? 'private' : 'public'
                })}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  formData.visibility === 'public' ? "bg-primary-dark" : "bg-elevated-dark"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 rounded-full bg-background-dark transition-transform",
                  formData.visibility === 'public' ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
