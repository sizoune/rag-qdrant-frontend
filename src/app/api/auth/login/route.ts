import { NextRequest, NextResponse } from "next/server";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still do the comparison to prevent timing attacks based on length
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const expectedUsername = process.env.AUTH_USERNAME ?? "";
  const expectedPassword = process.env.AUTH_PASSWORD ?? "";

  const usernameMatch = safeCompare(username ?? "", expectedUsername);
  const passwordMatch = safeCompare(password ?? "", expectedPassword);

  if (!usernameMatch || !passwordMatch) {
    return NextResponse.json(
      { error: "Nama pengguna atau kata sandi salah" },
      { status: 401 }
    );
  }

  const token = await signToken(username);

  // Mark the cookie Secure only when the client is actually on HTTPS. Behind
  // Traefik (TLS-terminated) X-Forwarded-Proto is "https"; direct HTTP access
  // over Tailscale (host port 13122) is "http", where a Secure cookie would be
  // silently dropped by the browser and login would appear to do nothing.
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttps = forwardedProto
    ? forwardedProto.split(",")[0].trim() === "https"
    : request.nextUrl.protocol === "https:";

  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}
