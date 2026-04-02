-- migration_add_status_to_memberships.sql
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Add the "status" column if it doesn't already exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='memberships' AND column_name='status') THEN
        ALTER TABLE memberships ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
    END IF;
END $$;

-- 2. Populate "status" from "is_active" (if is_active exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='memberships' AND column_name='is_active') THEN
        -- If is_active is true, status is 'active' (default)
        -- If is_active is false, status is 'expired' or 'cancelled' (we'll use 'expired' as default)
        UPDATE memberships SET status = 'expired' WHERE is_active = false;
        
        -- Optionally: Keep is_active but sync it (Optional - commenting out to prevent complexity during first migration)
        -- UPDATE memberships SET is_active = (status = 'active');
    END IF;
END $$;

-- 3. (Optional) Remove the is_active column if you want a cleaner schema (Uncomment only after confirming migration)
-- ALTER TABLE memberships DROP COLUMN is_active;

-- 4. Verify existing data matches unified_schema constraints
-- Ensure status is one of ('active', 'cancelled', 'expired')
ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_status_check;
ALTER TABLE memberships ADD CONSTRAINT memberships_status_check CHECK (status IN ('active', 'cancelled', 'expired'));
