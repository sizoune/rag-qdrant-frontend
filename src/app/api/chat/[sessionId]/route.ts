import { proxyRequest } from "@/lib/proxy";
import { NextRequest } from "next/server";

// Reset server-side conversation history for a session (backend keeps it in
// memory keyed by session_id). The static "stream" route takes precedence over
// this dynamic segment, so DELETE /api/chat/<id> never collides with it.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  return proxyRequest(
    "DELETE",
    `/api/v1/chat/${encodeURIComponent(sessionId)}`
  );
}
