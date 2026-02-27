import { 
  Settings, 
  LogOut, 
  ChevronRight,
  LayoutDashboard,
  Menu
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function MobileMenu() {
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: Settings, label: 'Налаштування', href: '/settings' },
    { icon: LayoutDashboard, label: 'Дошки', href: '/boards' },
  ];

  if (!user) {
    return null;
  }

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="h-full sm:w-75 w-full rounded-none flex flex-col p-4">
        <DrawerHeader className="p-0 mb-8">
          <DrawerTitle className="flex items-center gap-3 px-2 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 shadow-inner">
              <img
                src="https://cdn.worldvectorlogo.com/logos/fastapi.svg" 
                alt="Logo" 
                className="h-7 w-7" 
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              FastAPI <span className="text-emerald-500">Dashboard</span>
            </span>
          </DrawerTitle>
        </DrawerHeader>

        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <DrawerClose asChild key={item.label}>
                <Link activeOptions={{exact: true}} to={item.href}>
                  {({isActive}) => (
                    <button
                      className={`
                        group relative flex items-center w-full justify-between rounded-xl px-4 py-3 
                        transition-all duration-300 ease-out outline-none
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
                      )}

                      <div className="flex items-center gap-3">
                        <item.icon 
                          className={`
                            h-5 w-5 transition-transform duration-300
                            ${isActive ? 'text-indigo-600 scale-110' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'}
                          `} 
                        />
                        <span className={`text-sm font-semibold tracking-tight`}>
                          {item.label}
                        </span>
                      </div>

                      <ChevronRight 
                        className={`
                          h-4 w-4 transition-all duration-300
                          ${isActive 
                            ? 'opacity-100 translate-x-0 text-indigo-600' 
                            : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-slate-400'
                          }
                        `} 
                      />
                    </button>
                  )}
                </Link>
              </DrawerClose>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <Avatar className="z-0" size="default">
              <AvatarImage src={!user?.avatar_url ? 'https://img.icons8.com/ios-filled/100/user-male-circle.png' : getImageUrl(user?.avatar_url)} />
              <AvatarFallback>ERROR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800 leading-none">{user?.login}</span>
              <span className="text-xs text-slate-500 mt-1">{user?.email}</span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Вийти з аккаунту</span>
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}