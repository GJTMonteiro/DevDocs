import { NavLink } from 'react-router-dom';

import {
  FiBookOpen,
  FiCompass,
  FiFilePlus,
  FiFolder,
  FiHome,
  FiSearch,
  FiSettings,
  FiStar,
} from 'react-icons/fi';

import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">D</div>

        <div className="sidebar-logo-text">
          <span>DevDocs</span>
        </div>
      </div>

      <nav className="sidebar-navigation">
        {/* Workspace */}

        <div className="sidebar-section">
          <span className="sidebar-section-title">Workspace</span>

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
            <FiHome size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/documentation"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
            <FiBookOpen size={18} />
            <span>Documentation</span>
          </NavLink>

          <NavLink
            to="/search"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
            <FiSearch size={18} />
            <span>Search</span>
          </NavLink>
        </div>

        {/* Library */}

        <div className="sidebar-section">
          <span className="sidebar-section-title">Library</span>

          <NavLink
            to="/documentation/create"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
            <FiFilePlus size={18} />
            <span>Create document</span>
          </NavLink>

          <NavLink
            to="/favorites"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
            <FiStar size={18} />
            <span>Favorites</span>
          </NavLink>

          <NavLink
            to="/collections"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
            <FiFolder size={18} />
            <span>Collections</span>
          </NavLink>
        </div>

        {/* Explore */}

        <div className="sidebar-section">
          <span className="sidebar-section-title">Explore</span>

          <NavLink
            to="/discover"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
            <FiCompass size={18} />
            <span>Discover</span>
          </NavLink>
        </div>
      </nav>

      {/* Bottom */}

      <div className="sidebar-bottom">
        <NavLink
          to="/ai-assistant"
          end
          className={({ isActive }) =>
            `sidebar-ai-card ${isActive ? 'active' : ''}`
          }>
          <div className="sidebar-ai-icon">✦</div>

          <div>
            <strong>AI Assistant</strong>
            <span>Ask about your docs</span>
          </div>
        </NavLink>

        <NavLink
          to="/settings"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }>
          <FiSettings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
