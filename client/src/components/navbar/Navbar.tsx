import { FiBell, FiSearch } from 'react-icons/fi';

import './Navbar.css';

const Navbar = () => {
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
        <button
          type="button"
          className="navbar-icon-button"
          title="Notifications"
          aria-label="Notifications">
          <FiBell size={19} />

          <span className="notification-dot" />
        </button>

        <div className="navbar-divider" />

        <button type="button" className="navbar-user">
          <div className="navbar-avatar">GM</div>

          <div className="navbar-user-info">
            <span className="navbar-user-name">Guilherme Monteiro</span>

            <span className="navbar-user-role">Developer</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
