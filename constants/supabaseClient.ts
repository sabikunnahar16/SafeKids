import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awmqbimsxqoeqiurfplb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bXFiaW1zeHFvZXFpdXJmcGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDE0ODEsImV4cCI6MjA2NjQxNzQ4MX0.QmpsSI9X1ZXcqvmp5wEFKNLBGeSKWjIF7TnqXKOcaxQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
