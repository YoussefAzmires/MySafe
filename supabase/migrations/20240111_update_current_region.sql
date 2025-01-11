-- Drop the existing table if it exists
DROP TABLE IF EXISTS public.current_region;

-- Create the table with the new structure
CREATE TABLE public.current_region (
    id integer PRIMARY KEY,
    name text NOT NULL,
    incident_ids text[] DEFAULT '{}'::text[]
);

-- Set up RLS policies
ALTER TABLE public.current_region ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.current_region
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert/update for authenticated users" ON public.current_region
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');