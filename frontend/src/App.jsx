import React, { Suspense, useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MessagingProvider } from './contexts/MessagingContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/layout/ToastContainer';
import NotificationPanel from './components/NotificationPanel';

// Pages — listed alphabetically
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingWizard from './pages/BookingWizard';
import PaymentPage from './pages/PaymentPage';
import DashboardPage from './pages/DashboardPage';
import ReviewPage from './pages/ReviewPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminPanel from './pages/AdminPanel';
import SettingsPage from './pages/SettingsPage';
import InvoicePage from './pages/InvoicePage';

// --------------------------------------------------------------------------
// ROUTER — pure state machine, no external dependencies
// --------------------------------------------------------------------------
const NO_FOOTER_VIEWS = ['chat', 'booking-wizard'];
const NO_NAVBAR_VIEWS = ['booking-wizard'];

const Router = () => {
  const { view, viewParams } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  const showNavbar = !NO_NAVBAR_VIEWS.includes(view);
  const showFooter = !NO_FOOTER_VIEWS.includes(view);

  const renderPage = () => {
    switch (view) {
      // Public
      case 'landing': return <LandingPage />;
      case 'services': return <ServicesPage initialCategory={viewParams.category} initialQuery={viewParams.query} />;
      case 'service-detail': return <ServiceDetailPage serviceId={viewParams.serviceId} />;

      // Auth
      case 'login': return <AuthPage initialMode="login" />;
      case 'register': return <AuthPage initialMode="register" />;

      // Booking flow
      case 'booking-wizard': return <BookingWizard />;
      case 'payment': return <PaymentPage booking={viewParams.booking} />;
      case 'invoice': return <InvoicePage booking={viewParams.booking} txnId={viewParams.txnId} method={viewParams.method} />;
      case 'review': return <ReviewPage booking={viewParams.booking} />;

      // Customer
      case 'dashboard': return <DashboardPage />;
      case 'profile': return <ProfilePage />;
      case 'chat': return <ChatPage chatId={viewParams.chatId} />;
      case 'settings': return <SettingsPage />;

      // Provider
      case 'provider-dashboard': return <ProviderDashboard />;

      // Admin
      case 'admin': return <AdminPanel />;

      // Fallback
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {showNavbar && (
        <Navbar onNotificationOpen={() => setNotifOpen(true)} />
      )}
      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />

      <main className="flex-1">
        {renderPage()}
      </main>

      {showFooter && <Footer />}
      <ToastContainer />
    </div>
  );
};

// --------------------------------------------------------------------------
// ROOT — provider composition (outermost → innermost)
// --------------------------------------------------------------------------
const App = () => (
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
);

export default App;