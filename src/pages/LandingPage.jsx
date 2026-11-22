import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Radio,
  Route,
  MapPin,
  Users,
  PhoneCall,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  HeartHandshake,
  BarChart2,
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: AlertTriangle,
      title: 'One-Tap SOS Emergency',
      desc: 'Instant GPS lock with real-time socket dispatch to connected guardians and 112 emergency calling.',
      color: 'text-red-600 bg-red-50 border-red-100',
    },
    {
      icon: Radio,
      title: 'Live Location Sharing',
      desc: 'Browser Geolocation watchPosition syncs high-accuracy breadcrumbs only with authorized guardians.',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      icon: Route,
      title: 'Safer Route Navigation',
      desc: 'Evaluates street lighting, police presence, and historical incident density to recommend lower-risk corridors.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      icon: MapPin,
      title: 'Nearby Safe Places',
      desc: 'Instant discovery of 24x7 police stations, trauma hospitals, late-night pharmacies, and Sakhi crisis centers.',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      icon: Users,
      title: 'Guardian Shield Network',
      desc: 'Secure invitation and role-based permissions ensuring complete user consent and zero unauthorized tracking.',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      icon: BarChart2,
      title: 'Safety Risk Analytics',
      desc: 'Crowdsourced, verified incident reporting and spatial risk scoring built for future ML model integration.',
      color: 'text-violet-600 bg-violet-50 border-violet-100',
    },
  ];

  const helplines = [
    { name: 'National Emergency', number: '112', tag: 'All Services (Police/Ambulance)' },
    { name: 'Women Helpline', number: '181', tag: '24x7 Domestic & Distress Support' },
    { name: 'Women in Distress', number: '1091', tag: 'Police Special Cell' },
    { name: 'Medical Ambulance', number: '108', tag: 'Emergency Medical Dispatch' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-purple-200">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/narisafe-logo.png"
              alt="NariSafe Logo"
              className="w-10 h-10 rounded-2xl object-contain shadow-soft-sm bg-white"
            />
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-900 to-violet-700 bg-clip-text text-transparent">
              NariSafe
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-700 hover:bg-purple-50 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.purple.100),theme(colors.slate.50))]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider mb-6 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Women Safety Analytics & Emergency Support System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight sm:leading-none mb-6">
            Your Safety. Your Freedom.{' '}
            <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
              Our Priority.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 mb-10 leading-relaxed font-normal">
            NariSafe empowers women with real-time emergency support, trusted guardian monitoring, safer routes, and intelligent safety analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-base shadow-lg shadow-purple-700/25 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-200 shadow-sm transition flex items-center justify-center gap-2"
            >
              Explore Safety Features
            </a>
          </div>

          {/* Emergency Helpline Strip */}
          <div className="mt-14 pt-8 border-t border-purple-200/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Quick Indian Helplines:</span>
            {helplines.map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number}`}
                className="flex items-center gap-2 hover:text-purple-700 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-500" />
                <span>{h.name}: <strong className="text-slate-900 font-bold">{h.number}</strong></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How NariSafe Works */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-purple-700 uppercase tracking-widest mb-2">
              Intuitive & Transparent
            </h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              How NariSafe Works For You
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left relative">
              <span className="text-5xl font-black text-purple-200 absolute top-6 right-6">01</span>
              <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Connect Trusted Guardians</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add parents, siblings, or friends. Guardians monitor only when authorized, ensuring complete privacy and control.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left relative">
              <span className="text-5xl font-black text-purple-200 absolute top-6 right-6">02</span>
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-6 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">One-Tap Emergency SOS</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                A single tap transmits your live GPS coordinates, triggers audible alarms for guardians, and provides one-click emergency calls.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left relative">
              <span className="text-5xl font-black text-purple-200 absolute top-6 right-6">03</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-sm">
                <Route className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Safer Route Intelligence</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Compare travel options with safety scoring based on lighting, police checkpoints, and crowdsourced community reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Safety Features Grid */}
      <section id="features" className="py-20 sm:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-purple-700 uppercase tracking-widest mb-2">
              Comprehensive Protection
            </h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Engineered Exclusively for Women's Safety
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial / Mission Statement */}
      <section className="py-16 sm:py-24 bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HeartHandshake className="w-12 h-12 mx-auto text-purple-300 mb-6" />
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
            "Every woman deserves to commute, study, work, and thrive without fear. NariSafe is our technical and social commitment to that freedom."
          </h3>
          <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest">
            NariSafe Foundation • Technology for Empowerment
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-700 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-slate-900">NariSafe</span>
          </div>

          <p className="text-xs text-slate-500 text-center">
            © {new Date().getFullYear()} NariSafe. Built for Women's Safety & Emergency Support.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <Link to="/helplines" className="hover:text-purple-700">Emergency Helplines</Link>
            <Link to="/login" className="hover:text-purple-700">Sign In</Link>
            <Link to="/register" className="hover:text-purple-700">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
