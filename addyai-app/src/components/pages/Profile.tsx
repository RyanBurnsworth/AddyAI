import { MdContactSupport, MdDataUsage } from "react-icons/md";
import { NAME, PICTURE } from "../../utils/constants";
import BillingChart from "../reusable/BillingChart";
import { BiSync } from "react-icons/bi";

export default function Profile() {
    const name = localStorage.getItem(NAME) ?? '';
    const profileImage = localStorage.getItem(PICTURE) ?? '';

    return (
        <div className="container flex flex-row w-[100vw] h-[100vh]">
            <div className="left-column flex flex-col w-[25vw] ml-4 mt-4">
                <img src="https://picsum.photos/seed/picsum/200/300" className="w-30 h-30 mb-4" alt="profile image" />
                <strong className="font-bold mb-2">{name}</strong>
                <span className="text-sm">Member since: 5-15-2025</span>

                <div className="links mt-16">
                    <ul>
                        <li className="mb-4 flex flex-row"><MdDataUsage size={24} className="text-gray-400 mr-2"/><strong>Billing</strong></li>
                        <li className="mb-4 flex flex-row"><BiSync size={24} className="text-gray-400 mr-2"/>Sync Status</li>
                        <li className="mb-4 flex flex-row"><MdContactSupport size={24} className="text-gray-400 mr-2"/>Contact Support</li>
                    </ul>
                </div>
            </div>

            <div className="filler mt-4 ml-4 flex-grow">
                <div className="flex justify-between items-center w-full">
                    <span className="text-xl">Balance: $0.00</span>
                    <button className="!border-amber-400">Purchase Credit</button>
                </div>

                <BillingChart color="#FFFACD" onHoverColor="#008000" onHoverStrokeColor="#008000" />
                
            </div>
        </div>
    );
}
