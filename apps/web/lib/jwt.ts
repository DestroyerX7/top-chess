import { JWTPayload, jwtVerify, SignJWT } from "jose";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signJwt(
  payload?: JWTPayload,
  expirationTime: string = "1h",
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationTime)
    .sign(key);
}

export async function verifyJwt<T>(jwt: string) {
  try {
    const { payload } = await jwtVerify<T>(jwt, key, {
      algorithms: ["HS256"],
      typ: "JWT",
    });

    return payload;
  } catch {
    return null;
  }
}
