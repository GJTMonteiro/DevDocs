import {
  FiBell,
  FiCheck,
  FiChevronRight,
  FiGlobe,
  FiLock,
  FiMonitor,
  FiMoon,
  FiShield,
  FiUser,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import './Settings.css';

const Settings = () => {
  return (
    <div className="settings">
      {/* Header */}
      <section className="settings-header">
        <div>
          <p className="settings-eyebrow">Workspace</p>

          <h1>Settings</h1>

          <p className="settings-description">
            Manage your account, preferences and workspace settings.
          </p>
        </div>
      </section>

      {/* Account */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>Account</h2>

            <p>Manage your personal account information.</p>
          </div>
        </div>

        <Card className="settings-card">
          <div className="settings-profile">
            <div className="settings-avatar">GM</div>

            <div className="settings-profile-info">
              <h3>Guilherme Monteiro</h3>

              <p>guilherme@example.com</p>

              <span>Developer</span>
            </div>

            <Button variant="secondary">Edit profile</Button>
          </div>

          <div className="settings-divider" />

          <div className="settings-row">
            <div className="settings-row-icon blue">
              <FiUser size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Personal information</strong>

              <span>Update your name, email and profile information.</span>
            </div>

            <FiChevronRight className="settings-row-arrow" size={17} />
          </div>

          <div className="settings-row">
            <div className="settings-row-icon purple">
              <FiLock size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Password & security</strong>

              <span>Manage your password and account security.</span>
            </div>

            <FiChevronRight className="settings-row-arrow" size={17} />
          </div>
        </Card>
      </section>

      {/* Appearance */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>Appearance</h2>

            <p>Customize how DevDocs looks on your device.</p>
          </div>
        </div>

        <Card className="settings-card">
          <div className="settings-row">
            <div className="settings-row-icon gray">
              <FiMonitor size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Theme</strong>

              <span>Choose how DevDocs appears across your workspace.</span>
            </div>

            <div className="settings-select">
              <FiMoon size={15} />

              <span>Dark</span>

              <FiChevronRight size={14} />
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon blue">
              <FiGlobe size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Language</strong>

              <span>Select the language used throughout DevDocs.</span>
            </div>

            <div className="settings-select">
              <span>English</span>

              <FiChevronRight size={14} />
            </div>
          </div>
        </Card>
      </section>

      {/* Notifications */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>Notifications</h2>

            <p>Control which notifications you receive.</p>
          </div>
        </div>

        <Card className="settings-card">
          <div className="settings-row">
            <div className="settings-row-icon yellow">
              <FiBell size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Email notifications</strong>

              <span>Receive updates about your workspace by email.</span>
            </div>

            <label className="settings-toggle">
              <input type="checkbox" defaultChecked />

              <span className="settings-toggle-slider" />
            </label>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon blue">
              <FiBell size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Documentation updates</strong>

              <span>Get notified when documents you follow are updated.</span>
            </div>

            <label className="settings-toggle">
              <input type="checkbox" defaultChecked />

              <span className="settings-toggle-slider" />
            </label>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon purple">
              <FiBell size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Mentions</strong>

              <span>Receive notifications when someone mentions you.</span>
            </div>

            <label className="settings-toggle">
              <input type="checkbox" defaultChecked />

              <span className="settings-toggle-slider" />
            </label>
          </div>
        </Card>
      </section>

      {/* AI Assistant */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>AI Assistant</h2>

            <p>Configure how the DevDocs AI assistant works.</p>
          </div>
        </div>

        <Card className="settings-card">
          <div className="settings-row">
            <div className="settings-row-icon blue">✦</div>

            <div className="settings-row-content">
              <strong>AI Assistant</strong>

              <span>
                Allow the AI assistant to search and use your documentation.
              </span>
            </div>

            <label className="settings-toggle">
              <input type="checkbox" defaultChecked />

              <span className="settings-toggle-slider" />
            </label>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon purple">
              <FiShield size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Context-aware responses</strong>

              <span>
                Use relevant documentation context when generating answers.
              </span>
            </div>

            <label className="settings-toggle">
              <input type="checkbox" defaultChecked />

              <span className="settings-toggle-slider" />
            </label>
          </div>
        </Card>
      </section>

      {/* Danger Zone */}
      <section className="settings-section settings-danger-section">
        <div className="settings-section-header">
          <div>
            <h2>Danger zone</h2>

            <p>Actions in this section can affect your account.</p>
          </div>
        </div>

        <Card className="settings-card settings-danger-card">
          <div className="settings-row">
            <div className="settings-row-icon red">
              <FiUser size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Delete account</strong>

              <span>Permanently delete your account and associated data.</span>
            </div>

            <Button variant="danger" size="small">
              Delete account
            </Button>
          </div>
        </Card>
      </section>

      {/* Actions */}
      <div className="settings-actions">
        <Button variant="ghost">Cancel</Button>

        <Button>
          <FiCheck size={16} />
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
