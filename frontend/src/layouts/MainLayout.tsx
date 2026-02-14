import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useLocation } from "@tanstack/react-router";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation()

  const isShowSidebar = location.href === '/auth'

  return (
    <div className={`h-screen w-full grid overflow-hidden ${isShowSidebar ? 'grid-cols-1' : 'grid-cols-[300px_1fr]'}`}>
      <AuthProvider>
        <Toaster position="top-center" />
        <Sidebar />

        <main className="flex-1 p-4 h-full overflow-y-auto bg-gray-100">
          {children}
        </main>
      </AuthProvider>
    </div>
  );
};

export default MainLayout;
