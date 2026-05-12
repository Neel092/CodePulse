"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Code2,
  Trophy,
  RefreshCcw,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Problems', href: '/problems', icon: Code2 },
  { name: 'Contests', href: '/contests', icon: Trophy },
  { name: 'Sheets', href: '/sheets', icon: BookOpen },
  { name: 'Sync', href: '/sync', icon: RefreshCcw },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
      <aside
        className={cn(
          "relative z-20 flex flex-col h-full bg-surface-dark border-r border-border-dark transition-all duration-300",
          collapsed ? "w-20" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6">
          {!collapsed && (
            <span className="text-xl font-display font-bold text-primary-dark">
              CP_TRACKER
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-elevated-dark text-muted-dark transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  active ? "bg-elevated-dark text-primary-dark border-l-2 border-primary-dark" : "text-muted-dark hover:bg-elevated-dark/50 hover:text-foreground-dark"
                )}>
                  <item.icon size={22} className={cn("min-w-[22px]", active ? "text-primary-dark" : "group-hover:text-primary-dark")} />
                  {!collapsed && (
                    <span
                      className="ml-4 font-medium transition-opacity"
                    >
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border-dark">
          <div className={cn(
            "flex items-center p-3 rounded-xl bg-elevated-dark/30",
            collapsed ? "justify-center" : "space-x-4"
          )}>
            <div className="w-10 h-10 rounded-full bg-primary-dark/20 flex items-center justify-center text-primary-dark font-bold">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-foreground-dark">{user?.displayName || 'User'}</p>
                <p className="text-xs text-muted-dark truncate">@{user?.username || 'handle'}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-danger-dark/20 text-muted-dark hover:text-danger-dark transition-colors"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
  );
}
