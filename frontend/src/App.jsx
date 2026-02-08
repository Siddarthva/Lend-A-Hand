import React, { useState, useEffect, useContext, createContext } from 'react';
import { 
  Search, Calendar, MessageSquare, User, Menu, X, Star, 
  MapPin, Clock, CheckCircle, ChevronRight, Shield, 
  LogOut, Send, Phone, MoreVertical, 
  Settings, Moon, Sun, Heart, Bell, Volume2, Globe, 
  Loader, AlertCircle, XCircle, Briefcase, DollarSign, Zap, Check,
  Linkedin, Github, Mail, Code, Terminal, Layers, Lock, FileText, Info,
  Cpu, Database, Layout, GitBranch, ArrowRight
} from 'lucide-react';

/**
 * ==============================================================================
 * CONSTANTS & MOCK DATA
 * ==============================================================================
 */

const CATEGORIES = ["All", "Cleaning", "Plumbing", "Electrical", "Gardening", "Moving", "Beauty"];

const ACCENT_COLORS = [
  { id: 'indigo', name: 'Royal Indigo', class: 'indigo' },
  { id: 'rose', name: 'Sunset Rose', class: 'rose' },
  { id: 'teal', name: 'Ocean Teal', class: 'teal' },
  { id: 'orange', name: 'Burnt Orange', class: 'orange' },
  { id: 'violet', name: 'Electric Violet', class: 'violet' },
];

const MOCK_SERVICES = [
  {
    id: 1,
    title: "Deep Home Cleaning",
    provider: "Sparkle & Shine Co.",
    rating: 4.8,
    reviews: 124,
    price: 85,
    priceUnit: "hr",
    category: "Cleaning",
    image: "https://images.unsplash.com/photo-1581578731117-104f88b96950?auto=format&fit=crop&q=80&w=800",
    description: "A complete top-to-bottom clean for your home. Includes dusting, vacuuming, mopping, and bathroom sanitation.",
    availability: ["09:00", "10:00", "13:00", "14:00", "16:00"],
    busySlots: ["10:00"]
  },
  {
    id: 2,
    title: "Emergency Plumbing Repair",
    provider: "Mike's Plumbing",
    rating: 4.9,
    reviews: 89,
    price: 120,
    priceUnit: "fixed",
    category: "Plumbing",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=800",
    description: "Fast response for leaks, clogs, and pipe bursts. Licensed and insured professionals ready to tackle any plumbing emergency.",
    availability: ["08:00", "11:00", "15:00"],
    busySlots: []
  },
  {
    id: 3,
    title: "Lawn Mowing & Maintenance",
    provider: "GreenThumb Landscapes",
    rating: 4.7,
    reviews: 210,
    price: 50,
    priceUnit: "visit",
    category: "Gardening",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=800",
    description: "Professional lawn mowing, edging, and trimming. We ensure your yard looks pristine all season long.",
    availability: ["07:00", "08:00", "09:00", "10:00"],
    busySlots: ["08:00"]
  },
  {
    id: 4,
    title: "Professional Moving Help",
    provider: "Heavy Lifters Inc.",
    rating: 4.5,
    reviews: 56,
    price: 95,
    priceUnit: "hr",
    category: "Moving",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=800",
    description: "Two strong movers and a truck. We handle packing, loading, and unloading with care.",
    availability: ["10:00", "14:00"],
    busySlots: []
  },
  {
    id: 5,
    title: "Electrical Inspection",
    provider: "BrightSpark Electric",
    rating: 5.0,
    reviews: 42,
    price: 150,
    priceUnit: "fixed",
    category: "Electrical",
    image: "https://images.unsplash.com/photo-1621905476438-620027b9a15f?auto=format&fit=crop&q=80&w=800",
    description: "Full safety inspection of your home's wiring, panel, and outlets.",
    availability: ["09:00", "13:00", "15:00"],
    busySlots: []
  },
  {
    id: 6,
    title: "Manicure & Pedicure",
    provider: "Luxe Mobile Spa",
    rating: 4.9,
    reviews: 315,
    price: 70,
    priceUnit: "session",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800",
    description: "Relaxing spa treatment in the comfort of your home.",
    availability: ["11:00", "12:00", "16:00", "18:00"],
    busySlots: ["18:00"]
  }
];

const MOCK_CHATS = [
  {
    id: 1,
    providerId: 1,
    providerName: "Sparkle & Shine Co.",
    lastMessage: "See you tomorrow at 9 AM!",
    timestamp: "10:30 AM",
    unread: 1,
    messages: [
      { id: 1, sender: "them", text: "Hi there! Thanks for booking with us.", time: "10:28 AM" },
      { id: 2, sender: "me", text: "Hi, do I need to provide vacuum bags?", time: "10:29 AM" },
      { id: 3, sender: "them", text: "No, we bring everything!", time: "10:30 AM" },
      { id: 4, sender: "them", text: "See you tomorrow at 9 AM!", time: "10:30 AM" }
    ]
  },
  {
    id: 2,
    providerId: 2,
    providerName: "Mike's Plumbing",
    lastMessage: "I'm running 5 mins late.",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, sender: "them", text: "I'm running 5 mins late.", time: "2:00 PM" }
    ]
  }
];

