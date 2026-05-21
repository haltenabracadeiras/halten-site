"use server";

import { adminLogin } from "../../../lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const password = (formData.get("password") as string) ?? "";
  const result = await adminLogin(password);

  if (result.error) return result;

  redirect("/admin/dashboard");
}
