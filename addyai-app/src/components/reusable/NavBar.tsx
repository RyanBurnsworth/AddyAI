import { useEffect, useRef, useState } from 'react';
import { CUSTOMER_ID, PICTURE, REFRESH_TOKEN } from '../../utils/constants';
import { MdAdd, MdGroup, MdHistory, MdReceipt } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function NavBar() {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(PICTURE)) {
      setProfilePicture(localStorage.getItem(PICTURE)!!);
    }

    if (localStorage.getItem(REFRESH_TOKEN)) {
      setSignedIn(true);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchAccount = () => {
    localStorage.removeItem(CUSTOMER_ID);
    navigate('/chat');
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="top-0 left-0 right-0 flex flex-row justify-between items-center p-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700/50 shadow-lg w-full z-50">
      {/* Logo + Title */}
      <div
        className="flex items-center cursor-pointer ml-4 relative z-10"
        onClick={() => navigate('/')}
      >
        {/* Logo image */}
        <img
          src={logo}
          alt="AddyAI Logo"
          className="h-8 w-8 object-contain mr-2"
        />

        {/* Title */}
        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent hover:from-green-300 hover:to-amber-300 transition-colors duration-200">
          AddyAI
        </span>
      </div>

      {/* Right-side menu */}
      <div className="flex items-center relative mr-8 z-10" ref={dropdownRef}>
        {signedIn && (
          <>
            <img
              src={profilePicture}
              className="w-12 h-12 rounded-full p-1 border-2 border-zinc-600 hover:border-green-400 transition cursor-pointer relative z-10"
              alt="Profile"
              onClick={() => setDropdownOpen(prev => !prev)}
            />
            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 top-16 w-48 z-50 transition-all duration-200 origin-top-right
                ${
                  dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                } bg-zinc-800 rounded-lg shadow-xl border border-zinc-700/50 p-2`}
            >
              <div className="flex flex-col gap-2">
                <button
                  className="text-base text-left text-zinc-200 hover:bg-zinc-700/70 p-2 rounded-md transition-colors duration-150"
                  onClick={() => navigate('/chat')}
                >
                  <div className="flex flex-row items-center">
                    <MdAdd size={20} className="mr-3 text-amber-400" /> Start New
                  </div>
                </button>
                <button
                  className="text-base text-left text-zinc-200 hover:bg-zinc-700/70 p-2 rounded-md transition-colors duration-150"
                  onClick={() => handleSwitchAccount()}
                >
                  <div className="flex flex-row items-center">
                    <MdGroup size={20} className="mr-3 text-amber-400" /> Switch Account
                  </div>
                </button>
                <button
                  className="text-base text-left text-zinc-200 hover:bg-zinc-700/70 p-2 rounded-md transition-colors duration-150"
                  onClick={() => navigate('/billing')}
                >
                  <div className="flex flex-row items-center">
                    <MdReceipt size={20} className="mr-3 text-amber-400" /> Billing
                  </div>
                </button>
                <button
                  className="text-base text-left text-zinc-200 hover:bg-zinc-700/70 p-2 rounded-md transition-colors duration-150"
                  onClick={() => navigate('/conversation-history')}
                >
                  <div className="flex flex-row items-center">
                    <MdHistory size={20} className="mr-3 text-amber-400" />
                    Conversation History
                  </div>
                </button>
                <button
                  className="text-base text-left text-red-400 hover:bg-zinc-700/70 p-2 rounded-md transition-colors duration-150"
                  onClick={() => logout()}
                >
                  <div className="flex flex-row items-center">
                    <CiLogout size={20} className="mr-3 text-red-500" /> Log Out
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
