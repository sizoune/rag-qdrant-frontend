import { proxyRequest } from "@/lib/proxy";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("page_size") || "10";
  return proxyRequest("GET", `/api/v1/files?page=${page}&page_size=${pageSize}`);
}
