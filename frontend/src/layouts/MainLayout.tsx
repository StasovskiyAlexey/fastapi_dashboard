import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import useMobile from "@/hooks/useMobile";
import MobileMenu from "@/components/MobileMenu";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const {user} = useAuth()
  const {width} = useMobile()

  const isShowSidebar = user && user.id && width < 768

  return (
    <div className={`h-screen w-full grid ${isShowSidebar ? 'grid-cols-1' : 'grid-cols-[300px_1fr]'}`}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster position="top-center" />
          {width < 768 ? <MobileMenu/> : <Sidebar />}

          <main className="flex-1 h-screen p-4 overflow-y-auto bg-gray-100">
            {children}
          </main>
        </TooltipProvider>
      </AuthProvider>
    </div>
  );
};

export default MainLayout;
