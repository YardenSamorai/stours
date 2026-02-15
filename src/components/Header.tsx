'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, X, Phone, Globe } from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === 'he' ? 'en' : 'he';
    router.replace(pathname, { locale: newLocale });
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/destinations', label: t('destinations') },
    { href: '/services', label: t('services') },
    { href: '/blog', label: t('blog') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-white py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold flex items-baseline">
              <span className="text-3xl text-primary-600">Deal</span>
              <span className="text-slate-800"> Tours</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 font-medium transition-all duration-300 hover:text-primary-600 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone */}
            <a
              href="tel:0525118536"
              className="flex items-center gap-2 text-slate-600 font-medium hover:text-primary-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">03-1234567</span>
            </a>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-300"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {locale === 'he' ? 'EN' : 'עב'}
              </span>
            </button>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              {t('bookNow')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t animate-slide-in">
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3" />
              <div className="flex items-center justify-between px-4 py-2">
                <a href="tel:0525118536" className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4" />
                  03-1234567
                </a>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg"
                >
                  <Globe className="w-4 h-4" />
                  {locale === 'he' ? 'English' : 'עברית'}
                </button>
              </div>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-3 bg-primary-600 text-white text-center py-3 rounded-lg font-semibold"
              >
                {t('bookNow')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
