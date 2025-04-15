import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">Quiz Management System</div>

      {user ? (
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <div className="font-medium">{`Hello, ${user.name || 'User'}`}</div>
            <div className="text-xs capitalize">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-sm italic">Not logged in</div>
      )}
    </header>
  );
}
