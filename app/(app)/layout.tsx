import Sidebar from "@/app/components/Sidebar";
import BottomNav from "@/app/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col fixed top-0 left-0 h-screen w-64 z-30 border-r border-void-border bg-void-light/60 backdrop-blur-xl p-4">
        <Sidebar />
      </aside>

      <main className="flex-1 md:ml-64 pb-20 md:pb-0 animate-fade-in">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
        <BottomNav />
      </div>
    </div>
  );
}
