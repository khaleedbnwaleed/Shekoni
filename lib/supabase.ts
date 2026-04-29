import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Lazy initialize clients
let supabase: ReturnType<typeof createClient> | null = null;
let supabaseServer: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  // Client for browser (use anon key)
  supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Client for server-side operations (use service role key if available)
  supabaseServer = createClient(
    supabaseUrl,
    supabaseServiceKey || supabaseAnonKey
  );
}

// Export getter functions
export function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase not initialized. Missing environment variables.');
  }
  return supabase;
}

export function getSupabaseServer() {
  if (!supabaseServer) {
    throw new Error('Supabase server not initialized. Missing environment variables.');
  }
  return supabaseServer;
}

// For backward compatibility, export objects (but they may be null)
export { supabase, supabaseServer };

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata?: any;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone_number: string | null;
          first_name: string;
          last_name: string;
          user_type: 'patient' | 'doctor' | 'admin' | 'staff';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          appointment_date: string;
          appointment_time: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['appointments']['Row']>;
      };
      departments: {
        Row: {
          id: string;
          name: string;
          description: string;
          phone: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['departments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['departments']['Row']>;
      };
      doctors: {
        Row: {
          id: string;
          user_id: string;
          license_number: string;
          specialization: string;
          department_id: string;
          bio: string | null;
          consultation_fee: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['doctors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['doctors']['Row']>;
      };
    };
  };
}