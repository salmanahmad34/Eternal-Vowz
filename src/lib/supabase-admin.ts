import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase Admin client using SUPABASE_SERVICE_ROLE_KEY.
 * ONLY import this inside Next.js API Route Handlers or Server Actions.
 * Never import into Client Components.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    supabaseUrl.includes('your-project-ref') ||
    serviceRoleKey.includes('your-supabase')
  ) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
