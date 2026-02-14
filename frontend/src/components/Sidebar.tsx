import { 
  Settings, 
  LogOut, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from '@tanstack/react-router';

export const Sidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    // { icon: User, label: 'Профіль', href: '/' },
    { icon: Settings, label: 'Налаштування', href: '/settings' },
  ];

  if (!user) {
    return null
  }

  return (
    <aside className="flex w-75 fixed border-r bg-card overflow-y-auto h-screen flex-col border-slate-200 p-4 shadow-sm">
      {/* 1. Логотип FastAPI */}
      <div className="mb-8 flex items-center gap-3 px-2 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 shadow-inner">
          <img
            src="https://cdn.worldvectorlogo.com/logos/fastapi.svg" 
            alt="Logo" 
            className="h-7 w-7" 
          />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          FastAPI <span className="text-emerald-500">Auth</span>
        </span>
      </div>

      {/* 2. Основний список навігації */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <Link activeOptions={{exact: true}}
            key={item.label} 
            to={item.href}>
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
                {/* Левый индикатор активности */}
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
          ))}
        </ul>
      </nav>

      {/* 3. Нижня частина: Профіль та Вихід */}
      <div className="mt-auto border-t border-slate-100 pt-4">
        <div className="mb-4 flex items-center gap-3 px-2">
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
    </aside>
  );
}