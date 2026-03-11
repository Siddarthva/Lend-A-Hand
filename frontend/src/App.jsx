import React, { Suspense, lazy, useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider } from '@/features/auth/AuthContext';
import { BookingProvider } from '@/features/bookings/BookingContext';
import { NotificationProvider } from '@/features/messaging/NotificationContext';
import { MessagingProvider } from '@/features/messaging/MessagingContext';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import NotificationPanel from './components/NotificationPanel';
import LoadingPage from './components/layout/LoadingPage';

// Layout Shells
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Lazy-loaded Pages
const LandingPage = lazy(() => import('@/features/services/LandingPage'));
const ServicesPage = lazy(() => import('@/features/services/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/features/services/ServiceDetailPage'));
const AuthPage = lazy(() => import('@/features/auth/AuthPage'));
const BookingWizard = lazy(() => import('@/features/bookings/BookingWizard'));
const PaymentPage = lazy(() => import('@/features/bookings/PaymentPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const ReviewPage = lazy(() => import('@/features/services/ReviewPage'));
const ChatPage = lazy(() => import('@/features/messaging/ChatPage'));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage'));
const ProviderDashboard = lazy(() => import('@/features/admin/ProviderDashboard'));
const AdminPanel = lazy(() => import('@/features/admin/AdminPanel'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));
const InvoicePage = lazy(() => import('@/features/bookings/InvoicePage'));

// --------------------------------------------------------------------------
// ROUTER ENGINE
// --------------------------------------------------------------------------
const Router = () => {
  const { view, viewParams } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  // Define Layout Wrappers
  const layoutMap = {
    // Auth Shell (no Navbar/Footer)
    login: AuthLayout,
    register: AuthLayout,
    'booking-wizard': AuthLayout,

    // Dashboard Shell
    dashboard: DashboardLayout,
    profile: DashboardLayout,
    chat: DashboardLayout,
    settings: DashboardLayout,
    'provider-dashboard': DashboardLayout,
    admin: DashboardLayout,
    review: DashboardLayout,

    // Public/Special
    default: PublicLayout
  };

  const Layout = layoutMap[view] || layoutMap.default;

  const renderContent = () => {
    switch (view) {
      // Public
      case 'landing': return <LandingPage />;
      case 'services': return <ServicesPage {...viewParams} />;
      case 'service-detail': return <ServiceDetailPage {...viewParams} />;

      // Auth
      case 'login': return <AuthPage initialMode="login" />;
      case 'register': return <AuthPage initialMode="register" />;

      // Booking flow
      case 'booking-wizard': return <BookingWizard />;
      case 'payment': return <PaymentPage {...viewParams} />;
      case 'invoice': return <InvoicePage {...viewParams} />;
      case 'review': return <ReviewPage {...viewParams} />;

      // Dashboards & Profile
      case 'dashboard': return <DashboardPage />;
      case 'profile': return <ProfilePage />;
      case 'chat': return <ChatPage {...viewParams} />;
      case 'settings': return <SettingsPage />;
      case 'provider-dashboard': return <ProviderDashboard />;
      case 'admin': return <AdminPanel />;

      default: return <LandingPage />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout onNotificationOpen={() => setNotifOpen(true)}>
        <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        <Suspense fallback={<LoadingPage />}>
          {renderContent()}
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

// --------------------------------------------------------------------------
// PROVIDER STACK
// --------------------------------------------------------------------------
const App = () => (
  <ErrorBoundary>
    <AppProvider>
      <AuthProvider>
        <NotificationProvider>
          <MessagingProvider>
            <BookingProvider>
              <Router />
            </BookingProvider>
          </MessagingProvider>
        </NotificationProvider>
      </AuthProvider>
    </AppProvider>
  </ErrorBoundary>
);

export default App;