export interface ChatRequest {
  question: string;
  session_id?: string;
}

export interface TokenUsage {
  input_estimate: number;
  output_estimate: number;
  total_estimate: number;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  token_usage: TokenUsage;
}

export interface SSEEvent {
  type: "token" | "sources" | "token_usage" | "done";
  content?: string;
  sources?: string[];
  input_estimate?: number;
  output_estimate?: number;
  total_estimate?: number;
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
  sources?: string[];
  token_usage?: TokenUsage;
}
