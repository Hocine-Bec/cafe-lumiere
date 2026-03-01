import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

const navLinks = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.menu', to: '/menu' },
  { key: 'nav.reservation', to: '/reservation' },
  { key: 'nav.about', to: '/about' },
  { key: 'nav.contact', to: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      dir="ltr"
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-warm-white shadow-sm'
          : 'bg-warm-white/90 backdrop-blur-sm'
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="font-serif text-xl font-semibold text-charcoal hover:text-copper transition-colors"
          >
            Café Lumière
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ key, to }) => (
              <NavLink
                key={key}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'text-copper'
                      : 'text-charcoal-light hover:text-copper'
                  )
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </nav>

          {/* Language toggle + mobile button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-xs font-semibold text-charcoal-light hover:text-copper transition-colors px-2 py-1 border border-warm-gray-light rounded"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>

            <button
              className="md:hidden text-charcoal"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-warm-white border-t border-cream-dark md:hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map(({ key, to }) => (
                <NavLink
                  key={key}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'py-2 px-3 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-copper/10 text-copper'
                        : 'text-charcoal-light hover:bg-cream-dark hover:text-charcoal'
                    )
                  }
                >
                  {t(key)}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
