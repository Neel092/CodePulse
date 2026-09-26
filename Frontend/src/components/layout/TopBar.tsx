"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Clock, User as UserIcon, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function TopBar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [cfCountdown, setCfCountdown] = useState({
    hours: 2,
    minutes: 41,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCfCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <header className="h-16 border-b border-[#E8E4DC] dark:border-white/[0.06] bg-[#FAF8F5]/90 dark:bg-[#0A0A0A]/80 backdrop-blur-md px-6 flex items-center justify-between z-30 shrink-0 sticky top-0 transition-colors">
      {/* Search Input */}
      <div className="relative flex items-center w-80 lg:w-96">
        <Search className="absolute left-3.5 text-[#777777] dark:text-[#666666]" size={15} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problem, ID or tag (/)"
          className="w-full bg-[#FAF8F5] dark:bg-[#131313] border border-[#DDD8CF] dark:border-white/[0.08] rounded-lg pl-10 pr-9 py-2 text-xs text-[#181818] dark:text-[#E5E5E5] placeholder-[#777777] dark:placeholder-[#666666] font-mono focus:outline-none focus:border-[#A32616] focus:ring-1 focus:ring-[#A32616]/20 transition-all duration-200"
        />
        <kbd className="absolute right-3 text-[10px] text-[#777777] dark:text-[#555555] font-mono pointer-events-none px-1.5 py-0.5 rounded bg-[#ECE8E1] dark:bg-white/[0.04] border border-[#DDD8CF] dark:border-white/[0.06]">
          /
        </kbd>
      </div>

      {/* Middle & Right telemetry badges */}
      <div className="flex items-center space-x-5">
        {/* ELO Delta */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-mono">
          <span className="text-[#777777] uppercase tracking-wider text-[11px] font-semibold">
            ELO DELTA:
          </span>
          <span className="text-[#0D8050] font-bold">+48 pts</span>
          <span className="text-[#777777]">(2214)</span>
        </div>

        {/* Live Contest Ticker */}
        <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#141414] border border-[#DDD8CF] dark:border-white/[0.08] text-xs font-mono shadow-sm">
          <Clock size={13} className="text-[#B56804] animate-pulse" />
          <span className="text-[#555555] dark:text-[#D4D4D4] font-medium text-[11px] tracking-wide">
            CF ROUND #920:
          </span>
          <span className="font-bold tracking-widest text-[11px] text-[#181818] dark:text-white">
            {pad(cfCountdown.hours)}h {pad(cfCountdown.minutes)}m{" "}
            {pad(cfCountdown.seconds)}s
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-3 relative">
          
          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#131313] border border-[#DDD8CF] dark:border-white/[0.08] text-[#555555] dark:text-[#888888] hover:text-black dark:hover:text-white hover:border-[#BDB8AE] transition-all relative active:scale-95"
            >
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#A32616] rounded-full" />
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#EFECE6] dark:border-[#222222]">
                  <h3 className="text-sm font-semibold text-[#181818] dark:text-white">Notifications</h3>
                </div>
                <div className="p-4 text-xs text-[#777777] text-center">
                  No new notifications
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Dropdown */}
          <div ref={dropdownRef} className="relative">
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 rounded-full bg-[#EF3812] text-white font-bold text-xs flex items-center justify-center shadow-sm cursor-pointer hover:ring-2 hover:ring-[#EF3812]/40 transition-all active:scale-95"
            >
              <UserIcon size={14} className="text-white" />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111111] border border-[#E8E4DC] dark:border-[#222222] rounded-xl shadow-xl overflow-hidden z-50 py-1">
                <div className="px-4 py-2 border-b border-[#EFECE6] dark:border-[#222222] mb-1">
                  <p className="text-sm font-semibold text-[#181818] dark:text-white">{user?.displayName || "User"}</p>
                  <p className="text-xs text-[#777777] font-mono">@{user?.username || "algotracer"}</p>
                </div>
                
                <Link href="/profile" className="flex items-center px-4 py-2 text-xs text-[#333333] dark:text-gray-300 hover:bg-[#FAF8F5] dark:hover:bg-[#1A1A1A] transition-colors">
                  <UserIcon size={14} className="mr-2 text-[#666666]" />
                  Profile
                </Link>
                
                <Link href="/settings" className="flex items-center px-4 py-2 text-xs text-[#333333] dark:text-gray-300 hover:bg-[#FAF8F5] dark:hover:bg-[#1A1A1A] transition-colors">
                  <Settings size={14} className="mr-2 text-[#666666]" />
                  Settings
                </Link>

                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full flex items-center px-4 py-2 text-xs text-[#333333] dark:text-gray-300 hover:bg-[#FAF8F5] dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  {theme === 'dark' ? <Sun size={14} className="mr-2 text-[#666666]" /> : <Moon size={14} className="mr-2 text-[#666666]" />}
                  {theme === 'dark' ? "Light Mode" : "Dark Mode"}
                </button>

                <div className="h-px bg-[#EFECE6] dark:bg-[#222222] my-1"></div>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center px-4 py-2 text-xs text-[#A32616] hover:bg-[#FDF0EE] dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
