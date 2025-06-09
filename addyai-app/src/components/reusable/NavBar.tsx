import { useEffect, useRef, useState } from "react";
import { PICTURE, REFRESH_TOKEN } from "../../utils/constants";
import { MdOutlineAccountTree } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import { CiLogout, CiSettings } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-row justify-between items-center p-4">
      <div className="text-xl font-bold ml-4">AddyAI</div>

      <div className="flex items-center relative" ref={dropdownRef}>
        {signedIn && (
          <>
            <img
              src={profilePicture}
              className="w-12 h-12 rounded-full p-1 hover:bg-green-400 transition cursor-pointer"
              alt="Profile"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />

            {/* Dropdown - no visual styling added */}
            <div
              className={`absolute right-0 top-16 w-40 z-50 transition-all duration-150 origin-top-right ${
                dropdownOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <div className="flex flex-col gap-1 bg-transparent">
                <button className="text-sm text-left hover:underline">
                  <div className="flex flex-row" 
                      onClick={() => navigate('/profile')}>
                    <MdOutlineAccountTree
                      size={20}
                      className="mr-4 text-amber-400"
                    />{" "}
                    Accounts
                  </div>
                </button>
                <button className="text-sm text-left hover:underline">
                  <div className="flex flex-row">
                    <RiAccountCircleFill
                      size={20}
                      className="mr-4 text-amber-400"
                    />{" "}
                    Profile
                  </div>
                </button>
                <button className="text-sm text-left hover:underline">
                  <div className="flex flex-row">
                    <CiSettings size={20} className="mr-4 text-amber-400" />{" "}
                    Settings
                  </div>
                </button>
                <button className="text-sm text-left hover:underline text-red-600">
                  <div className="flex flex-row">
                    <CiLogout size={20} className="mr-4 text-red-500" /> Log Out
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {!signedIn && (
          <span className="cursor-pointer hover:underline mr-4">Sign In</span>
        )}
      </div>
    </div>
  );
}
