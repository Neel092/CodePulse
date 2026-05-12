"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, ExternalLink, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import AddProblemModal from '@/components/problems/AddProblemModal';
import { useToast } from '@/context/ToastContext';

interface Problem {
  problemId: string;
  platform: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'solved' | 'attempted' | 'unsolved';
  notes: string;
  solvedAt?: string;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/progress');
      setProblems(data.progress);
    } catch (error) {
      console.error('Failed to fetch problems', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const STATUS_CYCLE: Record<string, 'unsolved' | 'attempted' | 'solved'> = {
    unsolved: 'attempted', attempted: 'solved', solved: 'unsolved'
  }

  const toggleStatus = async (problemId: string, currentStatus: string, otherFields: any) => {
    const newStatus = STATUS_CYCLE[currentStatus] || 'unsolved'
    const platform = otherFields.platform

    // 1. Update UI immediately
    setProblems(prev => prev.map(p =>
      p.problemId === problemId && p.platform === platform
        ? { ...p, status: newStatus }
        : p
    ))

    try {
      await api.post('/api/progress', {
        problemId,
        platform,
        difficulty: otherFields.difficulty || 'medium',
        status: newStatus,
      })
      toast.success('Status updated')
    } catch {
      // 2. Revert on failure
      setProblems(prev => prev.map(p =>
        p.problemId === problemId && p.platform === platform
          ? { ...p, status: currentStatus as any }
          : p
      ))
      toast.error('Failed to update status')
    }
  }

  // Memoized filters — no re-render on unrelated state changes
  const filteredProblems = React.useMemo(() =>
    problems
      .filter(p => filterPlatform === 'all' || p.platform === filterPlatform)
      .filter(p => filterDifficulty === 'all' || p.difficulty === filterDifficulty)
      .filter(p => filterStatus === 'all' || p.status === filterStatus)
      .filter(p => !search ||
        p.problemId.toLowerCase().includes(search.toLowerCase()) ||
        p.platform.toLowerCase().includes(search.toLowerCase())
      ),
    [problems, filterPlatform, filterDifficulty, filterStatus, search]
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-heading-dark">Problem Ledger</h1>
          <p className="text-muted-dark font-medium">Tracking your conquest of algorithms.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-dark text-background-dark font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          <span>Add Problem</span>
        </button>
      </div>

      <AddProblemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProblems}
      />

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative group md:col-span-2 lg:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark group-focus-within:text-primary-dark transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Problem ID..." 
            className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark transition-all font-mono text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
          <select 
            className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark appearance-none text-sm font-medium"
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">Codeforces</option>
            <option value="codechef">CodeChef</option>
            <option value="gfg">GeeksForGeeks</option>
          </select>
        </div>
        <div className="relative">
          <select 
            className="w-full px-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark appearance-none text-sm font-medium"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="relative">
          <select 
            className="w-full px-4 py-3 bg-surface-dark border border-border-dark rounded-xl focus:outline-none focus:border-primary-dark appearance-none text-sm font-medium"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="solved">Solved</option>
            <option value="attempted">Attempted</option>
            <option value="unsolved">Unsolved</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-dark bg-elevated-dark/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-dark">Problem ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-dark">Platform</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-dark">Difficulty</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-dark">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
                {filteredProblems.map((problem, idx) => (
                  <tr 
                    key={`${problem.problemId}-${problem.platform}`}
                    className="group hover:bg-elevated-dark/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm font-bold text-foreground-dark">{problem.problemId}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-xs font-bold uppercase px-2 py-1 rounded-md",
                        problem.platform === 'leetcode' ? "text-[#FFA116] bg-[#FFA116]/10" : 
                        problem.platform === 'codeforces' ? "text-info-dark bg-info-dark/10" : 
                        problem.platform === 'codechef' ? "text-[#8B5A2B] bg-[#8B5A2B]/10" :
                        "text-secondary-dark bg-secondary-dark/10"
                      )}>
                        {problem.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {!(problem.platform === 'codeforces' || problem.platform === 'codechef') && (
                        <span className={cn(
                          "text-xs font-bold uppercase px-2 py-1 rounded-md",
                          problem.difficulty === 'easy' ? "text-secondary-dark bg-secondary-dark/15" :
                          problem.difficulty === 'medium' ? "text-warning-dark bg-warning-dark/15" :
                          "text-danger-dark bg-danger-dark/15"
                        )}>
                          {problem.difficulty}
                        </span>
                      )}
                      {(problem.platform === 'codeforces' || problem.platform === 'codechef') && (
                        <span className="text-xs text-muted-dark italic font-medium">Platform Rating</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(problem.problemId, problem.status, { platform: problem.platform, difficulty: problem.difficulty })}
                        className="flex items-center space-x-2 hover:bg-elevated-dark px-2 py-1 rounded transition-colors"
                      >
                        {problem.status === 'solved' ? (
                          <CheckCircle2 size={16} className="text-secondary-dark" />
                        ) : problem.status === 'attempted' ? (
                          <Clock size={16} className="text-warning-dark" />
                        ) : (
                          <AlertCircle size={16} className="text-muted-dark" />
                        )}
                        <span className="text-xs font-bold capitalize">{problem.status}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-elevated-dark rounded-lg text-muted-dark hover:text-foreground-dark transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          
          {filteredProblems.length === 0 && !loading && (
            <div className="py-20 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-elevated-dark text-muted-dark">
                <Search size={32} />
              </div>
              <div>
                <p className="text-foreground-dark font-bold">No problems found</p>
                <p className="text-muted-dark text-sm cursor-pointer hover:underline text-[#D97B3C]" onClick={() => setIsModalOpen(true)}>add your first problem</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
