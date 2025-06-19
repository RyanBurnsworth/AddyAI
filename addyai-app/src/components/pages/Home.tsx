import { useState, useEffect } from 'react';
import { ChevronRight, Zap, Users, BarChart3, Play, ArrowRight } from 'lucide-react';
import AddyAILogo from '../reusable/logo/AddyAILogo'; // Assuming this is your logo component
import NavBar from '../reusable/NavBar'; // Assuming NavBar is updated and available
import { useNavigate } from 'react-router-dom';

interface VisibilityState {
  [key: string]: boolean;
}

export default function EnhancedHome() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentMetric, setCurrentMetric] = useState(0);
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const navigate = useNavigate();

  // Mock live metrics
  const liveMetrics = [
    { label: 'Ads Optimized Today', value: '2,847', change: '+12%' },
    { label: 'Active Users', value: '1,203', change: '+8%' },
    { label: 'Cost Saved', value: '$43,291', change: '+23%' },
    { label: 'CTR Improved', value: '156%', change: '+5%' },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Rotate metrics every 3 seconds
    const interval = setInterval(() => {
      setCurrentMetric(prev => (prev + 1) % liveMetrics.length);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, [liveMetrics.length]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`,
            transition: 'background-image 0.1s ease',
          }}
        />
        <div className="grid-background" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <NavBar /> {/* Ensure NavBar is above other content */}
        {/* Enhanced Hero Section - Better Centered */}
        <section className="relative w-[100vw] min-h-screen flex flex-col items-center justify-center px-4 py-8 pt-20">
          {' '}
          {/* Added pt-20 for navbar */}
          {/* Live Metrics Ticker - Centered */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800/50 backdrop-blur-sm border border-green-400/20 rounded-full px-6 py-2 z-20">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-mono">LIVE</span>
              <span className="text-zinc-300">{liveMetrics[currentMetric].label}:</span>
              <span className="text-amber-400 font-bold">{liveMetrics[currentMetric].value}</span>
              <span className="text-green-400 text-xs">{liveMetrics[currentMetric].change}</span>
            </div>
          </div>
          {/* Content Container - Better centering */}
          <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
            {/* Logo with enhanced effects */}
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse-slow" />
              <div className="relative logo-container">
                {/* Enhanced logo design */}
                <div className="w-48 h-48 sm:w-64 sm:h-64 mb-8 relative flex items-center justify-center">
                  <AddyAILogo size="large" />
                </div>
              </div>
            </div>

            {/* Enhanced Title - Better responsive sizing */}
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-6 text-center bg-gradient-to-r from-green-400 via-amber-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
              Meet AddyAI
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto mb-8 text-center text-zinc-300 leading-relaxed px-4">
              Your AI Google Ads Co-Pilot. Revolutionizing campaign management with
              <span className="text-green-400 font-semibold"> intelligent automation</span> and
              <span className="text-amber-400 font-semibold"> real-time optimization</span>.
            </p>

            {/* Enhanced CTA Buttons - Better centered */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
              <button
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
                onClick={() => navigate('/start')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Launch AddyAI</span>
                  <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button className="group px-8 py-4 border-2 border-amber-400/50 rounded-full font-semibold text-lg hover:bg-amber-400/10 transition-all duration-300 hover:border-amber-400">
                <div className="flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </div>
              </button>
            </div>

            {/* Trust Indicators - Better responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-zinc-400">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-400" />
                <span>10K+ Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>156% Avg CTR Boost</span>
              </div>
            </div>
          </div>
        </section>
        {/* Glassmorphism Feature Cards */}
        <section id="features" data-animate className="px-4 sm:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent">
              Supercharge Your Google Ads
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Smart Connection',
                  description:
                    'Seamlessly integrate with Google Ads using our secure OAuth2 connection. Setup takes less than 60 seconds.',
                  icon: '🔗',
                  metrics: '99.9% Uptime',
                },
                {
                  title: 'AI-Powered Insights',
                  description:
                    'Get instant answers and deep analytics about your campaigns using natural language queries.',
                  icon: '🧠',
                  metrics: '< 0.5s Response',
                },
                {
                  title: 'Multi-Account Management',
                  description:
                    'Effortlessly switch between multiple accounts and MCC structures with intelligent organization.',
                  icon: '🏢',
                  metrics: 'Unlimited Accounts',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative p-8 rounded-2xl backdrop-blur-md bg-zinc-800/30 border border-zinc-700/50 hover:border-green-400/50 transition-all duration-500 hover:transform hover:scale-105 ${
                    isVisible.features ? 'animate-slide-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-amber-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-300 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-mono text-sm">{feature.metrics}</span>
                      <ArrowRight className="w-5 h-5 text-green-400 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Interactive Demo Section - Better centered */}
        <section id="demo" data-animate className="px-4 py-20 bg-zinc-800/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">See AddyAI in Action</h2>

            <div
              className={`relative bg-zinc-900/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-zinc-700/50 ${
                isVisible.demo ? 'animate-fade-in' : 'opacity-0'
              }`}
            >
              {/* Mock Chat Interface */}
              <div className="bg-zinc-800 rounded-2xl p-4 sm:p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      You
                    </div>
                    <div className="bg-blue-600 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs sm:max-w-sm">
                      "Show me my top performing campaigns this month"
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-amber-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-zinc-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-sm sm:max-w-md">
                      <p className="mb-2">Here are your top 3 campaigns:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Holiday Sale 2024</span>
                          <span className="text-green-400">+34% CTR</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Brand Awareness Q4</span>
                          <span className="text-green-400">+28% Conv.</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Product Launch</span>
                          <span className="text-green-400">+41% ROAS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-zinc-400 mb-6 text-sm sm:text-base">
                Try it yourself - ask anything about your Google Ads performance
              </p>

              <button className="bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-400 hover:to-amber-400 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Start Free Trial
              </button>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="text-center p-8 bg-zinc-950/80 backdrop-blur-md text-zinc-300 border-t border-zinc-700/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
            {/* Navigation */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
                Navigation
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-zinc-400 hover:text-green-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-zinc-400 hover:text-green-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/tos" className="text-zinc-400 hover:text-green-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-zinc-400 hover:text-green-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
                Contact
              </h3>
              <p className="text-zinc-400 mb-2">
                Email:{' '}
                <a
                  href="mailto:support@addyai.com"
                  className="hover:text-green-400 transition-colors"
                >
                  support@addyai.com
                </a>
              </p>
              <p className="text-zinc-400">Location: Remote</p>
            </div>

            {/* Social Media */}
            <div className="flex flex-col items-center sm:items-start">
              {' '}
              {/* Align left on small screens and up */}
              <h3 className="text-lg font-semibold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
                Follow Us
              </h3>
              <div className="flex justify-center sm:justify-start gap-4 mt-2">
                {/* Twitter */}
                <a
                  href="#"
                  className="text-zinc-400 hover:text-green-400 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M8.29 20c7.547 0 11.675-6.155 11.675-11.495 0-.175 0-.349-.012-.522A8.18 8.18 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.636A4.077 4.077 0 0 0 21.448 4.1a8.19 8.19 0 0 1-2.605.981A4.1 4.1 0 0 0 16.616 4c-2.266 0-4.102 1.816-4.102 4.057 0 .318.036.627.106.924C8.41 8.841 5.383 7.1 3.242 4.533a4.025 4.025 0 0 0-.555 2.04c0 1.408.728 2.651 1.836 3.379a4.093 4.093 0 0 1-1.858-.51v.052c0 1.967 1.415 3.612 3.292 3.985a4.127 4.127 0 0 1-1.85.07c.522 1.607 2.038 2.777 3.833 2.81A8.233 8.233 0 0 1 2 18.407a11.616 11.616 0 0 0 6.29 1.827" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="#"
                  className="text-zinc-400 hover:text-green-400 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.988h-2.54v-2.889h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.889h-2.33v6.988C18.343 21.128 22 16.991 22 12" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  className="text-zinc-400 hover:text-green-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.1 1 2.5 1 4.98 2.12 4.98 3.5zM.5 7.5h4V24h-4zM8.5 7.5h3.64v2.26h.05c.5-.9 1.71-2.27 4.06-2.27 4.34 0 5.14 2.82 5.14 6.48V24h-4V15.5c0-2.03-.03-4.64-2.83-4.64-2.84 0-3.28 2.22-3.28 4.5V24h-4z" />
                  </svg>
                </a>

                {/* Reddit */}
                <a
                  href="#"
                  className="text-zinc-400 hover:text-green-400 transition-colors"
                  aria-label="Reddit"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 4.99 3.051 9.238 7.365 11.012-.1-.888-.188-2.255.038-3.228.205-.878 1.32-5.593 1.32-5.593s-.338-.676-.338-1.674c0-1.567.91-2.738 2.04-2.738.963 0 1.427.723 1.427 1.59 0 .97-.618 2.418-.937 3.763-.27 1.14.574 2.07 1.698 2.07 2.037 0 3.604-2.145 3.604-5.238 0-2.74-1.973-4.66-4.792-4.66-3.26 0-5.175 2.445-5.175 4.973 0 .982.377 2.04.848 2.615.093.113.106.211.08.326-.087.358-.29 1.14-.329 1.299-.05.21-.164.255-.38.154-1.41-.654-2.29-2.71-2.29-4.363 0-3.548 2.576-6.807 7.422-6.807 3.894 0 6.916 2.778 6.916 6.49 0 3.867-2.438 6.984-5.828 6.984-1.138 0-2.208-.592-2.574-1.295l-.703 2.679c-.254.998-.942 2.25-1.403 3.015C10.78 23.924 11.383 24 12 24c6.627 0 12-5.373 12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-zinc-500">
            {' '}
            {/* Adjusted top margin and text color */}
            &copy; {new Date().getFullYear()} AddyAI. All rights reserved.
          </div>
        </footer>
      </div>

      <style>{`
        .grid-background {
          background-image: linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes gradient-x-delayed {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: right center;
          }
          50% {
            background-size: 200% 200%;
            background-position: left center;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
        }
        .animate-gradient-x-delayed {
          animation: gradient-x-delayed 6s ease infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
