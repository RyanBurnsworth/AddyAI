import type DialogProps from '../../props/DialogProps';
import google_signin_button from '../../assets/google_signin_button.png';
import logo from '../../assets/logo.png';

export default function SignInDialog({ show, onClose }: DialogProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative rounded-2xl bg-zinc-900/90 p-8 shadow-xl w-full max-w-lg text-center border border-zinc-700">
        <div className="flex flex-row items-center justify-center mb-6">
          <img
            src={logo}
            className="rounded-full bg-zinc-800 p-2 m-4 w-20 h-20 object-cover shadow-lg border border-zinc-700" // Larger, more prominent logo
            alt="Logo"
          />
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
          Start Your AddyAI Journey
        </h2>
        <p className="text-zinc-300 font-normal mb-6 leading-relaxed">
          Connect your Google Ads account to unlock instant insights and powerful campaign
          management.
        </p>
        <div className="flex justify-center">
          <img
            src={google_signin_button}
            className="w-64 h-auto cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110"
            alt="Google Sign In"
            onClick={() => onClose!!(false)}
          />
        </div>
      </div>
    </div>
  );
}
