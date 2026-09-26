"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-[#181818] font-sans overflow-hidden">
      {/* Decorative Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#F4F1EA] items-center justify-center border-r border-[#E8E4DC] p-12 overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#181818_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 text-center space-y-8 max-w-lg">
          {/* Brand header badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#DDD8CF] text-xs font-mono text-[#666666] shadow-sm">
            <span className="font-bold text-[#181818]">[CP:^] CodePulse</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF3812] animate-pulse" />
            <span className="text-[#0D8050] font-semibold text-[10px] uppercase">Telemetry Ready</span>
          </div>

          <h2 className="text-5xl font-serif font-bold text-[#181818] leading-[1.15] tracking-tight">
            The Programmer's <br /> 
            <span className="italic font-normal text-[#EF3812]">Second Home.</span>
          </h2>
          <p className="text-[#666666] text-base leading-relaxed font-sans max-w-md mx-auto">
            Aggregate your competitive programming journey across LeetCode, Codeforces, CodeChef, and AtCoder into a single, engineered dashboard.
          </p>
          
          {/* Mock Terminal Card */}
          <div className="mt-8 p-5 rounded-xl bg-white border border-[#E8E4DC] text-left font-mono text-xs space-y-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2 text-[10px] text-[#888888]">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF3812]" />
                <span>CLI_INGESTION_NODE</span>
              </span>
              <span>UTC+00:00</span>
            </div>
            <p className="text-[#EF3812] font-semibold pt-1">$ sync --leetcode handle</p>
            <p className="text-[#777777]">Fetching submissions & rating history...</p>
            <p className="text-[#0D8050] font-bold">[SUCCESS] 42 new problems cataloged</p>
            <p className="text-[#777777]">Updating 52-week activity ledger...</p>
          </div>
        </div>
      </div>

      {/* Form Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAF8F5]">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header Brand */}
          <div className="lg:hidden flex items-center space-x-2">
            <span className="font-mono text-xs text-[#888888]">[CP:^]</span>
            <span className="font-serif font-bold text-xl text-[#181818]">CodePulse</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF3812]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-[#181818] tracking-tight">Welcome Back</h1>
            <p className="text-xs font-mono text-[#777777] uppercase tracking-wider">
              Initialize your telemetry session to continue tracking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#555555] uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" size={16} />
                  <input 
                    type="email" 
                    required
                    placeholder="dev@null.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD8CF] rounded-lg text-xs font-mono text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#EF3812] focus:ring-1 focus:ring-[#EF3812]/20 transition-all shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-bold text-[#555555] uppercase tracking-wider">Password</label>
                  <Link href="#" className="text-[11px] font-mono text-[#EF3812] font-semibold hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" size={16} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD8CF] rounded-lg text-xs font-mono text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#EF3812] focus:ring-1 focus:ring-[#EF3812]/20 transition-all shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[#FDF0EE] border border-[#F8D2CC] text-[#C23C2C] text-xs font-mono font-semibold">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-[#EF3812] hover:bg-[#D42D0B] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 shadow-sm group"
            >
              <span>{loading ? 'Authenticating...' : 'Establish Session'}</span>
              {!loading && <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-xs font-mono text-[#777777]">
            New to the tracker?{' '}
            <Link href="/register" className="text-[#EF3812] font-bold hover:underline">
              Register account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
