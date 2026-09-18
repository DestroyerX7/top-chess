import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (jwt === undefined) {
    return redirect("/");
  }

  const payload = await verifyJwt<{ admin: boolean }>(jwt);

  if (payload === null || !payload.admin) {
    return redirect("/");
  }

  return <>{children}</>;
}
