import { proxyRequest } from "@/lib/proxy";

export async function POST() {
  return proxyRequest("POST", "/api/v1/uploads/migrate-to-s3");
}
