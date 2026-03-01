import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { MapView } from '@/components/ui/MapView';

export function ContactInfo() {
  const { t } = useLanguage();

  const hours = [
    { key: 'contact.monFri', time: '7:00 AM – 10:00 PM' },
    { key: 'contact.saturday', time: '8:00 AM – 11:00 PM' },
    { key: 'contact.sunday', time: '8:00 AM – 9:00 PM' },
  ];

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper/10">
          <MapPin className="h-5 w-5 text-copper" />
        </div>
        <div>
          <p className="font-semibold text-charcoal">{t('contact.address')}</p>
          <p className="mt-1 text-sm text-charcoal-light whitespace-pre-line">
            {t('contact.addressValue')}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper/10">
          <Phone className="h-5 w-5 text-copper" />
        </div>
        <div>
          <p className="font-semibold text-charcoal">{t('contact.phone')}</p>
          <a
            href="tel:+14155551234"
            className="mt-1 text-sm text-charcoal-light hover:text-copper transition-colors"
          >
            +1 (415) 555-1234
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper/10">
          <Mail className="h-5 w-5 text-copper" />
        </div>
        <div>
          <p className="font-semibold text-charcoal">{t('contact.email')}</p>
          <a
            href="mailto:hello@cafelumiere.com"
            className="mt-1 text-sm text-charcoal-light hover:text-copper transition-colors"
          >
            hello@cafelumiere.com
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper/10">
          <Clock className="h-5 w-5 text-copper" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-charcoal">{t('contact.hours')}</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {hours.map(({ key, time }) => (
              <div key={key} className="flex justify-between gap-6 text-sm">
                <span className="text-charcoal-light">{t(key)}</span>
                <span className="font-medium text-charcoal">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {[
          { Icon: Instagram, label: 'Instagram', href: '#' },
          { Icon: Facebook, label: 'Facebook', href: '#' },
          { Icon: Twitter, label: 'Twitter', href: '#' },
        ].map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-warm-gray-light text-warm-gray transition-colors hover:border-copper hover:text-copper"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      <MapView lat={48.8552} lng={2.3542} height="220px" />
    </div>
  );
}
