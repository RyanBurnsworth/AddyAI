import NavBar from '../reusable/NavBar';

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="mb-6 text-zinc-300">
            <strong>Effective Date:</strong> 06-18-2025
          </p>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              1. Introduction
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Welcome to <strong className="text-white">AddyAI</strong> ("we", "our", or "us"). Your
              privacy is important to us. This Privacy Policy explains how we collect, use, share,
              and protect your personal information when you use our website and services.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-medium mt-4 mb-2 text-zinc-200">Personal Information</h3>
            <ul className="list-disc list-inside mb-4 text-zinc-400 leading-relaxed">
              <li>Name, email address, and contact information</li>
              <li>Google account details if you authenticate via Google</li>
              <li>Google Ads data (Campaigns, Ad Groups, Keywords, Metrics)</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2 text-zinc-200">Usage Data</h3>
            <ul className="list-disc list-inside mb-4 text-zinc-400 leading-relaxed">
              <li>Interactions with the AddyAI platform</li>
              <li>Analytics on how the site is used</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2 text-zinc-200">Technical Data</h3>
            <ul className="list-disc list-inside text-zinc-400 leading-relaxed">
              <li>IP address, browser type, device identifiers</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-zinc-400 leading-relaxed">
              <li>Provide and improve the AddyAI service</li>
              <li>Retrieve and display Google Ads metrics on your behalf</li>
              <li>Respond to your inquiries or support requests</li>
              <li>Monitor and improve system performance and security</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              4. Data Sharing and Disclosure
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We <strong className="text-white">do not sell</strong> your personal data. We may
              share information only with:
            </p>
            <ul className="list-disc list-inside text-zinc-400 leading-relaxed">
              <li>
                <strong className="text-white">Service Providers:</strong> Trusted vendors that help
                us operate AddyAI
              </li>
              <li>
                <strong className="text-white">Legal Authorities:</strong> If required by law or to
                protect our rights
              </li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              5. Google API Disclosure
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              AddyAI uses Google APIs to access your Google Ads data. Your data is only used within
              AddyAI and not shared with any third party unless required for functionality or legal
              compliance. Our use and transfer of data received from Google APIs will adhere to the
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 underline ml-1 hover:text-green-300 transition-colors"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              6. Data Retention
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We retain your data only as long as necessary to provide services or comply with legal
              obligations. You may request deletion of your data at any time by contacting us at{' '}
              <a
                href="mailto:info@addyai.com"
                className="text-green-400 underline hover:text-green-300 transition-colors"
              >
                info@addyai.com
              </a>
              .
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              7. Your Privacy Rights
            </h2>
            <p className="text-zinc-400 leading-relaxed">You may have rights such as:</p>
            <ul className="list-disc list-inside text-zinc-400 leading-relaxed">
              <li>Accessing the data we store about you</li>
              <li>Correcting or updating your information</li>
              <li>Requesting deletion of your account or data</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              8. Data Security
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We use appropriate technical and organizational measures to protect your data,
              including encryption and secure access controls.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              9. Children’s Privacy
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              AddyAI is not intended for users under 13 (or 16 in the EU). We do not knowingly
              collect data from children.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              10. Changes to This Policy
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We’ll notify you of significant
              changes and post the updated policy on this page.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-amber-300">
              11. Contact Us
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              If you have any questions, contact us at:
              <br />
              <a
                href="mailto:info@addyai.com"
                className="text-green-400 underline hover:text-green-300 transition-colors"
              >
                info@addyai.com
              </a>
              <br />
              <a
                href="https://www.addyai.com"
                className="text-green-400 underline hover:text-green-300 transition-colors"
              >
                www.addyai.com
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
