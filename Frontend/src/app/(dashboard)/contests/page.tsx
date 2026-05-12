"use client";

import React from 'react';
import { Trophy, Timer, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContestCalendarDashboard from '@/components/contests/ContestCalendarDashboard';

export default function ContestsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-heading-dark">Contest Arena</h1>
          <p className="text-muted-dark font-medium">Tracking your performance across competitive platforms.</p>
        </div>
        <div className="bg-primary-dark/10 border border-primary-dark/20 px-4 py-2 rounded-xl text-primary-dark flex items-center space-x-2">
          <Trophy size={18} />
          <span className="font-bold">Pro Tier</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 grayscale">
        {[
          { label: "Max Rating", value: "---", icon: Star, color: "text-warning-dark" },
          { label: "Total Contests", value: "---", icon: Timer, color: "text-secondary-dark" },
          { label: "Avg Rank", value: "---", icon: Trophy, color: "text-primary-dark" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center space-x-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-dark">Coming Soon</span>
            </div>
            <div className={cn("p-3 rounded-xl bg-elevated-dark", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-muted-dark font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-foreground-dark">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <ContestCalendarDashboard />
    </div>
  );
}
