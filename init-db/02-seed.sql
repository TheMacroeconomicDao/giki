-- Create admin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin') THEN
    INSERT INTO users (address, name, email, role)
    VALUES ('0x8ba1f109551bD432803012645Ac136ddd64DBA72', 'Admin User', 'admin@giki.js', 'admin');
  END IF;
END
$$;

-- Initialize default settings
INSERT INTO settings (key, value, description)
VALUES 
  ('SITE_NAME', 'Giki.js', 'The name of the site'),
  ('SITE_DESCRIPTION', 'Next-Generation Wiki Platform', 'A short description of the site'),
  ('DEFAULT_LANGUAGE', 'en', 'The default language for the site'),
  ('ALLOWED_LANGUAGES', 'en,es,fr,de,ru', 'Comma-separated list of allowed languages'),
  ('ENABLE_PUBLIC_REGISTRATION', 'true', 'Whether to allow public registration'),
  ('ENABLE_GITHUB_SYNC', 'true', 'Whether to enable GitHub synchronization'),
  ('ENABLE_AI_TRANSLATION', 'true', 'Whether to enable AI translation')
ON CONFLICT (key) DO NOTHING;
