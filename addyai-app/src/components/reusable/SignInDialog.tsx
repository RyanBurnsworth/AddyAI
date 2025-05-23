import type DialogProps from "../../props/DialogProps";
import google_signin_button from "../../assets/google_signin_button.png"

export default function SignInDialog({ show, onClose }: DialogProps) {
  if (!show) return null;
    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative rounded bg-white to-gray-300 p-8 shadow-lg w-full max-w-lg text-center">
                <div
                    onClick={() => onClose(true)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold bg-transparent border-none focus:outline-none hover:cursor-pointer"
                    aria-label="Close">
                        &times;
                </div>

                <h2 className="text-xl text-gray-900 font-semibold mb-4">Start Chatting with your Ads!</h2>
                <p className="text-gray-800 font-weight-400 mb-4">Use your Google Ads account to sign in and get started!</p>
                <div className="flex justify-center">
                    <img 
                        src={google_signin_button} 
                        className="w-60 h-auto cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110" 
                        alt="Google Sign In" 
                        onClick={() => onClose(false)} 
                    />
                </div>
                <div className="flex justify-center text-gray-900 underline cursor-pointer mt-8">Privacy Policy</div>
            </div>
        </div>
    );
}
