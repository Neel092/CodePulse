"use client";

import React from 'react';
import { User, Bell, Shield, Monitor, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SettingsPage() {
  const sections = [
    {
      title: "Account",
      items: [
        { label: "Profile Information", icon: User, href: "/profile", sub: "Manage your display name, bio and location" },
        { label: "Notification Preferences", icon: Bell, sub: "Email and dashboard alerts" },
      ]
    },
    {
      title: "Security",
      items: [
        { label: "Authentication", icon: Shield, sub: "Password and account security" },
      ]
    },
    {
      title: "System",
      items: [
        { label: "Appearance", icon: Monitor, sub: "Dark mode and theme settings" },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-display font-bold text-heading-dark">Control Center</h1>
        <p className="text-muted-dark font-medium">Configure your tracking environment and account.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-sm font-bold text-muted-dark uppercase tracking-widest">{section.title}</h3>
            <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden divide-y divide-border-dark">
              {section.items.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link href={item.href} className="flex items-center justify-between p-6 hover:bg-elevated-dark/50 transition-colors group">
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 rounded-xl bg-elevated-dark text-primary-dark group-hover:scale-110 transition-transform">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground-dark">{item.label}</p>
                          <p className="text-xs text-muted-dark">{item.sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-muted-dark group-hover:text-primary-dark transition-colors" />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between p-6 opacity-60 cursor-not-allowed">
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 rounded-xl bg-elevated-dark text-muted-dark">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground-dark">{item.label}</p>
                          <p className="text-xs text-muted-dark">{item.sub} (Coming Soon)</p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-muted-dark" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
