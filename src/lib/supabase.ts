
import { createClient } from '@supabase/supabase-js';

// Supabase connection details - replace these with your own values when connected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ResourceInsert = Omit<Resource, 'id' | 'uploadDate'>;

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  semester: number;
  uploadDate: string;
  fileUrl: string;
  created_at?: string;
}

// Type for admin users
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at?: string;
}
