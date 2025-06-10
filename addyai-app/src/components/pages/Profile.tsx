import { MdContactSupport, MdDataUsage } from 'react-icons/md';
import { NAME, PICTURE, USERID } from '../../utils/constants';
import BillingChart from '../reusable/BillingChart';
import { BiSync } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import PaymentDialog from '../reusable/PaymentSelectionDialog';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>('0.00');

  const name = localStorage.getItem(NAME) ?? '';
  const profileImage = localStorage.getItem(PICTURE) ?? '';
  const userId = localStorage.getItem(USERID);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user?id=${userId}`);
        const userData = await response.json();

        setBalance('$' + Math.floor((Number(userData.balance) / 1000) * 100) / 100);
      } catch (error) {
        console.log('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAddCreditButtonClick = () => {
    if (!showPaymentDialog) {
      setShowPaymentDialog(true);
    }
  };

  return (
    <div className="container flex flex-row w-[100vw] h-[100vh]">
      <div className="left-column flex flex-col w-[25vw] ml-4 mt-4">
        <img src={profileImage} className="w-30 h-30 mb-4" alt="profile image" />
        <strong className="font-bold mb-2">{name}</strong>
        <span className="text-sm">Member since: 5-15-2025</span>

        <div className="links mt-16">
          <ul>
            <li className="mb-4 flex flex-row">
              <MdDataUsage size={24} className="text-gray-400 mr-2" />
              <strong>Billing</strong>
            </li>
            <li className="mb-4 flex flex-row">
              <BiSync size={24} className="text-gray-400 mr-2" />
              Sync Status
            </li>
            <li className="mb-4 flex flex-row">
              <MdContactSupport size={24} className="text-gray-400 mr-2" />
              Contact Support
            </li>
          </ul>
        </div>
      </div>

      <div className="filler mt-4 ml-4 flex-grow">
        <div className="flex justify-between items-center w-full">
          <span className="text-xl">Balance: {balance}</span>
          <button className="!border-amber-400" onClick={handleAddCreditButtonClick}>
            Purchase Credit
          </button>
        </div>

        <BillingChart />
      </div>

      <PaymentDialog
        onClose={() => setShowPaymentDialog(false)}
        onError={() => setShowPaymentDialog(false)}
        onSuccess={amount => navigate(`/checkout?amount=${amount! * 100}`)}
        show={showPaymentDialog}
      />
    </div>
  );
}
