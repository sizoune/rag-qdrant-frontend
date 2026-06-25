import { proxyRequest } from "@/lib/proxy";
import { NextRequest } from "next/server";

// Teruskan semua query param apa adanya — backend memvalidasi sort_by/sort_dir
// (Literal) & mengabaikan yang tak dikenal. Param yang didukung: page, page_size,
// search, source_type, in_s3, sort_by, sort_dir.
export async function GET(request: NextRequest) {
  const qs = request.nextUrl.searchParams.toString();
  return proxyRequest("GET", `/api/v1/files${qs ? `?${qs}` : ""}`);
}
