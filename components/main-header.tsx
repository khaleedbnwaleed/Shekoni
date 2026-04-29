'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#departments', label: 'Departments' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function MainHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ha'>('en');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="RSFUDTH"
              className="h-15 w-15 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">RSFUDTH</p>
              <p className="text-xs text-slate-500">Hospital Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="hidden sm:flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLang(lang === 'en' ? 'ha' : 'en')}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                {lang === 'en' ? 'EN' : 'HA'}
              </Button>
            </div>

            {/* Auth Links */}
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition py-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Language Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Language</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLang(lang === 'en' ? 'ha' : 'en')}
                  className="gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {lang === 'en' ? 'EN' : 'HA'}
                </Button>
              </div>

              {/* Mobile Auth Links */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
