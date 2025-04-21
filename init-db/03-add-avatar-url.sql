-- Add avatar_url column to user_preferences table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_preferences' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE user_preferences ADD COLUMN avatar_url TEXT;
    END IF;
END $$;
