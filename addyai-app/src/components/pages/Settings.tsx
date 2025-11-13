import { useEffect, useState } from 'react';
import NavBar from '../reusable/NavBar';
import { useNavigate } from 'react-router-dom';
import WarningDialog from '../reusable/WarningDialog';

export default function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lastSynced, setLastSynced] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [selectedModel, setSelectedModel] = useState('OpenAI');
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const navigate = useNavigate();

  const accountDeletionSuccessCallback = () => {
    // Clear local storage and redirect to homepage or login page
    localStorage.clear();
    navigate('/');
  }

  useEffect(() => {
    const storedName = localStorage.getItem('name') || '';
    setName(storedName);

    const storedEmail = localStorage.getItem('email') || '';
    setEmail(storedEmail);

    const storedCustomerId = localStorage.getItem('customerId') || '';
    setCustomerId(storedCustomerId);

    const storedLastSynced = localStorage.getItem('last_synced') || '';
    setLastSynced(storedLastSynced);

    const storedModel = localStorage.getItem('preferredModel') || 'OpenAI';
    setSelectedModel(storedModel);
  }, []);
  
  const handleModelUpdate = () => {
    localStorage.setItem('preferredModel', selectedModel);
      alert(`AI Model updated to ${selectedModel}`);
  };

  return (
    <>
      <div className="relative z-50">
        <NavBar />
      </div>

      <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`,
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

        <div className="relative z-10 flex flex-1 w-full pt-16">
          <div className="flex flex-col flex-1 p-4 md:p-8">
            <main className="flex-1 flex flex-col items-center justify-start w-full">
              {/* Settings Content */}
              <div className="w-full max-w-lg mt-8 bg-zinc-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-zinc-800">
                
                {/* Applied new styling */}
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent">
                  Account Info
                </h2>

                {/* Name Section */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Name</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={name}
                      disabled
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none disabled:opacity-70"
                    />
                  </div>
                </div>
                
                {/* Email Section */}
                <div className="flex flex-col space-y-2 mt-8">
                  <label className="text-sm font-medium text-zinc-400">Email</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={email}
                      disabled
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none disabled:opacity-70"
                    />
                  </div>
                </div>

                {/* AI Model Selection */}
                <div className="flex flex-col space-y-2 mt-8">
                    <label className="text-sm font-medium text-zinc-400">Preferred AI Model</label>
                    <div className="flex items-center space-x-3">
                        <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                        <option value="OpenAI">OpenAI</option>
                        <option value="Gemini">Gemini</option>
                        <option value="Claude">Claude</option>
                        </select>
                        <button
                        onClick={handleModelUpdate}
                        className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                        >
                        Update
                        </button>
                    </div>
                </div>
                
                {/* View Billing */}
                <div className="mt-8">
                    <label className="text-sm font-medium text-zinc-400">View Balance and Transaction History</label>
                    <button 
                        className="group w-full relative px-6 py-3 mt-2 mb-8 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                        onClick={() => navigate('/billing')}
                        >
                        Billing
                    </button>
                </div>
                
                {/* Cancel Account */}
                <div className="mt-8">    
                    <label className="text-sm font-medium text-zinc-400">Cancel Account from AddyAI</label>
                    <button 
                        className="group w-full relative px-6 py-3 mt-2 !bg-red-700 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                        style={{ backgroundColor: '#b91c1c' }} // Tailwind red-700 hex fallback
                        onClick={() => setShowWarningDialog(true)}
                    >
                        Cancel Addy AI Account
                    </button>
                </div>
              </div>

              {/* Data Synchronization Content */}
              <div className="w-full max-w-lg mt-8 bg-zinc-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-zinc-800">
                
                {/* Applied new styling */}
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent">
                  Google Ads Customer Info
                </h2>

                {/* Current CustomerId Section */}
                <div className="flex flex-col space-y-2 mt-8">
                  <label className="text-sm font-medium text-zinc-400">Current Customer Id</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={customerId}
                      disabled
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none disabled:opacity-70"
                    />
                  </div>
                </div>

                {/* Last Synced */}
                <div className="flex flex-col space-y-2 mt-8">
                  <label className="text-sm font-medium text-zinc-400">Last Synced</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={lastSynced}
                      disabled
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none disabled:opacity-70"
                    />
                  </div>
                </div>

                {/* First Synced */}
                <div className="flex flex-col space-y-2 mt-8">
                  <label className="text-sm font-medium text-zinc-400">First Synced</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={lastSynced}
                      disabled
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="mt-8">
                    <label className="text-sm font-medium text-zinc-400">Update Data Synchronization</label>
                    <button className="group w-full relative px-6 py-3 mt-2 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25">
                        Synchronize Data
                    </button>   
                </div>

                <div className="mt-8">
                    <label className="text-sm font-medium text-zinc-400">View Conversation History</label>
                    <button 
                        className="group w-full relative px-6 py-3 mt-2 mb-8 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                        onClick={() => navigate('/conversation-history')}
                    >
                        Conversation History
                    </button>
                </div>

                <div className="mt-8">
                    <label className="text-sm font-medium text-zinc-400">Clear Google Ads Data from Addy AI</label>
                    <button 
                        className="group w-full relative px-6 py-3 mt-2 !bg-red-700 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                        style={{ backgroundColor: '#b91c1c' }} // Tailwind red-700 hex fallback

                    >
                        Clear Google Ads Data
                    </button>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>

      <WarningDialog
        headling='Are you sure you want to delete your Addy AI account?'
        message='This action will deactivate your account and remove all associated data. This action is irreversible.'  
        confirmText='Delete Addy AI Account'
        cancelText='Cancel'
        show={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
        onSuccess={accountDeletionSuccessCallback}
      />

      {/* Animations */}
      <style>{`
        .grid-background {
          background-image: linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
