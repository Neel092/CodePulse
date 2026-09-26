"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/register', formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-[#181818] font-sans overflow-hidden">
      {/* Decorative Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#F4F1EA] items-center justify-center border-r border-[#E8E4DC] p-12 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#181818_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 text-center space-y-8 max-w-lg">
          {/* Brand header badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#DDD8CF] text-xs font-mono text-[#666666] shadow-sm">
            <span className="font-bold text-[#181818]">[CP:^] CodePulse</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF3812] animate-pulse" />
            <span className="text-[#0D8050] font-semibold text-[10px] uppercase">Join Conquest</span>
          </div>

          <h2 className="text-5xl font-serif font-bold text-[#181818] leading-[1.15] tracking-tight">
            Join the <br /> 
            <span className="italic font-normal text-[#EF3812]">Conquest.</span>
          </h2>
          <p className="text-[#666666] text-base leading-relaxed font-sans max-w-md mx-auto">
            Create your account to start aggregating your competitive programming milestones in real-time.
          </p>

          {/* Mock Terminal Card */}
          <div className="mt-8 p-5 rounded-xl bg-white border border-[#E8E4DC] text-left font-mono text-xs space-y-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2 text-[10px] text-[#888888]">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF3812]" />
                <span>PROFILE_INIT_NODE</span>
              </span>
              <span>UTC+00:00</span>
            </div>
            <p className="text-[#EF3812] font-semibold pt-1">$ init --profile new_coder</p>
            <p className="text-[#777777]">Generating telemetry keys & encrypting sessions...</p>
            <p className="text-[#0D8050] font-bold">[READY] Single-pane ledger activated</p>
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
            <h1 className="text-3xl font-serif font-bold text-[#181818] tracking-tight">Create Account</h1>
            <p className="text-xs font-mono text-[#777777] uppercase tracking-wider">
              Begin your journey with single-pane telemetry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#555555] uppercase tracking-wider">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" size={16} />
                  <input 
                    type="text" 
                    required
                    placeholder="coder_42"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD8CF] rounded-lg text-xs font-mono text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#EF3812] focus:ring-1 focus:ring-[#EF3812]/20 transition-all shadow-sm"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#555555] uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" size={16} />
                  <input 
                    type="email" 
                    required
                    placeholder="dev@null.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD8CF] rounded-lg text-xs font-mono text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#EF3812] focus:ring-1 focus:ring-[#EF3812]/20 transition-all shadow-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#555555] uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" size={16} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD8CF] rounded-lg text-xs font-mono text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#EF3812] focus:ring-1 focus:ring-[#EF3812]/20 transition-all shadow-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
              <span>{loading ? 'Creating Account...' : 'Initialize Profile'}</span>
              {!loading && <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-xs font-mono text-[#777777]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#EF3812] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
