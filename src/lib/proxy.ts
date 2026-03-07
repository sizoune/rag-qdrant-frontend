import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";
const API_BEARER_TOKEN = process.env.API_BEARER_TOKEN || "";

export async function proxyRequest(
  method: string,
  path: string,
  body?: unknown,
  options?: { stream?: boolean; contentType?: string; rawBody?: BodyInit }
): Promise<Response> {
  const url = `${BACKEND_API_URL}${path}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${API_BEARER_TOKEN}`,
  };

  if (body && !options?.rawBody) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: options?.rawBody ?? (body ? JSON.stringify(body) : undefined),
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (options?.stream) {
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal terhubung ke server" },
      { status: 502 }
    );
  }
}
