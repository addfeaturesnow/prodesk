import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('groups').select('*, leader:leader_id(*)').order('created_at', { ascending: false });
      if (!mounted) return;
      setGroups(data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  async function createGroup(payload: { name: string; leader_id?: string | null; description?: string | null }) {
    const { data, error } = await supabase.from('groups').insert([{
      name: payload.name,
      leader_id: payload.leader_id ?? null,
      description: payload.description ?? null,
    }]).select().single();
    if (!error && data) setGroups((s) => [data, ...s]);
    return { data, error };
  }

  async function addMember(groupId: string, diverId: string, role?: string) {
    const { data, error } = await supabase.from('group_members').insert([{ group_id: groupId, diver_id: diverId, role }]).select().single();
    return { data, error };
  }

  async function removeMember(memberId: string) {
    const { error } = await supabase.from('group_members').delete().eq('id', memberId);
    return { error };
  }

  return { groups, loading, createGroup, addMember, removeMember };
}

export default useGroups;
