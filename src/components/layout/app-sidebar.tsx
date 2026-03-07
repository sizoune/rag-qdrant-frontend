"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, FolderOpen, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/documents", icon: FolderOpen, label: "Kelola Dokumen" },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
        R
      </div>

      {/* Nav Items */}
      <div className="flex flex-1 flex-col items-center gap-2">
        <TooltipProvider delay={0}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    />
                  }
                >
                  <item.icon className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Theme Toggle at bottom */}
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </nav>
  );
}

export function AppSidebar() {
  return (
    <>
      {/* Desktop slim sidebar */}
      <aside className="hidden md:flex w-16 flex-col border-r bg-sidebar">
        <NavContent />
      </aside>

      {/* Mobile: hamburger + Sheet */}
      <div className="fixed top-3 left-3 z-50 md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="h-9 w-9" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-20 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
