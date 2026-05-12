"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen flex bg-background-dark overflow-hidden">
      {/* Decorative Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#161310] items-center justify-center border-r border-border-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#D97B3C22,transparent_70%)]" />
        </div>
        
        <div className="relative z-10 text-center space-y-8 p-12">
          <div className="inline-flex p-4 rounded-3xl bg-primary-dark/10 border border-primary-dark/20 text-primary-dark mb-4">
            <Github size={48} />
          </div>
          <h2 className="text-5xl font-display font-bold text-heading-dark leading-tight">
            The Programmer's <br /> 
            <span className="text-primary-dark">Second Home.</span>
          </h2>
          <p className="text-muted-dark max-w-md mx-auto text-lg leading-relaxed">
            Aggregate your competitive programming journey into a single, warm, and purposeful dashboard.
          </p>
          
          {/* Mock Terminal Art */}
          <div className="mt-12 p-6 rounded-xl bg-surface-dark border border-border-dark text-left font-mono text-sm space-y-2 shadow-2xl">
            <p className="text-secondary-dark font-bold">$ sync --leetcode handle</p>
            <p className="text-muted-dark">Fetching submissions...</p>
            <p className="text-primary-dark font-bold">[SUCCESS] 42 new problems solved</p>
            <p className="text-muted-dark">Updating heatmap...</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background-dark">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-heading-dark">Welcome Back</h1>
            <p className="text-muted-dark font-medium">Initialize your session to continue tracking.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-sm font-bold text-muted-dark group-focus-within:text-primary-dark transition-colors">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="dev@null.com"
                    className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark transition-all text-foreground-dark"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-muted-dark group-focus-within:text-primary-dark transition-colors">Password</label>
                  <Link href="#" className="text-xs text-primary-dark font-bold hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark transition-all text-foreground-dark"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-danger-dark/10 border border-danger-dark/20 text-danger-dark text-sm font-bold">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-primary-dark text-background-dark font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all group"
            >
              <span>{loading ? 'Authenticating...' : 'Establish Session'}</span>
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-muted-dark text-sm font-medium">
            New to the tracker? <Link href="/register" className="text-primary-dark font-bold hover:underline">Register account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
