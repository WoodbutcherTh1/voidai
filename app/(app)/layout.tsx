import type { Metadata } from "next";
import ThemeProvider from "@/app/components/ThemeProvider";
import Sidebar from "@/app/components/Sidebar";
import BottomNav from "@/app/components/BottomNav";

export const metadata: Metadata = {
  title: "VoidAI - Your Friendly AI Assistant",
  description: "VoidAI helps you code, create media, and explore new ideas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-void-bg text-void-text">
        <ThemeProvider>
          <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 bg-void-light border-r border-void-lighter min-h-screen p-4 fixed left-0 top-0">
              <Sidebar />
            </div>

            <main className="flex-1 md:ml-64 pb-16 md:pb-0">
              {children}
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0">
              <BottomNav />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
