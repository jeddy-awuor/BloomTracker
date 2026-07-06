import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "BloomTrack — Personal Productivity & Project Tracker",
  description:
    "A beautiful personal productivity and project tracker with weekly tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full overflow-hidden font-sans">
        <AuthProvider>
          <div className="flex h-full">
            <Sidebar />
            <main className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-6xl p-6 lg:p-8">{children}</div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
