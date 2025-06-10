import type DialogProps from "../../props/DialogProps";
import google_signin_button from "../../assets/google_signin_button.png"
import logo from "../../assets/logo.png"

export default function SignInDialog({ show, onClose }: DialogProps) {
  if (!show) return null;
    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative rounded bg-white to-gray-300 p-8 shadow-lg w-full max-w-lg text-center">
                <div className="flex flex-row items-center justify-center">
                    <img
                        src={logo}
                        className="rounded-full bg-gray-800 p-2 m-4 w-16 h-16 object-cover"
                        alt="Logo"
                    />
                </div> 
               <h2 className="text-xl text-gray-900 font-semibold mb-4">Start Chatting with Your Campaigns</h2>
                <p className="text-gray-800 font-weight-400 mb-4">Use your Google Ads account to unlock instant insights and conversations.</p>
                <div className="flex justify-center">
                    <img 
                        src={google_signin_button} 
                        className="w-60 h-auto cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110" 
                        alt="Google Sign In" 
                        onClick={() => onClose!!(false)} 
                    />
                </div>
            </div>
        </div>
    );
}
