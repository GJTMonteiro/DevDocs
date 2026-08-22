import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiEdit3,
  FiFileText,
  FiFolder,
  FiPlus,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

import {
  getDocumentStats,
  getDocuments,
  type Document,
  type DocumentStats,
} from '../../services/documents';

import './Dashboard.css';

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [documentsData, statsData] = await Promise.all([
          getDocuments(),
          getDocumentStats(),
        ]);

        setDocuments(documentsData);
        setStats(statsData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load dashboard.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recentDocuments = [...documents]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 4);

  const formatUpdatedDate = (date: string) => {
    const updatedAt = new Date(date);
    const now = new Date();

    const difference = now.getTime() - updatedAt.getTime();

    const minutes = Math.floor(difference / (1000 * 60));

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
      return 'Yesterday';
    }

    return `${days} days ago`;
  };

  const getDescription = (document: Document) => {
    const content = document.content.trim();

    if (content.length <= 120) {
      return content;
    }

    return `${content.slice(0, 120)}...`;
  };

  const getStatusVariant = (status: Document['status']) => {
    if (status === 'published') {
      return 'green' as const;
    }

    if (status === 'draft') {
      return 'yellow' as const;
    }

    return 'blue' as const;
  };

  const getStatusLabel = (status: Document['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="dashboard">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Workspace</p>

          <h1>Good afternoon.</h1>

          <p className="dashboard-description">
            Here's what's happening with your documentation.
          </p>
        </div>

        <Link to="/documentation/create">
          <Button>
            <FiPlus size={16} />
            Create document
          </Button>
        </Link>
      </section>

      {error && <div className="dashboard-error">{error}</div>}

      <section className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-icon blue">
            <FiFileText size={20} />
          </div>

          <div className="stat-content">
            <span>Total documents</span>

            <strong>{isLoading ? '—' : (stats?.total ?? 0)}</strong>

            <small>Documents in your workspace</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon purple">
            <FiBookOpen size={20} />
          </div>

          <div className="stat-content">
            <span>Published</span>

            <strong>{isLoading ? '—' : (stats?.published ?? 0)}</strong>

            <small>Published documents</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon yellow">
            <FiEdit3 size={20} />
          </div>

          <div className="stat-content">
            <span>Drafts</span>

            <strong>{isLoading ? '—' : (stats?.drafts ?? 0)}</strong>

            <small>Documents still in draft</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon green">
            <FiFolder size={20} />
          </div>

          <div className="stat-content">
            <span>Collections</span>

            <strong>—</strong>

            <small>Collections are not available yet</small>
          </div>
        </Card>
      </section>

      <section className="dashboard-grid">
        <Card className="dashboard-documents">
          <div className="section-header">
            <div>
              <h2>Recent documents</h2>

              <p>Recently updated documentation.</p>
            </div>

            <Link to="/documentation">
              View all
              <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="document-list">
            {!isLoading &&
              recentDocuments.map((document) => (
                <Link
                  to={`/documentation/${document.id}`}
                  className="dashboard-document"
                  key={document.id}>
                  <div className="document-icon">
                    <FiFileText size={18} />
                  </div>

                  <div className="document-info">
                    <div className="document-title-row">
                      <h3>{document.title}</h3>

                      <Badge variant={getStatusVariant(document.status)}>
                        {getStatusLabel(document.status)}
                      </Badge>
                    </div>

                    <p>{getDescription(document)}</p>

                    <div className="document-meta">
                      {document.category && (
                        <>
                          <span>{document.category}</span>

                          <span className="meta-separator">•</span>
                        </>
                      )}

                      <span>
                        <FiClock size={12} />
                        {formatUpdatedDate(document.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <FiArrowRight className="document-arrow" size={16} />
                </Link>
              ))}

            {!isLoading && recentDocuments.length === 0 && (
              <div className="dashboard-empty">
                <FiFileText size={22} />

                <p>No documents yet.</p>

                <Link to="/documentation/create">
                  Create your first document
                </Link>
              </div>
            )}
          </div>
        </Card>

        <div className="dashboard-side">
          <Card className="quick-actions">
            <div className="section-header">
              <div>
                <h2>Quick actions</h2>

                <p>Get things done faster.</p>
              </div>
            </div>

            <div className="quick-action-list">
              <Link to="/documentation/create" className="quick-action">
                <div className="quick-action-icon blue">
                  <FiPlus size={18} />
                </div>

                <div>
                  <strong>Create document</strong>

                  <span>Start writing documentation</span>
                </div>

                <FiArrowRight size={15} />
              </Link>

              <Link to="/search" className="quick-action">
                <div className="quick-action-icon purple">
                  <FiBookOpen size={18} />
                </div>

                <div>
                  <strong>Search documentation</strong>

                  <span>Find something quickly</span>
                </div>

                <FiArrowRight size={15} />
              </Link>

              <Link to="/settings" className="quick-action">
                <div className="quick-action-icon gray">
                  <FiFolder size={18} />
                </div>

                <div>
                  <strong>Manage workspace</strong>

                  <span>Configure your preferences</span>
                </div>

                <FiArrowRight size={15} />
              </Link>
            </div>
          </Card>

          <Card className="activity-card">
            <div className="section-header">
              <div>
                <h2>Recent activity</h2>

                <p>Latest workspace activity.</p>
              </div>
            </div>

            <div className="dashboard-empty">
              <FiClock size={22} />

              <p>Activity tracking is not available yet.</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
