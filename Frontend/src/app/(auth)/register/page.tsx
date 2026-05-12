"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen flex bg-background-dark overflow-hidden">
      {/* Decorative Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#161310] items-center justify-center border-r border-border-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#D97B3C22,transparent_70%)]" />
        </div>
        
        <div className="relative z-10 text-center space-y-8 p-12">
          <div className="inline-flex p-4 rounded-3xl bg-primary-dark/10 border border-primary-dark/20 text-primary-dark mb-4">
            <User size={48} />
          </div>
          <h2 className="text-5xl font-display font-bold text-heading-dark leading-tight">
            Join the <br /> 
            <span className="text-primary-dark">Conquest.</span>
          </h2>
          <p className="text-muted-dark max-w-md mx-auto text-lg leading-relaxed">
            Create your account to start aggregating your competitive programming milestones.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background-dark">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-heading-dark">Create Account</h1>
            <p className="text-muted-dark font-medium">Begin your journey with the terminal warmth.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-sm font-bold text-muted-dark group-focus-within:text-primary-dark transition-colors">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="coder_42"
                    className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark transition-all text-foreground-dark"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-muted-dark group-focus-within:text-primary-dark transition-colors">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="dev@null.com"
                    className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark transition-all text-foreground-dark"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-muted-dark group-focus-within:text-primary-dark transition-colors">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark transition-all text-foreground-dark"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
              <span>{loading ? 'Creating Account...' : 'Initialize Profile'}</span>
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-muted-dark text-sm font-medium">
            Already have an account? <Link href="/login" className="text-primary-dark font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
