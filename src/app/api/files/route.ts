import { proxyRequest } from "@/lib/proxy";

export async function GET() {
  return proxyRequest("GET", "/api/v1/files");
}
