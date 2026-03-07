import { proxyRequest } from "@/lib/proxy";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const { sourceId } = await params;
  return proxyRequest("GET", `/api/v1/files/${sourceId}`);
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const { sourceId } = await params;
  return proxyRequest("PUT", `/api/v1/files/${sourceId}`);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const { sourceId } = await params;
  return proxyRequest("DELETE", `/api/v1/files/${sourceId}`);
}
