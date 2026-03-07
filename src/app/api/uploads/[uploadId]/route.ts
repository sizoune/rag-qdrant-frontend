import { proxyRequest } from "@/lib/proxy";
import { NextRequest } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  const { uploadId } = await params;
  return proxyRequest("DELETE", `/api/v1/uploads/${uploadId}`);
}
