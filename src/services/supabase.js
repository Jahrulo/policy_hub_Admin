import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tzjtsrlobodaxzyoenpn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6anRzcmxvYm9kYXh6eW9lbnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MzI1MDYsImV4cCI6MjA0OTQwODUwNn0.eQLDGchlF1goTFFxXu2rfxqWVW1wGLg7de76jzLXFBo";
export const supabase = createClient(supabaseUrl, supabaseKey);
