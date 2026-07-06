"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CalendarCheck,
  FileInput,
  Cloud,
  LogOut,
} from "lucide-react";
import MotivationQuote from "@/components/MotivationQuote";
import { useAuth } from "@/contexts/AuthContext";

const SIDEBAR_IMAGE = "/what-if-it-works-out.png";
const SIDEBAR_IMAGE_ALT = "What if it all works out?";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/weekly", label: "Weekly Tasks", icon: CalendarCheck },
  { href: "/import", label: "Import Text", icon: FileInput },
  { href: "/login", label: "Sign In", icon: Cloud },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isConfigured, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-pink-500/20 bg-pink-950/60 backdrop-blur-xl">
      <div className="border-b border-pink-500/20 p-6">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-pink-400/40 shadow-pink">
            <Image
              src={SIDEBAR_IMAGE}
              alt={SIDEBAR_IMAGE_ALT}
              fill
              className="object-cover object-center"
              sizes="40px"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-pink-50">BloomTrack</h1>
            <p className="text-xs text-pink-400">Productivity & Projects</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          if (href === "/login" && (!isConfigured || user)) return null;
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-pink-500/30 to-blush-500/20 text-pink-100 shadow-pink ring-1 ring-pink-400/30"
                  : "text-pink-400 hover:bg-pink-500/10 hover:text-pink-200"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-pink-300" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex justify-center px-4 pb-4">
        <div
          className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-pink-400/50 shadow-pink-lg transition-transform hover:scale-105"
          title={SIDEBAR_IMAGE_ALT}
        >
          <Image
            src={SIDEBAR_IMAGE}
            alt={SIDEBAR_IMAGE_ALT}
            fill
            className="object-cover object-center"
            sizes="112px"
          />
        </div>
      </div>

      <div className="border-t border-pink-500/20 p-4 space-y-3">
        {isConfigured && (
          <div className="rounded-xl border border-pink-500/20 bg-pink-950/40 p-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 shrink-0 text-pink-300" />
                  <p className="truncate text-xs text-pink-300" title={user.email}>
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-pink-500/30 px-3 py-1.5 text-xs text-pink-400 transition-colors hover:bg-pink-500/10 hover:text-pink-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-pink-300 transition-colors hover:text-pink-100"
              >
                <Cloud className="h-4 w-4" />
                Sign in to sync
              </Link>
            )}
          </div>
        )}
        <MotivationQuote compact />
      </div>
    </aside>
  );
}
