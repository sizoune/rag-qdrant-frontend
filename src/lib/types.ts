export interface ChatRequest {
  question: string;
  session_id?: string;
  /** Opt-in fallback ke pencarian web saat RAG tak menemukan jawaban. */
  enable_web_search?: boolean;
}

export interface TokenUsage {
  input_estimate: number;
  output_estimate: number;
  total_estimate: number;
}

export interface LocationItem {
  /** Pre-formatted Indonesian label, e.g. "Halaman 5 — Bab 2 § 1.3". */
  display: string;
  /** Trimmed chunk text (~200 chars). */
  chunk_preview: string;
  /** PDF page number (1-indexed). */
  page?: number | null;
  /** URL anchor for web sources. */
  url_fragment?: string | null;
  /** Inclusive (start, end) line numbers for code/text. */
  line_range?: [number, number] | null;
}

export interface SourceItem {
  /** Path or URL of the source document. */
  source: string;
  /** "local" | "web" | "telegram_upload" | ... */
  source_type: string;
  /** Display basename (null for web URLs). */
  filename?: string | null;
  /** One or more cited locations within this source. */
  locations: LocationItem[];
}

export interface ChatResponse {
  answer: string;
  sources: SourceItem[];
  token_usage: TokenUsage;
  /** Waktu respons terukur di server (ms). */
  elapsed_ms?: number;
  /** True bila jawaban berasal dari fallback pencarian web. */
  web_search_used?: boolean;
}

export interface SSEEvent {
  type: "token" | "sources" | "token_usage" | "web_search" | "done";
  content?: string;
  sources?: SourceItem[];
  input_estimate?: number;
  output_estimate?: number;
  total_estimate?: number;
  /** Dikirim bersama event token_usage — waktu respons server (ms). */
  elapsed_ms?: number;
  /** Dikirim bersama event web_search — apakah fallback web terpakai. */
  used?: boolean;
}

export interface FileItem {
  source_id: string;
  source: string;
  source_type: string;
  chunk_count: number;
  last_seen?: string;
  in_s3: boolean;
}

export interface FileListResponse {
  items: FileItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UploadFileItem {
  upload_id: string;
  filename: string;
  path: string;
  size_bytes: number;
  modified_at: string;
  ingested: boolean;
  ingest_status: string;
  source_id?: string;
  chunk_count?: number;
  last_seen?: string;
}

export interface UploadFileListResponse {
  items: UploadFileItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  uploads_dir: string;
}

export interface OperationResponse {
  success: boolean;
  message: string;
  deleted_chunks?: number;
  added_chunks?: number;
  skipped?: boolean;
  uploads_dir?: string;
  processed_files?: number;
}

export interface IngestStatusResponse {
  running: boolean;
  current_task?: string;
  current_source?: string;
  started_at?: string;
  finished_at?: string;
  last_message?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
  token_usage?: TokenUsage;
  /** Epoch ms — user: waktu kirim; assistant: waktu jawaban selesai. */
  createdAt?: number;
  /** Assistant only — lama response (ms) dari pertanyaan dikirim s/d jawaban selesai. */
  durationMs?: number;
  /** Assistant only — jawaban berasal dari fallback pencarian web. */
  webSearchUsed?: boolean;
}
