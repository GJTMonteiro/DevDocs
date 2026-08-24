import { FiSearch } from 'react-icons/fi';

import NotificationBell from '../notifications/NotificationBell';

import { useUser } from '../../context/UserContext';

import './Navbar.css';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const Navbar = () => {
  const { user, isLoading } = useUser();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button type="button" className="navbar-search">
          <FiSearch size={18} />
          <span>Search documentation...</span>
          <kbd>⌘ K</kbd>
        </button>
      </div>

      <div className="navbar-right">
        <NotificationBell />

        <div className="navbar-divider" />

        {isLoading || !user ? (
          <div className="navbar-user">
            <div className="navbar-avatar">--</div>

            <div className="navbar-user-info">
              <span className="navbar-user-name">Loading...</span>

              <span className="navbar-user-role">Loading...</span>
            </div>
          </div>
        ) : (
          <button type="button" className="navbar-user">
            <div className="navbar-avatar">{getInitials(user.name)}</div>

            <div className="navbar-user-info">
              <span className="navbar-user-name">{user.name}</span>

              <span className="navbar-user-role">{user.role}</span>
            </div>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
