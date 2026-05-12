"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  subtext?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary-dark",
  subtext,
}: StatCardProps) {
  return (
    <div
      className="flex flex-col space-y-4 rounded-xl border border-border-dark bg-surface-dark p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(217,123,60,0.08)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-dark">
          {label}
        </span>

        <div
          className={cn(
            "rounded-lg bg-elevated-dark p-2",
            color
          )}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline space-x-2">
          <span
            className={cn(
              "mono-stat font-mono text-4xl font-bold",
              color
            )}
          >
            {value}
          </span>

          {subtext && (
            <span className="text-sm text-muted-dark">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}