import { useEffect, useMemo, useState } from 'react';

import {
  FiBell,
  FiCheck,
  FiChevronRight,
  FiLock,
  FiMonitor,
  FiSave,
  FiShield,
  FiUser,
  FiX,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { useTheme } from '../../context/ThemeContext';

import {
  getSettings,
  updateSettings as updateSettingsApi,
} from '../../services/settings';

import './Settings.css';

interface SettingsState {
  name: string;
  email: string;
  role: string;

  theme: 'dark' | 'light' | 'system';

  emailNotifications: boolean;
  documentationUpdates: boolean;
  mentions: boolean;

  aiAssistant: boolean;
  contextAwareResponses: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  name: 'Guilherme Monteiro',
  email: 'guilherme@example.com',
  role: 'Developer',

  theme: 'dark',

  emailNotifications: true,
  documentationUpdates: true,
  mentions: true,

  aiAssistant: true,
  contextAwareResponses: true,
};

const Settings = () => {
  const { setTheme } = useTheme();

  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  const [savedSettings, setSavedSettings] =
    useState<SettingsState>(DEFAULT_SETTINGS);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const [profileDraft, setProfileDraft] = useState({
    name: '',
    email: '',
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
          ...DEFAULT_SETTINGS,

          theme: data.theme,

          emailNotifications: data.emailNotifications,

          documentationUpdates: data.documentationUpdates,

          mentions: data.mentions,

          aiAssistant: data.aiAssistant,

          contextAwareResponses: data.contextAwareResponses,
        };

        setSettings(loadedSettings);
        setSavedSettings(loadedSettings);

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
   * CHANGE DETECTION
   * =========================================
   */

  const hasChanges = useMemo(() => {
    return (
      settings.emailNotifications !== savedSettings.emailNotifications ||
      settings.documentationUpdates !== savedSettings.documentationUpdates ||
      settings.mentions !== savedSettings.mentions ||
      settings.aiAssistant !== savedSettings.aiAssistant ||
      settings.contextAwareResponses !== savedSettings.contextAwareResponses
    );
  }, [settings, savedSettings]);

  /*
   * =========================================
   * UPDATE LOCAL STATE
   * =========================================
   */

  const updateSetting = async <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) => {
    setError(null);
    setShowSavedMessage(false);

    /*
     * Theme is persisted immediately.
     */

    if (key === 'theme') {
      const newTheme = value as SettingsState['theme'];

      const previousTheme = savedSettings.theme;

      setSettings((current) => ({
        ...current,
        theme: newTheme,
      }));

      setTheme(newTheme);

      try {
        const updated = await updateSettingsApi({
          theme: newTheme,
        });

        setSettings((current) => ({
          ...current,
          theme: updated.theme,
        }));

        setSavedSettings((current) => ({
          ...current,
          theme: updated.theme,
        }));

        setTheme(updated.theme);
      } catch (err) {
        console.error('Failed to save theme:', err);

        setError('Unable to save your theme preference.');

        setSettings((current) => ({
          ...current,
          theme: previousTheme,
        }));

        setTheme(previousTheme);
      }

      return;
    }

    /*
     * =========================================
     * OTHER SETTINGS
     * =========================================
     */

    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    /*
     * If AI Assistant is disabled,
     * context-aware responses must also
     * be disabled.
     */

    if (key === 'aiAssistant' && value === false) {
      setSettings((current) => ({
        ...current,
        aiAssistant: false,
        contextAwareResponses: false,
      }));
    }
  };

  /*
   * =========================================
   * SAVE SETTINGS
   * =========================================
   */

  const handleSaveChanges = async () => {
    if (!hasChanges || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setShowSavedMessage(false);

      const updated = await updateSettingsApi({
        theme: settings.theme,

        emailNotifications: settings.emailNotifications,

        documentationUpdates: settings.documentationUpdates,

        mentions: settings.mentions,

        aiAssistant: settings.aiAssistant,

        contextAwareResponses: settings.contextAwareResponses,
      });

      const updatedSettings: SettingsState = {
        ...settings,

        theme: updated.theme,

        emailNotifications: updated.emailNotifications,

        documentationUpdates: updated.documentationUpdates,

        mentions: updated.mentions,

        aiAssistant: updated.aiAssistant,

        contextAwareResponses: updated.contextAwareResponses,
      };

      setSettings(updatedSettings);
      setSavedSettings(updatedSettings);

      setTheme(updated.theme);

      setShowSavedMessage(true);

      window.setTimeout(() => {
        setShowSavedMessage(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);

      setError('Unable to save your settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * =========================================
   * CANCEL CHANGES
   * =========================================
   */

  const handleCancelChanges = () => {
    if (!hasChanges) {
      return;
    }

    const shouldCancel = window.confirm(
      'You have unsaved changes. Are you sure you want to discard them?',
    );

    if (!shouldCancel) {
      return;
    }

    setSettings((current) => ({
      ...current,
      emailNotifications: savedSettings.emailNotifications,

      documentationUpdates: savedSettings.documentationUpdates,

      mentions: savedSettings.mentions,

      aiAssistant: savedSettings.aiAssistant,

      contextAwareResponses: savedSettings.contextAwareResponses,
    }));

    setShowSavedMessage(false);
    setError(null);
  };

  /*
   * =========================================
   * PROFILE
   * =========================================
   */

  const handleOpenProfile = () => {
    setProfileDraft({
      name: settings.name,
      email: settings.email,
    });

    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = () => {
    const name = profileDraft.name.trim();
    const email = profileDraft.email.trim();

    if (!name || !email) {
      return;
    }

    setSettings((current) => ({
      ...current,
      name,
      email,
    }));

    setShowSavedMessage(false);
    setIsProfileModalOpen(false);
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
   * PROFILE INITIALS
   * =========================================
   */

  const initials = settings.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
            <p className="settings-eyebrow">Workspace</p>

            <h1>Settings</h1>

            <p className="settings-description">
              Manage your account, preferences and workspace settings.
            </p>
          </div>
        </section>

        <Card className="settings-card">
          <div className="settings-loading">Loading settings...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="settings">
      {/* =========================================
          HEADER
      ========================================= */}

      <section className="settings-header">
        <div>
          <p className="settings-eyebrow">Workspace</p>

          <h1>Settings</h1>

          <p className="settings-description">
            Manage your account, preferences and workspace settings.
          </p>
        </div>
      </section>

      {/* =========================================
          ERROR
      ========================================= */}

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

      {/* =========================================
          ACCOUNT
      ========================================= */}

      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>Account</h2>

            <p>Manage your personal account information.</p>
          </div>
        </div>

        <Card className="settings-card">
          <div className="settings-profile">
            <div className="settings-avatar">{initials}</div>

            <div className="settings-profile-info">
              <h3>{settings.name}</h3>

              <p>{settings.email}</p>

              <span>{settings.role}</span>
            </div>

            <Button variant="secondary" onClick={handleOpenProfile}>
              Edit profile
            </Button>
          </div>

          <div className="settings-divider" />

          <button
            type="button"
            className="settings-row settings-row-button"
            onClick={handleOpenProfile}>
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
      </section>

      {/* =========================================
          APPEARANCE
      ========================================= */}

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

            <select
              className="settings-native-select"
              value={settings.theme}
              onChange={(event) =>
                updateSetting(
                  'theme',
                  event.target.value as SettingsState['theme'],
                )
              }>
              <option value="dark">Dark</option>

              <option value="light">Light</option>

              <option value="system">System</option>
            </select>
          </div>
        </Card>
      </section>

      {/* =========================================
          NOTIFICATIONS
      ========================================= */}

      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>Notifications</h2>

            <p>Control which notifications you receive.</p>
          </div>
        </div>

        <Card className="settings-card">
          {/* EMAIL NOTIFICATIONS */}

          <div className="settings-row">
            <div className="settings-row-icon yellow">
              <FiBell size={18} />
            </div>

            <div className="settings-row-content">
              <strong>Email notifications</strong>

              <span>Receive updates about your workspace by email.</span>
            </div>

            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(event) =>
                  updateSetting('emailNotifications', event.target.checked)
                }
              />

              <span className="settings-toggle-slider" />
            </label>
          </div>

          {/* DOCUMENTATION UPDATES */}

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
                onChange={(event) =>
                  updateSetting('documentationUpdates', event.target.checked)
                }
              />

              <span className="settings-toggle-slider" />
            </label>
          </div>

          {/* MENTIONS */}

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
                onChange={(event) =>
                  updateSetting('mentions', event.target.checked)
                }
              />

              <span className="settings-toggle-slider" />
            </label>
          </div>
        </Card>
      </section>

      {/* =========================================
          AI ASSISTANT
      ========================================= */}

      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>AI Assistant</h2>

            <p>Configure how the DevDocs AI assistant works.</p>
          </div>
        </div>

        <Card className="settings-card">
          {/* AI ASSISTANT */}

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
                onChange={(event) =>
                  updateSetting('aiAssistant', event.target.checked)
                }
              />

              <span className="settings-toggle-slider" />
            </label>
          </div>

          {/* CONTEXT AWARE */}

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
                disabled={!settings.aiAssistant}
                onChange={(event) =>
                  updateSetting('contextAwareResponses', event.target.checked)
                }
              />

              <span className="settings-toggle-slider" />
            </label>
          </div>
        </Card>
      </section>

      {/* =========================================
          ACTIONS
      ========================================= */}

      <div className="settings-actions">
        {showSavedMessage && (
          <span className="settings-saved-message">
            <FiCheck size={14} />
            Changes saved
          </span>
        )}

        <Button
          variant="ghost"
          disabled={!hasChanges || isSaving}
          onClick={handleCancelChanges}>
          Cancel
        </Button>

        <Button disabled={!hasChanges || isSaving} onClick={handleSaveChanges}>
          <FiSave size={15} />

          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>

      {/* =========================================
          PROFILE MODAL
      ========================================= */}

      {isProfileModalOpen && (
        <div
          className="settings-modal-overlay"
          onClick={() => setIsProfileModalOpen(false)}>
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
                onClick={() => setIsProfileModalOpen(false)}>
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
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="settings-modal-footer">
              <Button
                variant="ghost"
                onClick={() => setIsProfileModalOpen(false)}>
                Cancel
              </Button>

              <Button
                disabled={
                  !profileDraft.name.trim() || !profileDraft.email.trim()
                }
                onClick={handleSaveProfile}>
                <FiCheck size={15} />
                Save profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          SECURITY MODAL
      ========================================= */}

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
