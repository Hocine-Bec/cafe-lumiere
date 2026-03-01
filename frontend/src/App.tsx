import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import HomePage from '@/pages/public/HomePage';
import MenuPage from '@/pages/public/MenuPage';
import ReservationPage from '@/pages/public/ReservationPage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import LoginPage from '@/pages/admin/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import MenuManagementPage from '@/pages/admin/MenuManagementPage';
import ReservationManagementPage from '@/pages/admin/ReservationManagementPage';
import ContactMessagesPage from '@/pages/admin/ContactMessagesPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="reservation" element={<ReservationPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
      <Route path="admin/login" element={<LoginPage />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="menu" element={<MenuManagementPage />} />
        <Route path="reservations" element={<ReservationManagementPage />} />
        <Route path="messages" element={<ContactMessagesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
