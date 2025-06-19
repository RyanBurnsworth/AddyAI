import { MdDataUsage } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function ProfileSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:block md:w-64">
      <div className="left-column flex flex-col ml-6">
        <div className="links mt-16">
          <ul>
            <li className="mb-4 flex flex-row">
              <MdDataUsage size={24} className="text-amber-400 mr-2" />
              <strong onClick={() => navigate('/billing')}>Billing</strong>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
