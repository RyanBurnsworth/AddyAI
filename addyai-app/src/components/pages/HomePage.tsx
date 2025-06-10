import logo from '../../assets/logo.png';
import NavBar from '../reusable/NavBar';

export default function HomePage() {
  return (
    <>
      <NavBar />
      <div className="w-[100vw] min-h-screen bg-zinc-900 text-white overflow-y-auto">
        {/* Hero */}
        <section className="text-center py-20 px-4">
          <div className="logo-container w-full flex flex-col items-center justify-center">
            <img src={logo} className="w-48 sm:w-48 md:w-56 lg:w-96 xl:w-100 h-auto" />
          </div>
          <h1 className="text-4xl text-amber-400 sm:text-6xl font-bold mb-6">Meet AddyAI</h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-6">
            Your AI Google Ads Co-Pilot. Here to Help You Boost Productivity and Performance.
          </p>
          <button className="border-green-400 text-white px-6 py-3 rounded-xl transition">
            Launch AddyAI
          </button>
        </section>

        {/* Features */}
        <section className="grid sm:grid-cols-3 gap-8 px-8 py-16 bg-zinc-800">
          <div className="bg-zinc-700 p-6 rounded-xl shadow hover:shadow-lg transition border-green-400 border-2">
            <h3 className="text-xl font-semibold mb-2">Connect to Google Ads</h3>
            <p className="text-sm text-zinc-300">
              Get started by connecting AddyAI to your Google Ads account.
            </p>
          </div>
          <div className="bg-zinc-700 p-6 rounded-xl shadow hover:shadow-lg transition border-green-400 border-2">
            <h3 className="text-xl font-semibold mb-2">Instant Answers</h3>
            <p className="text-sm text-zinc-300">
              Get answers to any questions you may have about your Google Ads accounts.
            </p>
          </div>
          <div className="bg-zinc-700 p-6 rounded-xl shadow hover:shadow-lg transition border-green-400 border-2">
            <h3 className="text-xl font-semibold mb-2">Multiple Accounts</h3>
            <p className="text-sm text-zinc-300">
              AddyAI supports multiple accounts and manager accounts with easy to switch options.
            </p>
          </div>
        </section>

        {/* Demo Section */}
        <section className="text-center px-4 py-20">
          <h2 className="text-3xl font-bold mb-4">See AddyAI in Action</h2>
          <div className="bg-zinc-800 rounded-xl p-6 max-w-xl mx-auto shadow">
            {/* This can be replaced with an embedded chat or video */}
            <p className="text-zinc-300">👋 Try asking “What’s the weather in Paris?”</p>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="text-center p-8 bg-zinc-950">
          <p className="text-lg font-semibold mb-4">Ready to get started?</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full">
            Launch AddyAI
          </button>
        </footer>
      </div>
    </>
  );
}
