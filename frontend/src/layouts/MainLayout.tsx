import { Toaster } from "sonner";
import { type ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import useMobile from "@/hooks/useMobile";
import MobileMenu from "@/components/MobileMenu";
import { useCheckAuth } from "@/hooks/queries/useAuth";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const {data: user} = useCheckAuth()
  const {width} = useMobile()
  
  return (
    <>
        <Toaster position="top-center" />
        <div className={`h-screen w-full grid ${user && width > 768 ? 'grid-cols-[300px_1fr]' : 'grid-cols-1'}`}>
        
        {user && width > 768 && <Sidebar/>}
        {user && width < 768 && <MobileMenu/>}

        <main className="w-full h-screen p-4 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayout;
