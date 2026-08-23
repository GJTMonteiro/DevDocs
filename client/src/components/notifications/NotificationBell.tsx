import { useEffect, useMemo, useState } from 'react';

import {
  FiBell,
  FiCheck,
  FiEdit3,
  FiFileText,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from '../../services/notifications';

import './NotificationBell.css';

const REFRESH_INTERVAL = 2000;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================================
     UNREAD COUNT
  ========================================= */

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.isRead).length;
  }, [notifications]);

  /* =========================================
     LOAD NOTIFICATIONS
  ========================================= */

  const loadNotifications = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      setError(null);

      const data = await getNotifications();

      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);

      if (showLoading) {
        setError('Unable to load notifications.');
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  /* =========================================
     INITIAL LOAD + AUTO REFRESH
  ========================================= */

  useEffect(() => {
    void loadNotifications(true);

    const interval = window.setInterval(() => {
      void loadNotifications(false);
    }, REFRESH_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /* =========================================
     REFRESH WHEN WINDOW GETS FOCUS
  ========================================= */

  useEffect(() => {
    const handleFocus = () => {
      void loadNotifications(false);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  /* =========================================
     TOGGLE PANEL
  ========================================= */

  const handleToggle = () => {
    const nextOpen = !isOpen;

    setIsOpen(nextOpen);

    if (nextOpen) {
      void loadNotifications(false);
    }
  };

  /* =========================================
     MARK SINGLE NOTIFICATION AS READ
  ========================================= */

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.isRead) {
      return;
    }

    try {
      setError(null);

      const updated = await markNotificationAsRead(notification.id);

      setNotifications((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);

      setError('Unable to mark notification as read.');
    }
  };

  /* =========================================
     MARK ALL AS READ
  ========================================= */

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAll) {
      return;
    }

    try {
      setIsMarkingAll(true);
      setError(null);

      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);

      setError('Unable to mark all notifications as read.');
    } finally {
      setIsMarkingAll(false);
    }
  };

  /* =========================================
     DELETE SINGLE NOTIFICATION
  ========================================= */

  const handleDelete = async (id: string) => {
    try {
      setError(null);

      await deleteNotification(id);

      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );
    } catch (err) {
      console.error('Failed to delete notification:', err);

      setError('Unable to delete notification.');
    }
  };

  /* =========================================
     DELETE ALL NOTIFICATIONS
  ========================================= */

  const handleDeleteAll = async () => {
    if (notifications.length === 0 || isDeletingAll) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete all notifications?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingAll(true);
      setError(null);

      await deleteAllNotifications();

      // Atualização imediata da UI
      setNotifications([]);
    } catch (err) {
      console.error('Failed to delete all notifications:', err);

      setError('Unable to delete all notifications.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  /* =========================================
     NOTIFICATION ICON
  ========================================= */

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_created':
        return <FiFileText size={17} />;

      case 'document_updated':
      case 'documentation_update':
        return <FiEdit3 size={17} />;

      case 'document_deleted':
      case 'documentation_delete':
        return <FiTrash2 size={17} />;

      case 'system':
      default:
        return <FiBell size={17} />;
    }
  };

  /* =========================================
     DATE FORMAT
  ========================================= */

  const formatNotificationDate = (date: string) => {
    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return '';
    }

    return notificationDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="notification-bell">
      <button
        type="button"
        className="notification-bell-button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={handleToggle}>
        <FiBell size={19} />

        {unreadCount > 0 && (
          <span className="notification-bell-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="notification-backdrop"
            aria-label="Close notifications"
            onClick={() => setIsOpen(false)}
          />

          <div className="notification-panel">
            {/* HEADER */}

            <div className="notification-panel-header">
              <div>
                <h2>Notifications</h2>

                {unreadCount > 0 && (
                  <span>
                    {unreadCount} {unreadCount === 1 ? 'unread' : 'unread'}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="notification-close"
                aria-label="Close notifications"
                onClick={() => setIsOpen(false)}>
                <FiX size={17} />
              </button>
            </div>

            {/* ERROR */}

            {error && (
              <div className="notification-error">
                <span>{error}</span>

                <button
                  type="button"
                  aria-label="Dismiss error"
                  onClick={() => setError(null)}>
                  <FiX size={14} />
                </button>
              </div>
            )}

            {/* LOADING */}

            {isLoading ? (
              <div className="notification-state">
                <span>Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              /* EMPTY */

              <div className="notification-state">
                <FiBell size={24} />

                <strong>No notifications</strong>

                <span>You're all caught up.</span>
              </div>
            ) : (
              /* NOTIFICATION LIST */

              <div className="notification-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      notification.isRead ? 'is-read' : 'is-unread'
                    }`}
                    onClick={() => void handleMarkAsRead(notification)}>
                    <div className="notification-item-icon">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="notification-item-content">
                      <div className="notification-item-top">
                        <strong>{notification.title}</strong>

                        <button
                          type="button"
                          className="notification-delete"
                          aria-label="Delete notification"
                          onClick={(event) => {
                            event.stopPropagation();

                            void handleDelete(notification.id);
                          }}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>

                      <p>{notification.message}</p>

                      <span className="notification-date">
                        {formatNotificationDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FOOTER */}

            {!isLoading && notifications.length > 0 && (
              <div className="notification-panel-footer">
                {/* MARK ALL AS READ */}

                <button
                  type="button"
                  disabled={unreadCount === 0 || isMarkingAll}
                  onClick={() => void handleMarkAllAsRead()}>
                  <FiCheck size={14} />

                  {isMarkingAll ? 'Marking...' : 'Mark all as read'}
                </button>

                {/* DELETE ALL */}

                <button
                  type="button"
                  className="notification-delete-all"
                  disabled={isDeletingAll}
                  onClick={() => void handleDeleteAll()}>
                  <FiTrash2 size={14} />

                  {isDeletingAll ? 'Deleting...' : 'Delete all'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
