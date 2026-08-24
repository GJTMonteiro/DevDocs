import { useEffect, useState } from 'react';

import {
  FiBell,
  FiCheck,
  FiChevronRight,
  FiLock,
  FiMonitor,
  FiShield,
  FiUser,
  FiX,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

import {
  getSettings,
  updateSettings as updateSettingsApi,
} from '../../services/settings';

import { updateProfile } from '../../services/profile';

import './Settings.css';

interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  emailNotifications: boolean;
  documentationUpdates: boolean;
  mentions: boolean;
  aiAssistant: boolean;
  contextAwareResponses: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'dark',
  emailNotifications: true,
  documentationUpdates: true,
  mentions: true,
  aiAssistant: true,
  contextAwareResponses: true,
};

const ROLE_OPTIONS = [
  'Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Software Engineer',
  'Software Architect',
  'Solutions Architect',
  'Technical Lead',
  'Engineering Manager',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Cloud Engineer',
  'Cloud Architect',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'QA Engineer',
  'QA Automation Engineer',
  'Security Engineer',
  'Cybersecurity Specialist',
  'IT Support',
  'System Administrator',
  'Database Administrator',
  'Network Engineer',
  'UI Designer',
  'UX Designer',
  'UI/UX Designer',
  'Product Designer',
  'Graphic Designer',
  'Product Manager',
  'Project Manager',
  'Program Manager',
  'Scrum Master',
  'Business Analyst',
  'Technical Writer',
  'Documentation Specialist',
  'Product Owner',
  'Researcher',
  'Marketing Manager',
  'Content Manager',
  'HR Manager',
  'Administrator',
  'Founder',
  'Co-Founder',
  'Other',
];

