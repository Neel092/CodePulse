import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export interface Contest {
  id: string | number;
  name: string;
  platform: string;
  url: string;
  startTime: string; // ISO string
  duration: number; // seconds
  status?: string;
  rated?: boolean;
}

let cachedContests: Contest[] | null = null;
let fetchPromise: Promise<Contest[]> | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useContests() {
  const [contests, setContests] = useState<Contest[]>(cachedContests || []);
  const [loading, setLoading] = useState<boolean>(!cachedContests);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const fetchContests = async () => {
      const now = Date.now();
      if (cachedContests && now - lastFetchTime < CACHE_TTL) {
        if (mounted) {
          setContests(cachedContests);
          setLoading(false);
        }
        return;
      }

      if (!fetchPromise) {
        fetchPromise = api.get('/api/contests/upcoming').then(res => {
          cachedContests = res.data.data || [];
          lastFetchTime = Date.now();
          return cachedContests as Contest[];
        }).catch(err => {
          fetchPromise = null;
          throw err;
        });
      }

      try {
        const data = await fetchPromise;
        if (mounted) {
          setContests(data);
          setError(false);
        }
      } catch (err) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchContests();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchContests, CACHE_TTL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const refetch = async () => {
    cachedContests = null;
    lastFetchTime = 0;
    fetchPromise = null;
    setLoading(true);
    
    try {
      const res = await api.get('/api/contests/upcoming');
      const data = res.data.data || [];
      cachedContests = data;
      lastFetchTime = Date.now();
      setContests(data);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { contests, loading, error, refetch };
}
