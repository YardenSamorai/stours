'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Tag, 
  FileText, 
  Settings, 
  MessageSquare,
  Mail,
  Home,
  Star,
  Menu,
  X,
  Layers,
  Grid3X3
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'דשבורד' },
  { href: '/admin/deals', icon: Tag, label: 'דילים וחבילות' },
  { href: '/admin/categories', icon: Grid3X3, label: 'קטגוריות' },
  { href: '/admin/services', icon: Layers, label: 'שירותים' },
  { href: '/admin/blog', icon: FileText, label: 'בלוג' },
  { href: '/admin/testimonials', icon: Star, label: 'המלצות' },
  { href: '/admin/contacts', icon: MessageSquare, label: 'פניות' },
  { href: '/admin/subscribers', icon: Mail, label: 'ניוזלטר' },
  { href: '/admin/settings', icon: Settings, label: 'הגדרות האתר' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-100" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50
        w-64 bg-slate-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold flex items-baseline">
              <span className="text-2xl text-primary-500">דיל</span>
              <span className="text-slate-300"> טורס</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Site */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/he"
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-300"
          >
            <Home className="w-5 h-5" />
            <span>חזרה לאתר</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              מערכת ניהול
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">
              שלום, {user?.firstName || 'מנהל'}
            </span>
            <UserButton 
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10'
                }
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
