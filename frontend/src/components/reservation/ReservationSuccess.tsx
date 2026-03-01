import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '@/utils/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { ReservationResponse } from '@/types';

interface ReservationSuccessProps {
  reservation: ReservationResponse;
  onReset: () => void;
}

export function ReservationSuccess({ reservation, onReset }: ReservationSuccessProps) {
  const { t } = useLanguage();

  const whatsappMessage = encodeURIComponent(
    `Hello! I'd like to confirm my reservation:\n` +
    `Name: ${reservation.customerName}\n` +
    `Date: ${reservation.date}\n` +
    `Time: ${reservation.time}\n` +
    `Guests: ${reservation.partySize}\n` +
    (reservation.specialRequests ? `Special Requests: ${reservation.specialRequests}` : '')
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const summaryRows = [
    [t('reservation.date'), reservation.date],
    [t('reservation.time'), reservation.time],
    [t('reservation.guestsLabel'), String(reservation.partySize)],
    [t('reservation.name'), reservation.customerName],
  ];

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <CheckCircle className="h-20 w-20 text-success" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        <h2 className="font-serif text-3xl font-bold text-charcoal">{t('reservation.submitted')}</h2>
        <p className="text-warm-gray max-w-sm">
          {t('reservation.submittedMsg')}
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full rounded-xl border border-warm-gray-light bg-cream p-5 text-sm text-left"
      >
        {summaryRows.map(([label, value]) => (
          <div key={label} className="flex justify-between py-1.5 border-b border-warm-gray-light last:border-0">
            <span className="text-warm-gray">{label}</span>
            <span className="font-medium text-charcoal">{value}</span>
          </div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-col gap-3 w-full"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-7 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          {t('reservation.sendWhatsApp')}
        </a>
        <button
          onClick={onReset}
          className="text-sm text-copper hover:underline"
        >
          {t('reservation.makeAnother')}
        </button>
        <Link to="/" className="text-sm text-warm-gray hover:text-charcoal transition-colors">
          {t('reservation.backToHome')}
        </Link>
      </motion.div>
    </div>
  );
}
