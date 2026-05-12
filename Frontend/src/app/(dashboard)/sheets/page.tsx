"use client";

import React from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SheetsPage() {
  const sheets = [
    { title: "Blind 75", progress: 45, total: 75, status: "In Progress", color: "text-primary-dark" },
    { title: "Striver SDE Sheet", progress: 120, total: 180, status: "In Progress", color: "text-secondary-dark" },
    { title: "NeetCode 150", progress: 0, total: 150, status: "Locked", color: "text-muted-dark", locked: true },
    { title: "Love Babbar 450", progress: 450, total: 450, status: "Completed", color: "text-info-dark", completed: true },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-display font-bold text-heading-dark">Curated Sheets</h1>
        <p className="text-muted-dark font-medium">Master specific domains with these community-vetted problem sets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sheets.map((sheet) => (
          <div key={sheet.title} className="bg-surface-dark border border-border-dark p-6 rounded-2xl group transition-all cursor-not-allowed relative overflow-hidden grayscale opacity-50">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <span className="text-sm font-bold tracking-widest uppercase text-muted-dark border border-muted-dark/30 px-4 py-2 rounded-lg">Coming Soon</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className={cn("p-3 rounded-xl bg-elevated-dark w-fit", sheet.color)}>
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground-dark">{sheet.title}</h3>
                </div>
                {sheet.locked ? (
                  <Lock className="text-muted-dark" size={20} />
                ) : sheet.completed ? (
                  <CheckCircle2 className="text-secondary-dark" size={24} />
                ) : (
                  <Play className="text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-muted-dark">Progress</span>
                  <span className="text-foreground-dark">--%</span>
                </div>
                <div className="h-2 bg-elevated-dark rounded-full overflow-hidden" />
                <p className="text-xs text-muted-dark font-medium">
                  -- of {sheet.total} problems solved
                </p>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <BookOpen size={160} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
