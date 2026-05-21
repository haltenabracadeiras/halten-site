import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

function loadEnvVar(name: string): string | undefined {
  const value = process.env[name];
  if (value) return value;

  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return undefined;

  const content = readFileSync(envPath, "utf8");
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${name}=`));

  if (!line) return undefined;
  return line.split("=").slice(1).join("=").trim();
}

/**
 * Returns a Supabase client.
 *
 * Pass `{ serviceRole: true }` in Server Components to bypass RLS
 * using the service role key. The key is never exposed to the browser
 * because this file is only imported server-side.
 *
 * Fallback: if no service role key is configured, the anon key is used
 * and RLS policies on the tables must allow public SELECT.
 */
export function getSupabaseClient(options?: { serviceRole?: boolean }) {
  const url =
    loadEnvVar("SUPABASE_URL") ?? loadEnvVar("NEXT_PUBLIC_SUPABASE_URL");

  const serviceKey = loadEnvVar("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey =
    loadEnvVar("SUPABASE_ANON_KEY") ?? loadEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url) throw new Error("SUPABASE_URL is required.");

  const useServiceRole = options?.serviceRole && serviceKey;
  const key = useServiceRole ? serviceKey! : anonKey;

  if (!key) throw new Error("Supabase anon key is required.");

  return createClient(url, key);
}

/** Convenience wrapper — always uses service role if available */
export function getSupabaseAdmin() {
  return getSupabaseClient({ serviceRole: true });
}
