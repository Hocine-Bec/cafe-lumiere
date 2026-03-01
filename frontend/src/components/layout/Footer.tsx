import { NavLink } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-warm-gray-light">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + socials */}
          <div className="flex flex-col gap-4">
            <span className="font-serif text-xl font-semibold text-warm-white">
              Café Lumière
            </span>
            <p className="text-sm leading-relaxed">
              A warm corner where coffee meets culture.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="hover:text-copper transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-copper transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-copper transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-warm-white">
              Quick Links
            </h3>
            {[
              { label: t('nav.home'), to: '/' },
              { label: t('nav.menu'), to: '/menu' },
              { label: t('nav.reservation'), to: '/reservation' },
              { label: t('nav.about'), to: '/about' },
              { label: t('nav.contact'), to: '/contact' },
            ].map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className="text-sm hover:text-copper transition-colors"
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Contact + hours */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-warm-white">
              Visit Us
            </h3>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-copper" />
              <span>123 Lumière Street, Café District</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-copper" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-copper" />
              <span>hello@cafelumiere.com</span>
            </div>
            <div className="flex items-start gap-2 text-sm mt-1">
              <Clock className="h-4 w-4 mt-0.5 shrink-0 text-copper" />
              <div>
                <p>Mon–Fri: 8am – 10pm</p>
                <p>Sat–Sun: 9am – 11pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-charcoal-light pt-6 text-center text-xs text-warm-gray-dark">
          © {year} Café Lumière. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
