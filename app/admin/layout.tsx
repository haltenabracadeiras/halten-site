import { createSupabaseServerClient } from "../../lib/supabase-server";
import { AdminSidebar } from "./AdminSidebar";

export const metadata = { title: "Admin — Halten" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sem usuário: o middleware redireciona; renderiza children para /login não quebrar
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
