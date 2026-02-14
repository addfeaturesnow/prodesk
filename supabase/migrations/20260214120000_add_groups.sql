-- Add groups and group_members tables
CREATE TABLE public.groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    leader_id uuid REFERENCES public.divers(id) ON DELETE
    SET NULL,
        description text,
        created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read groups" ON public.groups FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert groups" ON public.groups FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update groups" ON public.groups FOR
UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete groups" ON public.groups FOR DELETE TO authenticated USING (true);
CREATE TABLE public.group_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    diver_id uuid REFERENCES public.divers(id) ON DELETE CASCADE NOT NULL,
    role text,
    joined_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read group_members" ON public.group_members FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert group_members" ON public.group_members FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update group_members" ON public.group_members FOR
UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete group_members" ON public.group_members FOR DELETE TO authenticated USING (true);