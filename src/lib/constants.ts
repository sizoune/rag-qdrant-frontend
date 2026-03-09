export const UI = {
  // Navigation
  NAV_CHAT: "Chat",
  NAV_KNOWLEDGE_BASE: "Basis Pengetahuan",
  NAV_UPLOAD: "Unggah",
  NAV_INGEST_URL: "Ingest URL",
  NAV_STATUS: "Status",
  NAV_DOCUMENTS: "Kelola Dokumen",

  // Chat
  CHAT_PLACEHOLDER: "Ketik pertanyaan Anda...",
  CHAT_SEND: "Kirim",
  CHAT_NEW_SESSION: "Sesi Baru",
  CHAT_SOURCES: "Sumber",
  CHAT_TOKEN_USAGE: "Penggunaan Token",
  CHAT_THINKING: "Sedang berpikir...",
  CHAT_NO_MESSAGES: "Mulai percakapan baru",
  CHAT_INPUT_TOKENS: "Token Input",
  CHAT_OUTPUT_TOKENS: "Token Output",
  CHAT_TOTAL_TOKENS: "Total Token",

  // Knowledge Base
  KB_TITLE: "Basis Pengetahuan",
  KB_SOURCE: "Sumber",
  KB_TYPE: "Tipe",
  KB_CHUNKS: "Jumlah Chunk",
  KB_LAST_SEEN: "Terakhir Dilihat",
  KB_DELETE: "Hapus",
  KB_REINGEST: "Ingest Ulang",
  KB_REINGEST_ALL: "Ingest Ulang Semua",
  KB_CONFIRM_DELETE: "Yakin ingin menghapus sumber ini?",
  KB_EMPTY: "Belum ada dokumen yang di-ingest",
  KB_MIGRATE_S3: "Migrasi ke S3",
  KB_MIGRATE_S3_CONFIRM: "Pindahkan semua file upload lokal ke S3? File lokal akan dihapus setelah berhasil diupload.",
  KB_MIGRATE_S3_SUCCESS: "Migrasi ke S3 berhasil",
  KB_S3_STATUS: "S3",
  KB_IN_S3: "Tersimpan",
  KB_NOT_IN_S3: "Belum",

  // Upload
  UPLOAD_TITLE: "Unggah Dokumen",
  UPLOAD_DROPZONE: "Seret file ke sini atau klik untuk memilih",
  UPLOAD_SUPPORTED: "Format yang didukung: PDF, DOCX, TXT, MD, CSV",
  UPLOAD_PROGRESS: "file diunggah",
  UPLOAD_START_INGEST: "Mulai Ingest",
  UPLOAD_DELETE: "Hapus",
  UPLOAD_CONFIRM_DELETE: "Yakin ingin menghapus file ini?",

  // Ingest URL
  INGEST_URL_TITLE: "Ingest URL",
  INGEST_URL_PLACEHOLDER: "Masukkan URL halaman web...",
  INGEST_URL_START: "Mulai Ingest",
  INGEST_URL_SUCCESS: "Berhasil di-ingest",
  INGEST_URL_FAILED: "Gagal ingest",

  // Status
  STATUS_TITLE: "Status Ingest",
  STATUS_RUNNING: "Sedang Berjalan",
  STATUS_IDLE: "Tidak Ada Proses",
  STATUS_TASK: "Tugas",
  STATUS_SOURCE: "Sumber",
  STATUS_STARTED: "Mulai",
  STATUS_FINISHED: "Selesai",
  STATUS_LAST_MESSAGE: "Pesan Terakhir",

  // Common
  COMMON_LOADING: "Memuat...",
  COMMON_ERROR: "Terjadi kesalahan",
  COMMON_SUCCESS: "Berhasil",
  COMMON_CONFIRM: "Konfirmasi",
  COMMON_CANCEL: "Batal",
  COMMON_RETRY: "Coba Lagi",
  COMMON_DARK_MODE: "Mode Gelap",
  COMMON_LIGHT_MODE: "Mode Terang",
} as const;
