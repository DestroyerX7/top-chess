import { signJwt } from "@/lib/jwt";

export default async function Home() {
  const jwt = await signJwt({ admin: true });

  return <p>{jwt}</p>;
}
