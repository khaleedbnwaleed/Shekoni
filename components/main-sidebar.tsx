'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  Calendar,
  Building2,
  Info,
  Phone,
  Menu,
  X,
  LogIn,
  UserPlus,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '#services', label: 'Services', icon: Calendar },
  { href: '#about', label: 'About', icon: Info },
  { href: '#contact', label: 'Contact', icon: Phone },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function MainSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ha'>('en');

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white/90 backdrop-blur-sm"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={classNames(
        'fixed left-0 top-0 z-40 h-screen w-64 transform bg-white/95 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out dark:bg-slate-950/95 lg:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-slate-200 p-6 dark:border-slate-700">
            <img
              src="/Logo.png"
              alt="RSFUDTH Logo"
              className="h-12 w-auto"
            />
            <div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                RSFUDTH
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Hospital
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const active = pathname === item.href ||
                (item.href.startsWith('#') && pathname === '/' && item.href === '#services');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={classNames(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Language selector */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Globe className="h-4 w-4" />
              Language
            </div>
            <select
              aria-label="Select language"
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'ha')}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="en">English</option>
              <option value="ha">Hausa</option>
            </select>
          </div>

          {/* Auth buttons */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
            <div className="space-y-2">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact info */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <div className="mb-1">📞 +234 123 456 7890</div>
              <div className="mb-1">📧 info@rsfudth.ng</div>
              <div>🕒 Mon-Fri 8:00AM - 5:00PM</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}