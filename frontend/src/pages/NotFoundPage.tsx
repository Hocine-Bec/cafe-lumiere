import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="font-serif text-8xl font-bold text-copper/20 select-none">404</p>
        <h1 className="mt-2 font-serif text-3xl text-charcoal">Page not found</h1>
        <p className="mt-3 text-warm-gray max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-copper hover:bg-copper-dark text-white text-sm font-medium px-6 py-3 rounded-full transition-colors duration-200"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
