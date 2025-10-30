import NavBar from '../reusable/NavBar'; // Assuming NavBar is updated

export default function TermsOfService() {
  return (
    <>
      <NavBar />
      <div className="w-[100vw] min-h-screen flex flex-col items-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative pt-16">
        {' '}
        {/* Added pt-16 for NavBar space */}
        {/* Animated Background Grid & Radial Gradient - Matched from Home/Start */}
        <div className="fixed inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`,
            }}
          />
          <div className="grid-background" />
        </div>
        {/* Floating Particles - Matched from Home/Start */}
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
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-700 my-8">
          {' '}
          {/* Added container styling */}
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
            Terms of Service
          </h1>
          <p className="mb-6 text-zinc-300">
            <strong>Effective Date:</strong> 06-18-2025
          </p>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              1. Acceptance of Terms
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              By accessing or using AddyAI ("we", "our", or "us"), you agree to be bound by these
              Terms of Service and our{' '}
              <a
                href="/privacy"
                className="text-green-400 underline hover:text-green-300 transition-colors"
              >
                Privacy Policy
              </a>
              . If you do not agree, do not use the service.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              2. Description of Service
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              AddyAI provides tools and analytics to help users understand their Google Ads data
              more effectively. This includes dashboards, reports, AI-based insights, and more.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              3. User Accounts
            </h2>
            <ul className="list-disc list-inside text-zinc-400 leading-relaxed">
              <li>
                You must be at least 18 years old or have legal permission to use this service.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your account credentials.
              </li>
              <li>
                You agree to provide accurate and current information when creating an account.
              </li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              4. Usage Restrictions
            </h2>
            <p className="text-zinc-400 leading-relaxed">You agree not to:</p>
            <ul className="list-disc list-inside text-zinc-400 leading-relaxed">
              <li>Use the service for illegal or unauthorized purposes</li>
              <li>Reverse-engineer or attempt to access source code</li>
              <li>Resell or distribute AddyAI services without permission</li>
              <li>Access accounts or data not intended for you</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              5. Data & Privacy
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Your use of AddyAI is also governed by our
              <a
                href="/privacy"
                className="text-green-400 underline ml-1 hover:text-green-300 transition-colors"
              >
                Privacy Policy
              </a>
              . We do not sell your personal data, and any data you authorize us to access is used
              solely to provide and improve the AddyAI experience.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              6. Google API Usage
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              AddyAI integrates with the Google Ads API. Your use of this integration is subject to
              Google's
              <a
                href="https://developers.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 underline ml-1 hover:text-green-300 transition-colors"
              >
                API Terms of Service
              </a>
              .
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              7. Termination
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We may suspend or terminate your access at any time if you violate these Terms or use
              the platform in a harmful or abusive way.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              8. Limitation of Liability
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              AddyAI is provided "as-is" and "as available." We do not guarantee uninterrupted
              access or error-free performance. We are not liable for any damages resulting from
              your use of the service.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              9. Changes to Terms
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of
              significant changes. Your continued use of AddyAI constitutes your acceptance of the
              updated Terms.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              10. Contact Us
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              If you have any questions about these Terms, reach out to us at:
              <br />
              <a
                href="mailto:info@addyai.net"
                className="text-green-400 underline hover:text-green-300 transition-colors"
              >
                info@addyai.net
              </a>
              <br />
              <a
                href="https://www.addyai.net"
                className="text-green-400 underline hover:text-green-300 transition-colors"
              >
                www.addyai.net
              </a>
            </p>
          </section>
        </div>
      </div>

      {/* Matched CSS animations from Home/Start page */}
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
    </>
  );
}