/**
 * ==============================================================================
 * STATE MANAGEMENT (CONTEXT)
 * ==============================================================================
 */

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lendahand_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('lendahand_theme') || 'system');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('lendahand_accent') || 'indigo');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('lendahand_favorites') || '[]'));
  
  const [view, setView] = useState('landing');
  const [selectedService, setSelectedService] = useState(null);
  const [isProviderModalOpen, setProviderModalOpen] = useState(false);
  const [bookings, setBookings] = useState([
    { id: 101, service: MOCK_SERVICES[1], date: "2023-11-15", time: "14:00", status: "Completed" },
    { id: 102, service: MOCK_SERVICES[0], date: "2023-12-01", time: "09:00", status: "Confirmed" },
  ]);
  const [chats, setChats] = useState(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    
    if (themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    }
    localStorage.setItem('lendahand_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('lendahand_accent', accentColor);
    const colors = {
      indigo: '#4f46e5', rose: '#e11d48', teal: '#0d9488', orange: '#ea580c', violet: '#7c3aed'
    };
    document.documentElement.style.setProperty('--primary-color', colors[accentColor]);
  }, [accentColor]);

  useEffect(() => {
    if (user) localStorage.setItem('lendahand_user', JSON.stringify(user));
    else localStorage.removeItem('lendahand_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lendahand_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = (email, password) => {
    setTimeout(() => {
      setUser({ 
        name: "Alex Johnson", 
        email, 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
      });
      setView('dashboard');
      addToast('Welcome back, Alex!', 'success');
    }, 800);
  };

  const logout = () => {
    setUser(null);
    setView('landing');
    addToast('Logged out successfully', 'info');
  };

  const addBooking = (service, date, time) => {
    const newBooking = {
      id: Math.floor(Math.random() * 10000),
      service, date, time, status: "Pending"
    };
    setBookings([newBooking, ...bookings]);
    addToast('Booking request sent!', 'success');
  };

  const toggleFavorite = (serviceId) => {
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter(id => id !== serviceId));
      addToast('Removed from favorites', 'info');
    } else {
      setFavorites([...favorites, serviceId]);
      addToast('Added to favorites', 'success');
    }
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const sendMessage = (chatId, text) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: text,
          timestamp: "Just now",
          messages: [...chat.messages, { id: Date.now(), sender: "me", text, time: "Just now" }]
        };
      }
      return chat;
    }));
  };

  const themeClasses = {
    bg: {
      indigo: 'bg-indigo-600 hover:bg-indigo-700',
      rose: 'bg-rose-600 hover:bg-rose-700',
      teal: 'bg-teal-600 hover:bg-teal-700',
      orange: 'bg-orange-600 hover:bg-orange-700',
      violet: 'bg-violet-600 hover:bg-violet-700',
    },
    text: {
      indigo: 'text-indigo-600', rose: 'text-rose-600', teal: 'text-teal-600', orange: 'text-orange-600', violet: 'text-violet-600',
    },
    ring: {
      indigo: 'focus:ring-indigo-500', rose: 'focus:ring-rose-500', teal: 'focus:ring-teal-500', orange: 'focus:ring-orange-500', violet: 'focus:ring-violet-500',
    },
    lightBg: {
      indigo: 'bg-indigo-50', rose: 'bg-rose-50', teal: 'bg-teal-50', orange: 'bg-orange-50', violet: 'bg-violet-50',
    },
    border: {
      indigo: 'border-indigo-200', rose: 'border-rose-200', teal: 'border-teal-200', orange: 'border-orange-200', violet: 'border-violet-200',
    }
  };

  return (
    <AppContext.Provider value={{
      user, login, logout, 
      view, setView, 
      selectedService, setSelectedService,
      bookings, addBooking,
      chats, activeChatId, setActiveChatId, sendMessage,
      themeMode, setThemeMode,
      accentColor, setAccentColor,
      favorites, toggleFavorite,
      toasts, addToast,
      isProviderModalOpen, setProviderModalOpen,
      themeClasses
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

/**
 * ==============================================================================
 * UI COMPONENTS
 * ==============================================================================
 */

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const { accentColor, themeClasses } = useApp();
  
  const variants = {
    primary: `${themeClasses.bg[accentColor]} text-white shadow-md hover:shadow-lg`,
    secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
    outline: `bg-transparent border-2 border-current ${themeClasses.text[accentColor]} hover:bg-gray-50 dark:hover:bg-gray-800`,
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
  };

  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ status }) => {
  const styles = {
    Pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    Confirmed: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800",
    Completed: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    Cancelled: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800"
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const Input = ({ label, error, ...props }) => {
  const { accentColor, themeClasses } = useApp();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input 
        className={`px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 ${themeClasses.ring[accentColor]} transition-all outline-none ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="animate-in slide-in-from-right-full pointer-events-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 border-l-4 border-l-indigo-500 flex items-center gap-3 min-w-[300px]">
          {toast.type === 'success' ? <CheckCircle className="text-green-500" size={20} /> : 
           toast.type === 'error' ? <XCircle className="text-red-500" size={20} /> :
           <Bell className="text-indigo-500" size={20} />}
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SchemaMarkup = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Lend a Hand",
        "url": "https://lendahand.com",
        "logo": "https://lendahand.com/logo.png",
        "founder": {
          "@type": "Person",
          "name": "Siddarth V Acharya"
        },
        "description": "Founder-led service booking platform connecting users with local professionals."
      },
      {
        "@type": "Person",
        "name": "Siddarth V Acharya",
        "jobTitle": "Founder & Full-Stack Engineer",
        "affiliation": {
          "@type": "Organization",
          "name": "Lend a Hand"
        },
        "url": "https://siddarth-acharya.com"
      }
    ]
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};

const ProviderOnboardingModal = () => {
  const { isProviderModalOpen, setProviderModalOpen, themeClasses, accentColor } = useApp();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isProviderModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isProviderModalOpen]);

  const handleClose = () => {
    setProviderModalOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setEmail('');
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      const currentLeads = JSON.parse(localStorage.getItem('lendahand_provider_leads') || '[]');
      localStorage.setItem('lendahand_provider_leads', JSON.stringify([...currentLeads, email]));
    }, 1500);
  };

  if (!isProviderModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="p-10 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`}>
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're on the list!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xs mx-auto">
              Thanks for your interest. We've sent a confirmation email to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>. We'll be in touch soon!
            </p>
            <Button onClick={handleClose} className="w-full">Got it, thanks</Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
             <div className={`hidden md:flex md:w-1/3 bg-gray-50 dark:bg-gray-800 p-6 flex-col justify-between border-r border-gray-100 dark:border-gray-700`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${themeClasses.bg[accentColor]} text-white mb-4`}>
                   <Briefcase size={20} />
                </div>
                <div className="space-y-6">
                   <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Earn More</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Keep 100% of your tips and competitive rates.</p>
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Be Your Own Boss</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Set your own schedule and availability.</p>
                   </div>
                </div>
             </div>

             <div className="p-6 md:p-8 flex-1">
                <div className="mb-6">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Become a Provider</h2>
                   <p className="text-gray-600 dark:text-gray-400 text-sm">Join 5,000+ professionals growing their business with Lend a Hand.</p>
                </div>

                <div className="space-y-3 mb-6 md:hidden">
                   <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className={`p-1 rounded-full ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`}><DollarSign size={12} /></div>
                      <span>Competitive earnings & 100% tips</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className={`p-1 rounded-full ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`}><Clock size={12} /></div>
                      <span>Flexible schedule</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className={`p-1 rounded-full ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`}><Zap size={12} /></div>
                      <span>Instant payouts</span>
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                   <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address</label>
                      <input 
                         type="email" 
                         required
                         placeholder="pro@example.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 ${themeClasses.ring[accentColor]} transition-all`}
                      />
                   </div>
                   <Button type="submit" className="w-full !py-3" disabled={status === 'loading'}>
                      {status === 'loading' ? <Loader className="animate-spin" size={20} /> : 'Join Provider Waitlist'}
                   </Button>
                   <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                      By joining, you agree to our Terms of Service.
                   </p>
                </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- LAYOUT COMPONENTS ---

const Navbar = () => {
  const { user, setView, logout, view, accentColor, themeClasses, setProviderModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navTo = (v) => {
    setView(v);
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navTo('landing')}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${themeClasses.bg[accentColor]}`}>
              <Shield size={20} fill="currentColor" className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Lend a Hand</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navTo('services')} className={`text-sm font-medium transition-colors ${view === 'services' ? themeClasses.text[accentColor] : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Explore Services</button>
            <button onClick={() => navTo('landing')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">How it Works</button>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                <button onClick={() => navTo('settings')} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="Settings">
                  <Settings size={20} />
                </button>
                <button onClick={() => navTo('chat')} className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <MessageSquare size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                </button>
                
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-full transition-colors">
                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-40 animate-in slide-in-from-top-2">
                         <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                           <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                         </div>
                         <button onClick={() => navTo('dashboard')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                           <Calendar size={16} /> Dashboard
                         </button>
                         <button onClick={() => navTo('settings')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                           <Settings size={16} /> Settings
                         </button>
                         <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                         <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                           <LogOut size={16} /> Sign Out
                         </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => navTo('login')}>Log In</Button>
                <Button onClick={() => navTo('register')}>Sign Up</Button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl pb-4 px-4 animate-in slide-in-from-top-2 z-50">
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="ghost" className="justify-start w-full" onClick={() => navTo('services')}>Explore Services</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => { setProviderModalOpen(true); setMobileMenuOpen(false); }}>Become a Provider</Button>
            {user ? (
              <>
                <Button variant="ghost" className="justify-start w-full" onClick={() => navTo('dashboard')}>Dashboard</Button>
                <Button variant="ghost" className="justify-start w-full" onClick={() => navTo('settings')}>Settings</Button>
                <Button variant="ghost" className="justify-start w-full" onClick={() => navTo('chat')}>Messages</Button>
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                <Button variant="danger" className="justify-start w-full mt-2" onClick={logout}>Sign Out</Button>
              </>
            ) : (
              <>
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navTo('login')}>Log In</Button>
                <Button className="w-full" onClick={() => navTo('register')}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const { setView } = useApp();
  
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4 text-white">
            <Shield size={24} fill="white" className="text-indigo-500" />
            <span className="font-bold text-xl">Lend a Hand</span>
          </div>
          <p className="text-sm leading-relaxed">Connecting you with trusted local professionals for all your home service needs.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setView('services')} className="hover:text-white transition-colors">Cleaning</button></li>
            <li><button onClick={() => setView('services')} className="hover:text-white transition-colors">Plumbing</button></li>
            <li><button onClick={() => setView('services')} className="hover:text-white transition-colors">Electrical</button></li>
            <li><button onClick={() => setView('services')} className="hover:text-white transition-colors">Gardening</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setView('about')} className="hover:text-white transition-colors">About Us</button></li>
            <li><button onClick={() => setView('founder')} className="hover:text-white transition-colors">Founder</button></li>
            <li><button onClick={() => setView('collaboration')} className="hover:text-white transition-colors">Collaboration</button></li>
            <li><button onClick={() => setView('opensource')} className="hover:text-white transition-colors">Open Source</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setView('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => setView('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

// --- PAGES ---

const SettingsPage = () => {
  const { 
    themeMode, setThemeMode, 
    accentColor, setAccentColor, 
    themeClasses, addToast, user
  } = useApp();

  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [sound, setSound] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    addToast('Preferences saved successfully!', 'success');
  };

  if (!user) return <div className="p-10 text-center">Please log in to view settings.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your appearance and app preferences</p>
        </div>

        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Moon size={20} /> Appearance
          </h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Theme Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setThemeMode(mode)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      themeMode === mode 
                      ? `${themeClasses.border[accentColor]} ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]} ring-2 ${themeClasses.ring[accentColor]} ring-offset-2 dark:ring-offset-gray-800` 
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {mode === 'light' && <Sun size={20} className="mb-2" />}
                    {mode === 'dark' && <Moon size={20} className="mb-2" />}
                    {mode === 'system' && <Settings size={20} className="mb-2" />}
                    <span className="capitalize text-sm font-medium">{mode}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Accent Color</label>
              <div className="flex flex-wrap gap-4">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${themeClasses.ring[accentColor]} ${color.id === accentColor ? 'ring-2 ring-offset-2' : ''}`}
                    style={{ backgroundColor: `var(--color-${color.id})` }} 
                  >
                    <div className={`w-10 h-10 rounded-full bg-${color.class}-600 ${accentColor === color.id ? 'ring-2 ring-white' : ''}`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell size={20} /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive booking updates via email</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, email: !notifications.email})}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? themeClasses.bg[accentColor] : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications.email ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates on your device</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, push: !notifications.push})}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications.push ? themeClasses.bg[accentColor] : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications.push ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe size={20} /> General
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
             <Input label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} disabled />
             <div className="flex items-center justify-between h-full pt-6">
                <div className="flex items-center gap-2">
                  <Volume2 className="text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-medium">Chat Sounds</span>
                </div>
                 <button 
                  onClick={() => setSound(!sound)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${sound ? themeClasses.bg[accentColor] : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${sound ? 'left-7' : 'left-1'}`}></div>
                </button>
             </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
           <Button variant="secondary">Reset Defaults</Button>
           <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { themeClasses, accentColor } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 animate-in fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Reimagining Local Trust</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We are building the digital infrastructure for the service economy, one connection at a time.
          </p>
        </div>

        <div className="grid gap-8 mb-16">
           <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">The Problem</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                 Finding reliable local help is currently a fragmented, low-trust experience. Homeowners rely on outdated directories or word-of-mouth, while skilled professionals struggle with discovery and scheduling. The market lacks a cohesive, tech-first layer to mediate these interactions securely.
              </p>
           </div>
           <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Solution</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                 Lend a Hand is a vertical SaaS solution that standardizes the booking flow. We combine real-time availability, secure communication, and verified reviews into a single, seamless interface. We aren't just a directory; we are the operating system for local services.
              </p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
           <div className="flex-1 bg-indigo-900 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Long-Term Vision</h3>
              <p className="text-indigo-200">
                 To become the default trust layer for the gig economy in emerging markets, empowering millions of service professionals with enterprise-grade tools.
              </p>
           </div>
           <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Current Stage</h3>
              <p className="text-gray-600 dark:text-gray-400">
                 We are an early-stage, founder-led product currently in public beta. We are focused on product-market fit and core user retention.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const FounderPage = () => {
  const { themeClasses, accentColor } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 animate-in fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-12">
           <div className="grid md:grid-cols-3">
              <div className={`md:col-span-1 ${themeClasses.bg[accentColor]} p-8 flex flex-col items-center justify-center text-center text-white`}>
                 <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold mb-4 backdrop-blur-sm">SA</div>
                 <h2 className="text-xl font-bold">Siddarth V Acharya</h2>
                 <p className="text-white/80 text-sm">Founder & Engineer</p>
                 <div className="flex gap-3 mt-6">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin size={18} /></button>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Github size={18} /></button>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Mail size={18} /></button>
                 </div>
              </div>
              <div className="md:col-span-2 p-8 md:p-12">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Builder. Engineer. Solopreneur.</h3>
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    I am a Computer Science undergraduate specializing in AI & ML with a singular focus: building software that solves tangible problems. Lend a Hand isn't just a project; it's a testament to the power of full-stack engineering ownership.
                 </p>
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    From designing the database schema to polishing the UI micro-interactions, every line of code in this platform was crafted to ensure scalability, performance, and a premium user experience. I believe in vertical ownership—understanding every layer of the stack to build better products.
                 </p>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-xl font-bold text-gray-900 dark:text-white pl-4 border-l-4 border-indigo-500">The Journey</h3>
           <div className="relative border-l border-gray-200 dark:border-gray-700 ml-4 space-y-12 pb-4">
              <div className="pl-8 relative">
                 <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${themeClasses.bg[accentColor]}`}></div>
                 <h4 className="font-bold text-gray-900 dark:text-white">Computer Science Undergrad (AI & ML)</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">India</p>
                 <p className="text-gray-600 dark:text-gray-300 mt-2">Focused on algorithms, distributed systems, and machine learning fundamentals.</p>
              </div>
              <div className="pl-8 relative">
                 <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600`}></div>
                 <h4 className="font-bold text-gray-900 dark:text-white">Full-Stack Development</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Independent Projects</p>
                 <p className="text-gray-600 dark:text-gray-300 mt-2">Built and deployed multiple web applications, mastering React, Node.js, and modern cloud infrastructure.</p>
              </div>
              <div className="pl-8 relative">
                 <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600`}></div>
                 <h4 className="font-bold text-gray-900 dark:text-white">Lend a Hand (MVP)</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current Focus</p>
                 <p className="text-gray-600 dark:text-gray-300 mt-2">Architected a scalable service booking platform from scratch to address local market inefficiencies.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const CollaborationPage = () => {
  const { themeClasses } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 animate-in fade-in">
       <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
             <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-4">
                Community Driven
             </div>
             <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Collaborate with Us</h1>
             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Lend a Hand is currently a founder-led initiative. We are <strong>not hiring for full-time roles</strong> at this moment, but we thrive on community collaboration.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
             <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                   <GitBranch size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Open Source</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                   We believe in building in public. We welcome contributions to our open-source modules and tooling libraries.
                </p>
                <Button variant="outline" className="w-full">View Repositories</Button>
             </div>
             <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                   <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Internships</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                   Are you a student passionate about React or Node.js? We offer mentorship-focused internships for exceptional builders.
                </p>
                <Button variant="outline" className="w-full">Apply for Waitlist</Button>
             </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Have an idea?</h3>
                <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
                   We are always open to short-term engineering or design collaborations. If you want to build something impactful, let's talk.
                </p>
                <Button className="bg-white text-indigo-900 hover:bg-gray-100">Contact Siddarth Directly</Button>
             </div>
          </div>
       </div>
    </div>
  );
};

const OpenSourcePage = () => {
  const { themeClasses, accentColor } = useApp();

  const stack = [
    { category: "Frontend Core", tools: ["React 18", "Vite", "Tailwind CSS"] },
    { category: "UI Components", tools: ["Lucide React", "Headless UI concepts"] },
    { category: "State & Logic", tools: ["React Context API", "Local Storage", "Custom Hooks"] },
    { category: "Infrastructure", tools: ["Vercel (Deployment)", "Node.js (Backend Logic)"] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 animate-in fade-in">
       <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
             <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Open Source Credits</h1>
             <p className="text-lg text-gray-600 dark:text-gray-400">
                Lend a Hand stands on the shoulders of giants. We proudly acknowledge the open-source technologies that make this platform possible.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             {stack.map((section, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                   <h3 className={`text-lg font-bold mb-4 ${themeClasses.text[accentColor]}`}>{section.category}</h3>
                   <ul className="space-y-3">
                      {section.tools.map((tool, tIdx) => (
                         <li key={tIdx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Check size={16} className="text-green-500" /> {tool}
                         </li>
                      ))}
                   </ul>
                </div>
             ))}
          </div>
          
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
             <p>All trademarks and logos remain property of their respective owners.</p>
          </div>
       </div>
    </div>
  );
};

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 animate-in fade-in">
       <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Last Updated: October 2023</p>
          
          <div className="prose dark:prose-invert max-w-none space-y-8">
             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Lock size={20} /> Data Collection</h3>
                <p className="text-gray-600 dark:text-gray-300">
                   Lend a Hand is currently a demo/portfolio application. We collect minimal data primarily for demonstration purposes. This includes:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                   <li>Mock user profiles (Name, Email) stored in local browser storage.</li>
                   <li>Simulated booking data which is not processed by any real payment gateway.</li>
                   <li>Chat messages which are stored locally for the session.</li>
                </ul>
             </section>

             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Layers size={20} /> Data Usage</h3>
                <p className="text-gray-600 dark:text-gray-300">
                   We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. 
                   Since this is a portfolio project, no real data processing occurs on a backend server.
                </p>
             </section>

             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FileText size={20} /> Cookies & Local Storage</h3>
                <p className="text-gray-600 dark:text-gray-300">
                   We use LocalStorage to persist your theme preferences (Dark/Light mode) and mock login session state so you don't have to log in every time you refresh.
                </p>
             </section>
          </div>
       </div>
    </div>
  );
};

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 animate-in fade-in">
       <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Effective Date: October 2023</p>
          
          <div className="prose dark:prose-invert max-w-none space-y-8">
             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Info size={20} /> Portfolio Project Disclaimer</h3>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
                   <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                      PLEASE NOTE: "Lend a Hand" is a portfolio project developed by Siddarth V Acharya. No real services are provided, and no real payments are processed.
                   </p>
                </div>
             </section>

             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h3>
                <p className="text-gray-600 dark:text-gray-300">
                   By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
             </section>

             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. User Responsibilities</h3>
                <p className="text-gray-600 dark:text-gray-300">
                   Users agree to use the platform for lawful purposes only. Since this is a demo environment, please do not enter sensitive real-world personal information (credit card numbers, real passwords).
                </p>
             </section>

             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Limitation of Liability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                   In no event shall the developer (Siddarth V Acharya) be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
                </p>
             </section>
          </div>
       </div>
    </div>
  );
};

const ServiceDetailPage = () => {
  const { selectedService, setView, user, addBooking, themeClasses, accentColor } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!selectedService) {
    setTimeout(() => setView('services'), 0);
    return null;
  }

  const isSlotBusy = selectedService.busySlots?.includes(selectedTime);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      full: d,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      iso: d.toISOString().split('T')[0]
    };
  });

  const handleBookClick = () => {
    if (!user) {
      setView('login');
      return;
    }
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    addBooking(selectedService, selectedDate.iso, selectedTime);
    setShowConfirm(false);
    setView('dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <button onClick={() => setView('services')} className="mb-6 flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
        <ChevronRight className="rotate-180 mr-1" size={16} /> Back to Services
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <img src={selectedService.image} alt={selectedService.title} className="w-full h-64 md:h-80 object-cover" />
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedService.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1"><User size={16} /> {selectedService.provider}</span>
                    <span className="flex items-center gap-1 text-yellow-500 font-medium"><Star size={16} fill="currentColor" /> {selectedService.rating} ({selectedService.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${themeClasses.text[accentColor]}`}>${selectedService.price}</div>
                  <div className="text-gray-500 text-sm">per {selectedService.priceUnit}</div>
                </div>
              </div>
              <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 mb-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">About this Service</h3>
                <p>{selectedService.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Date & Time</h3>
            
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Available Dates</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                    className={`flex flex-col items-center justify-center min-w-[4rem] p-3 rounded-xl border transition-all ${
                      selectedDate?.iso === d.iso 
                      ? `${themeClasses.bg[accentColor]} text-white border-transparent shadow-md` 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs opacity-80">{d.day}</span>
                    <span className="text-lg font-bold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Available Slots</label>
              <div className="grid grid-cols-2 gap-2">
                {selectedDate ? (
                  selectedService.availability.map((time) => {
                    const isBusy = selectedService.busySlots?.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all relative ${
                          selectedTime === time
                          ? `${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]} ${themeClasses.border[accentColor]} border`
                          : isBusy 
                            ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-transparent cursor-not-allowed'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent'
                        }`}
                      >
                         {time}
                         {isBusy && <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>}
                      </button>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-400 col-span-2 italic">Select a date first</p>
                )}
              </div>
              {isSlotBusy && selectedTime && (
                <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle size={12} /> High demand. This slot might be taken soon.
                </div>
              )}
            </div>

            <Button 
              className="w-full !py-3" 
              disabled={!selectedDate || !selectedTime}
              onClick={handleBookClick}
            >
              {user ? 'Request Booking' : 'Log in to Book'}
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Booking">
        <div className="space-y-4">
           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex gap-4">
              <img src={selectedService.image} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                 <h4 className="font-bold text-gray-900 dark:text-white">{selectedService.title}</h4>
                 <p className="text-sm text-gray-500">{selectedDate?.full.toDateString()} at {selectedTime}</p>
                 <p className={`text-sm font-medium ${themeClasses.text[accentColor]}`}>${selectedService.price}</p>
              </div>
           </div>
           <p className="text-sm text-gray-600 dark:text-gray-400">
             By clicking confirm, you agree to the terms of service. The provider will be notified immediately.
           </p>
           <div className="flex gap-3 mt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button className="flex-1" onClick={confirmBooking}>Confirm & Pay</Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};

// --- SERVICE CARD COMPONENT ---
const ServiceCard = ({ service, compact = false }) => {
  const { setView, setSelectedService, favorites, toggleFavorite, themeClasses, accentColor } = useApp();
  const isFav = favorites.includes(service.id);

  const handleBook = () => {
    setSelectedService(service);
    setView('service-detail');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group flex flex-col h-full relative">
      <button 
        onClick={(e) => { e.stopPropagation(); toggleFavorite(service.id); }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
      >
        <Heart size={18} className={isFav ? "text-red-500 fill-red-500" : "text-gray-400"} />
      </button>

      <div className="relative h-48 overflow-hidden">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 dark:text-white shadow-sm">
          ${service.price}/{service.priceUnit}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-bold uppercase tracking-wide ${themeClasses.text[accentColor]}`}>{service.category}</span>
          <div className="flex items-center text-yellow-500 text-sm font-bold">
            <Star size={14} fill="currentColor" className="mr-1" />
            {service.rating}
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{service.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{service.provider}</p>
        
        {!compact && <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">{service.description}</p>}
        
        <div className={`mt-auto pt-4 ${!compact ? 'border-t border-gray-50 dark:border-gray-700' : ''}`}>
          <Button variant="secondary" className="w-full text-sm" onClick={handleBook}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- LANDING PAGE ---
const LandingPage = () => {
  const { setView, themeClasses, accentColor, setProviderModalOpen } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);
  
  return (
    <div className="animate-in fade-in duration-500">
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32 overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
              Expert help, <span className={themeClasses.text[accentColor]}>delivered</span> to your doorstep.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Find trusted local professionals for cleaning, repairs, gardening, and more. Book securely in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setView('services')} className="!py-3 !px-8 text-lg">
                Book a Service
              </Button>
              <Button 
                variant="secondary" 
                className="!py-3 !px-8 text-lg" 
                onClick={() => setProviderModalOpen(true)}
              >
                Become a Provider
              </Button>
            </div>
          </div>
        </div>
        <div className={`absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-50 dark:opacity-20`}>
          <div className={`w-96 h-96 rounded-full blur-3xl ${themeClasses.bg[accentColor]} opacity-20`}></div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Services</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Top-rated professionals ready to help</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading 
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-80 animate-pulse"></div>
                ))
              : MOCK_SERVICES.slice(0, 4).map(service => (
                  <ServiceCard key={service.id} service={service} compact />
                ))
            }
          </div>
        </div>
      </section>
    </div>
  );
};

// --- AUTH PAGE ---
const AuthPage = ({ type }) => {
  const { login, setView, themeClasses, accentColor } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    login(formData.email, formData.password);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`}>
            <User size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setView(type === 'login' ? 'register' : 'login')}
              className={`font-medium ${themeClasses.text[accentColor]} hover:underline`}
            >
              {type === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {type === 'register' && (
              <Input 
                label="Full Name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            )}
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="you@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <Button type="submit" className="w-full !py-3" disabled={loading}>
            {loading ? <Loader className="animate-spin" size={20} /> : (type === 'login' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
      </div>
    </div>
  );
};

// --- SERVICES PAGE ---
const ServicesPage = () => {
  const { themeClasses, accentColor } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredServices = MOCK_SERVICES.filter(s => {
    const matchesCategory = filter === 'All' || s.category === filter;
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Services</h1>
            <p className="text-gray-500 dark:text-gray-400">Find the right professional for your needs</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search services..." 
              className={`w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 ${themeClasses.ring[accentColor]}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === cat 
                ? `${themeClasses.bg[accentColor]} text-white shadow-md` 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No services found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD PAGE ---
const DashboardPage = () => {
  const { bookings, user, setView, favorites, themeClasses, accentColor } = useApp();

  if (!user) {
    setView('login');
    return null;
  }

  const upcoming = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const favServices = MOCK_SERVICES.filter(s => favorites.includes(s.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.name}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
             <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock size={20} className={themeClasses.text[accentColor]} /> Upcoming Bookings
              </h2>
              <div className="space-y-4">
                {upcoming.length > 0 ? (
                  upcoming.map(b => (
                     <div key={b.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex gap-4 items-center">
                        <img src={b.service.image} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                           <h4 className="font-bold text-gray-900 dark:text-white">{b.service.title}</h4>
                           <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-4 mt-1">
                              <span>{b.date}</span>
                              <span>{b.time}</span>
                           </div>
                        </div>
                        <Badge status={b.status} />
                     </div>
                  ))
                ) : (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">No bookings yet.</p>
                  </div>
                )}
              </div>
            </div>
           </div>

           <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                   <Heart size={20} className="text-red-500" /> Favorite Providers
                </h2>
                <div className="space-y-4">
                   {favServices.length > 0 ? (
                      favServices.map(s => (
                         <div key={s.id} className="flex gap-3 items-center group cursor-pointer" onClick={() => { setSelectedService(s); setView('service-detail'); }}>
                            <img src={s.image} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1">
                               <h4 className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">{s.provider}</h4>
                               <p className="text-xs text-gray-500 dark:text-gray-400">{s.category}</p>
                            </div>
                            <Button variant="ghost" className="!p-1.5"><ChevronRight size={16} /></Button>
                         </div>
                      ))
                   ) : (
                     <p className="text-sm text-gray-500 dark:text-gray-400 italic">No favorites saved.</p>
                   )}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- CHAT PAGE ---
const ChatPage = () => {
  const { chats, activeChatId, setActiveChatId, sendMessage, themeClasses, accentColor } = useApp();
  const [msgInput, setMsgInput] = useState("");

  const activeChat = chats.find(c => c.id === activeChatId);
  
  useEffect(() => {
    if (!activeChatId && chats.length > 0) setActiveChatId(chats[0].id);
  }, [chats, activeChatId, setActiveChatId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    sendMessage(activeChatId, msgInput);
    setMsgInput("");
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex transition-colors">
      <div className={`w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeChatId === chat.id ? `bg-gray-50 dark:bg-gray-700/50 border-l-4 ${themeClasses.border[accentColor].replace('border-','border-l-')}`.replace('200', '500') : ''}`}
            >
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{chat.providerName}</span>
                <span className="text-xs text-gray-400">{chat.timestamp}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className={`${themeClasses.bg[accentColor]} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>{chat.unread}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeChat ? (
        <div className={`flex-1 flex flex-col h-full bg-white dark:bg-gray-800 ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveChatId(null)} className="md:hidden text-gray-500 dark:text-gray-400">
                <ChevronRight className="rotate-180" size={24} />
              </button>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`}>
                {activeChat.providerName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{activeChat.providerName}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="!p-2"><MoreVertical size={20} /></Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {activeChat.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.sender === 'me' 
                  ? `${themeClasses.bg[accentColor]} text-white rounded-br-none` 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type a message..."
                className={`flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${themeClasses.ring[accentColor]}`}
              />
              <Button type="submit" disabled={!msgInput.trim()} className="!px-3">
                <Send size={20} />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-400 flex-col gap-4">
          <MessageSquare size={48} className="opacity-20" />
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
const MainApp = () => {
  const { view } = useApp();

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900 transition-colors duration-300">
      <SchemaMarkup />
      <ToastContainer />
      <ProviderOnboardingModal />
      {view !== 'login' && view !== 'register' && <Navbar />}
      
      <main>
        {view === 'landing' && <LandingPage />}
        {(view === 'login' || view === 'register') && <AuthPage type={view} />}
        {view === 'services' && <ServicesPage />}
        {view === 'service-detail' && <ServiceDetailPage />}
        {view === 'dashboard' && <DashboardPage />}
        {view === 'chat' && <ChatPage />}
        {view === 'settings' && <SettingsPage />}
        {view === 'about' && <AboutPage />}
        {view === 'founder' && <FounderPage />}
        {view === 'collaboration' && <CollaborationPage />}
        {view === 'opensource' && <OpenSourcePage />}
        {view === 'privacy' && <PrivacyPage />}
        {view === 'terms' && <TermsPage />}
      </main>

      {view !== 'login' && view !== 'register' && view !== 'chat' && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}