import { AppSidebar } from "@/components/layout/app-sidebar";
import FloatingIngestStatus from "@/components/status/FloatingIngestStatus";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh">
      <AppSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
      <FloatingIngestStatus />
    </div>
  );
}
