-- Add preset_theme column to author table
ALTER TABLE author ADD COLUMN IF NOT EXISTS preset_theme TEXT;

-- Update existing records with preset themes
UPDATE author 
SET preset_theme = theme, theme = 'custom'
WHERE theme IN ('tokyo-night', 'nord', 'dracula', 'solarized'); 