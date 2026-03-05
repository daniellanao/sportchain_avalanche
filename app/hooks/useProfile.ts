'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/profiles';

export function useProfile(userId: string | undefined, userEmail: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (fetchError) {
      setError(fetchError.message);
      setProfile(null);
    } else {
      setProfile(data as Profile | null);
    }
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    if (!userId || !userEmail) {
      setLoading(false);
      setProfile(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const { data: existing, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (existing) {
        setProfile(existing as Profile);
        setLoading(false);
        return;
      }

      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          first_name: '',
          last_name: '',
        })
        .select()
        .single();

      if (cancelled) return;

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      setProfile(inserted as Profile);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [userId, userEmail, supabase]);

  return { profile, loading, error, refetch };
}
