"use server";

import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function loginAdmin(adminPassword: string) {
  if (adminPassword !== "12345678") {
    return;
  }

  const jwt = await signJwt({ admin: true });
  const cookieStore = await cookies();
  cookieStore.set("jwt", jwt, {
    httpOnly: true,
    maxAge: 60 * 60,
    sameSite: "lax",
    secure: true,
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
}
