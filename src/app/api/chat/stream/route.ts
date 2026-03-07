import { proxyRequest } from "@/lib/proxy";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyRequest("POST", "/api/v1/chat/stream", body, { stream: true });
}
