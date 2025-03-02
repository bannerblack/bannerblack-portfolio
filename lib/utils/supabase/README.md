# Database Migrations

This directory contains SQL migration scripts for the Supabase database.

## Running Migrations

To run the migrations, you can use the Supabase CLI or execute the SQL directly in the Supabase dashboard.

### Using Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

3. Run the migration:
   ```bash
   supabase db execute --file lib/utils/supabase/migrations.sql
   ```

### Using Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the `migrations.sql` file
4. Paste into the SQL Editor and run the query

## Migration History

### March 2, 2024 - Add preset_theme column

Added the `preset_theme` column to the `author` table to properly handle custom theme presets. This migration:

1. Adds a new `preset_theme` column to store the name of the preset theme
2. Updates existing records to set `preset_theme` to the current theme value and changes `theme` to 'custom' for records using preset themes ('tokyo-night', 'nord', 'dracula', 'solarized')

This change supports the new theme management system that properly distinguishes between standard themes and custom theme presets. 