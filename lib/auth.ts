import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "hlt_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function adminLogin(password: string): Promise<{ error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!adminPassword || !secret) {
    return { error: "ADMIN_PASSWORD e ADMIN_SECRET não configurados no .env.local" };
  }

  if (password !== adminPassword) {
    return { error: "Senha incorreta." };
  }

  const store = await cookies();
  store.set(COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return {};
}

export async function adminLogout() {
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/admin/login");
}

export async function requireAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!token || !secret || token !== secret) {
    redirect("/admin/login");
  }
}
