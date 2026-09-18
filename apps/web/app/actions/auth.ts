"use server";

import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

const hashedAdminPassword = process.env.HASHED_ADMIN_PASSWORD!;

export async function loginAdmin(adminPassword: string): Promise<
  | {
      success: true;
      data: {
        jwt: string;
      };
    }
  | {
      success: false;
      error: {
        message: string;
      };
    }
> {
  const matches = await bcrypt.compare(adminPassword, hashedAdminPassword);

  if (!matches) {
    return { success: false, error: { message: "Incorrect password" } };
  }

  const jwt = await signJwt({ admin: true });
  const cookieStore = await cookies();
  cookieStore.set("jwt", jwt, {
    httpOnly: true,
    maxAge: 60 * 60,
    sameSite: "lax",
    secure: true,
  });

  return { success: true, data: { jwt } };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
}