const Settings = () => {
  const { setTheme } = useTheme();
  const { user, updateUser } = useUser();

  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const [profileDraft, setProfileDraft] = useState({
    name: '',
    email: '',
    role: 'Developer',
  });

  const [showSavedMessage, setShowSavedMessage] = useState(false);

  /*
   * =========================================
   * LOAD SETTINGS
   * =========================================
   */

  useEffect(() => {
    let isMounted = true;

    const loadUserSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getSettings();

        if (!isMounted) {
          return;
        }

        const loadedSettings: SettingsState = {
          theme: data.theme,
          emailNotifications: data.emailNotifications,
          documentationUpdates: data.documentationUpdates,
          mentions: data.mentions,
          aiAssistant: data.aiAssistant,
          contextAwareResponses: data.contextAwareResponses,
        };

        setSettings(loadedSettings);
        setTheme(loadedSettings.theme);
      } catch (err) {
        console.error('Failed to load settings:', err);

        if (isMounted) {
          setError('Unable to load your settings. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUserSettings();

    return () => {
      isMounted = false;
    };
  }, [setTheme]);

  /*
   * =========================================
   * UPDATE SETTING
   * =========================================
   *
   * Every setting is saved immediately.
   */

  const updateSetting = async <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) => {
    setError(null);
    setShowSavedMessage(false);

    const previousSettings = settings;

    let newSettings: SettingsState = {
      ...settings,
      [key]: value,
    };

    /*
     * If AI Assistant is disabled,
     * Context-aware responses are also disabled.
     */
    if (key === 'aiAssistant' && value === false) {
      newSettings = {
        ...newSettings,
        aiAssistant: false,
        contextAwareResponses: false,
      };
    }

    setSettings(newSettings);

    /*
     * Theme is also applied immediately.
     */
    if (key === 'theme') {
      setTheme(value as SettingsState['theme']);
    }

    try {
      setIsSaving(true);

      const updated = await updateSettingsApi({
        theme: newSettings.theme,
        emailNotifications: newSettings.emailNotifications,
        documentationUpdates: newSettings.documentationUpdates,
        mentions: newSettings.mentions,
        aiAssistant: newSettings.aiAssistant,
        contextAwareResponses: newSettings.contextAwareResponses,
      });

      const updatedSettings: SettingsState = {
        ...newSettings,
        theme: updated.theme,
        emailNotifications: updated.emailNotifications,
        documentationUpdates: updated.documentationUpdates,
        mentions: updated.mentions,
        aiAssistant: updated.aiAssistant,
        contextAwareResponses: updated.contextAwareResponses,
      };

      setSettings(updatedSettings);
      setTheme(updated.theme);

      setShowSavedMessage(true);

      window.setTimeout(() => {
        setShowSavedMessage(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to save setting:', err);

      setSettings(previousSettings);

      if (key === 'theme') {
        setTheme(previousSettings.theme);
      }

      setError('Unable to save your setting. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * =========================================
   * PROFILE
   * =========================================
   */

  const handleOpenProfile = () => {
    if (!user) {
      return;
    }

    setProfileDraft({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setError(null);
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = async () => {
    const name = profileDraft.name.trim();
    const email = profileDraft.email.trim();
    const role = profileDraft.role.trim();

    if (!name || !email || !role || isSaving || !user) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setShowSavedMessage(false);

      const updatedProfile = await updateProfile(name, email, role);

      updateUser({
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
      });

      setProfileDraft({
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
      });

      setIsProfileModalOpen(false);

      setShowSavedMessage(true);

      window.setTimeout(() => {
        setShowSavedMessage(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to save profile:', err);

      setError('Unable to update your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * =========================================
   * SECURITY
   * =========================================
   */

  const handleOpenSecurity = () => {
    setIsSecurityModalOpen(true);
  };

  /*
   * =========================================
   * USER DISPLAY DATA
   * =========================================
   */

  const displayName = user?.name ?? 'Loading...';
  const displayEmail = user?.email ?? 'Loading...';
  const displayRole = user?.role ?? 'Developer';

  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '--';

  /*
   * =========================================
   * LOADING STATE
   * =========================================
   */

  if (isLoading) {
    return (
      <div className="settings">
        <section className="settings-header">
          <div>
            <p className="settings-eyebrow">Preferences</p>

            <h1>Settings</h1>

            <p className="settings-description">
              Manage your account and application preferences.
            </p>
          </div>
        </section>

        <Card className="settings-card">
          <div className="settings-loading">Loading settings...</div>
        </Card>
      </div>
    );
  }

  /*
   * =========================================
   * PAGE
   * =========================================
   */

  return (
    <div className="settings">
      {/* HEADER */}

      <section className="settings-header">
        <div>
          <p className="settings-eyebrow">Preferences</p>

          <h1>Settings</h1>

          <p className="settings-description">
            Manage your account and application preferences.
          </p>
        </div>

        {showSavedMessage && (
          <span className="settings-saved-message">
            <FiCheck size={14} />
            Changes saved
          </span>
        )}
      </section>

      {/* ERROR */}

      {error && (
        <div className="settings-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* MAIN */}

      <section className="settings-grid">
        <div className="settings-main">
          {/* ACCOUNT */}

          <Card className="settings-card">
            <div className="section-header">
              <div>
                <h2>Account</h2>

                <p>Manage your personal account information.</p>
              </div>
            </div>

            <div className="settings-profile">
              <div className="settings-avatar">{initials}</div>

              <div className="settings-profile-info">
                <h3>{displayName}</h3>

                <p>{displayEmail}</p>

                <span>{displayRole}</span>
              </div>

              <Button
                variant="secondary"
                onClick={handleOpenProfile}
                disabled={!user}>
                Edit profile
              </Button>
            </div>

            <div className="settings-divider" />

            <button
              type="button"
              className="settings-row settings-row-button"
              onClick={handleOpenProfile}
              disabled={!user}>
              <div className="settings-row-icon blue">
                <FiUser size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Personal information</strong>

                <span>Update your name, email and profile information.</span>
              </div>

              <FiChevronRight className="settings-row-arrow" size={17} />
            </button>

            <button
              type="button"
              className="settings-row settings-row-button"
              onClick={handleOpenSecurity}>
              <div className="settings-row-icon purple">
                <FiLock size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Password & security</strong>

                <span>Manage your password and account security.</span>
              </div>

              <FiChevronRight className="settings-row-arrow" size={17} />
            </button>
          </Card>

          {/* APPEARANCE */}

          <Card className="settings-card">
            <div className="section-header">
              <div>
                <h2>Appearance</h2>

                <p>Customize how DevDocs looks on your device.</p>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-icon gray">
                <FiMonitor size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Theme</strong>

                <span>Choose how DevDocs appears across your application.</span>
              </div>

              <select
                className="settings-native-select"
                value={settings.theme}
                onChange={(event) =>
                  updateSetting(
                    'theme',
                    event.target.value as SettingsState['theme'],
                  )
                }
                disabled={isSaving}>
                <option value="dark">Dark</option>

                <option value="light">Light</option>

                <option value="system">System</option>
              </select>
            </div>
          </Card>

          {/* NOTIFICATIONS */}

          <Card className="settings-card">
            <div className="section-header">
              <div>
                <h2>Notifications</h2>

                <p>Control which notifications you receive.</p>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-icon yellow">
                <FiBell size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Email notifications</strong>

                <span>Receive updates about your documentation by email.</span>
              </div>

              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  disabled={isSaving}
                  onChange={(event) =>
                    updateSetting('emailNotifications', event.target.checked)
                  }
                />

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
                <input
                  type="checkbox"
                  checked={settings.documentationUpdates}
                  disabled={isSaving}
                  onChange={(event) =>
                    updateSetting('documentationUpdates', event.target.checked)
                  }
                />

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
                <input
                  type="checkbox"
                  checked={settings.mentions}
                  disabled={isSaving}
                  onChange={(event) =>
                    updateSetting('mentions', event.target.checked)
                  }
                />

                <span className="settings-toggle-slider" />
              </label>
            </div>
          </Card>

          {/* AI ASSISTANT */}

          <Card className="settings-card">
            <div className="section-header">
              <div>
                <h2>AI Assistant</h2>

                <p>Configure how the DevDocs AI assistant works.</p>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-icon blue">✦</div>

              <div className="settings-row-content">
                <strong>AI Assistant</strong>

                <span>
                  Allow the AI assistant to search and use your documentation.
                </span>
              </div>

              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.aiAssistant}
                  disabled={isSaving}
                  onChange={(event) =>
                    updateSetting('aiAssistant', event.target.checked)
                  }
                />

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
                <input
                  type="checkbox"
                  checked={settings.contextAwareResponses}
                  disabled={!settings.aiAssistant || isSaving}
                  onChange={(event) =>
                    updateSetting('contextAwareResponses', event.target.checked)
                  }
                />

                <span className="settings-toggle-slider" />
              </label>
            </div>
          </Card>
        </div>
      </section>

      {/* PROFILE MODAL */}

      {isProfileModalOpen && (
        <div
          className="settings-modal-overlay"
          onClick={() => !isSaving && setIsProfileModalOpen(false)}>
          <div
            className="settings-modal"
            onClick={(event) => event.stopPropagation()}>
            <div className="settings-modal-header">
              <div>
                <span className="settings-modal-eyebrow">Account</span>

                <h2>Edit profile</h2>
              </div>

              <button
                type="button"
                className="settings-modal-close"
                onClick={() => !isSaving && setIsProfileModalOpen(false)}
                disabled={isSaving}>
                <FiX size={17} />
              </button>
            </div>

            <div className="settings-modal-body">
              <div className="settings-form-field">
                <label htmlFor="settings-name">Name</label>

                <input
                  id="settings-name"
                  type="text"
                  value={profileDraft.name}
                  disabled={isSaving}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="settings-form-field">
                <label htmlFor="settings-email">Email</label>

                <input
                  id="settings-email"
                  type="email"
                  value={profileDraft.email}
                  disabled={isSaving}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="settings-form-field">
                <label htmlFor="settings-role">Role</label>

                <select
                  id="settings-role"
                  className="settings-native-select"
                  value={profileDraft.role}
                  disabled={isSaving}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      role: event.target.value,
                    }))
                  }>
                  {profileDraft.role &&
                    !ROLE_OPTIONS.includes(profileDraft.role) && (
                      <option value={profileDraft.role}>
                        {profileDraft.role}
                      </option>
                    )}

                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="settings-modal-footer">
              <Button
                variant="ghost"
                disabled={isSaving}
                onClick={() => setIsProfileModalOpen(false)}>
                Cancel
              </Button>

              <Button
                disabled={
                  !profileDraft.name.trim() ||
                  !profileDraft.email.trim() ||
                  !profileDraft.role.trim() ||
                  isSaving
                }
                onClick={handleSaveProfile}>
                <FiCheck size={15} />

                {isSaving ? 'Saving...' : 'Save profile'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY MODAL */}

      {isSecurityModalOpen && (
        <div
          className="settings-modal-overlay"
          onClick={() => setIsSecurityModalOpen(false)}>
          <div
            className="settings-modal"
            onClick={(event) => event.stopPropagation()}>
            <div className="settings-modal-header">
              <div>
                <span className="settings-modal-eyebrow">Security</span>

                <h2>Password & security</h2>
              </div>

              <button
                type="button"
                className="settings-modal-close"
                onClick={() => setIsSecurityModalOpen(false)}>
                <FiX size={17} />
              </button>
            </div>

            <div className="settings-modal-body">
              <div className="settings-security-placeholder">
                <div className="settings-security-icon">
                  <FiLock size={20} />
                </div>

                <h3>Authentication is not connected yet</h3>

                <p>
                  Password changes, sessions and authentication security will
                  become available when the DevDocs authentication system is
                  implemented.
                </p>
              </div>
            </div>

            <div className="settings-modal-footer">
              <Button onClick={() => setIsSecurityModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
