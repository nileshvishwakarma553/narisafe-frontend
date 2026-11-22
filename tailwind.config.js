/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safety: {
          primary: '#581C87',     // Deep Purple
          primaryHover: '#4C1D95',
          primaryLight: '#7E22CE',
          violet: '#7C3AED',
          violetLight: '#F5F3FF',
          accent: '#EF4444',      // Coral Red for SOS
          accentPulse: '#DC2626',
          success: '#10B981',     // Emerald Green
          background: '#F8FAFC',  // Soft White / Slate 50
          card: '#FFFFFF',
          darkNavy: '#0F172A',
          mutedText: '#64748B',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
        'soft-md': '0 8px 24px -4px rgba(15, 23, 42, 0.07)',
        'soft-lg': '0 16px 36px -6px rgba(15, 23, 42, 0.1)',
        'sos-glow': '0 0 35px 8px rgba(239, 68, 68, 0.45)',
        'primary-glow': '0 0 25px 4px rgba(124, 58, 237, 0.25)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
