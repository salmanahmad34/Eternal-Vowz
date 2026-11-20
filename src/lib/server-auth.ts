import { NextRequest } from 'next/server';
import { User } from '@supabase/supabase-js';
import { getSupabaseAdmin } from './supabase-admin';

/**
 * Cryptographically verifies the Supabase JWT Bearer token sent in the Authorization header.
 * Never trust client-supplied user_id or email fields in JSON bodies — always use this helper.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  if (!token || token.length < 20) {
    return null;
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return null;
    }
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Ensures internal redirect targets cannot be abused for Open Redirect attacks.
 */
export function sanitizeInternalPath(rawPath: string | null | undefined, fallback = '/dashboard'): string {
  if (!rawPath || typeof rawPath !== 'string') return fallback;
  const trimmed = rawPath.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return fallback;
  }
  return trimmed;
}
