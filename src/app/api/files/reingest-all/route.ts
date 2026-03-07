import { proxyRequest } from "@/lib/proxy";

export async function POST() {
  return proxyRequest("POST", "/api/v1/files/reingest-all");
}
