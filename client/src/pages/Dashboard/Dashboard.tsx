import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiEdit3,
  FiFileText,
  FiFolder,
  FiPlus,
  FiTrendingUp,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

import './Dashboard.css';

interface RecentDocument {
  id: number;
  title: string;
  description: string;
  category: string;
  updated: string;
  status: 'Published' | 'Draft';
}

const recentDocuments: RecentDocument[] = [
  {
    id: 1,
    title: 'Authentication Guide',
    description: 'How authentication and authorization work in our platform.',
    category: 'Backend',
    updated: '10 minutes ago',
    status: 'Published',
  },
  {
    id: 2,
    title: 'API Architecture',
    description: 'Overview of our REST API architecture and conventions.',
    category: 'Architecture',
    updated: '1 hour ago',
    status: 'Published',
  },
  {
    id: 3,
    title: 'React Components',
    description: 'Internal guidelines for building reusable React components.',
    category: 'Frontend',
    updated: '3 hours ago',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Database Guidelines',
    description: 'Database structure, naming conventions and best practices.',
    category: 'Database',
    updated: 'Yesterday',
    status: 'Draft',
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Header */}
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Workspace</p>

          <h1>Good afternoon, Guilherme.</h1>

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

      {/* Statistics */}
      <section className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-icon blue">
            <FiFileText size={20} />
          </div>

          <div className="stat-content">
            <span>Total documents</span>

            <strong>128</strong>

            <small>
              <FiTrendingUp size={12} />
              12% this month
            </small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon purple">
            <FiBookOpen size={20} />
          </div>

          <div className="stat-content">
            <span>Published</span>

            <strong>112</strong>

            <small>87.5% of documents</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon yellow">
            <FiEdit3 size={20} />
          </div>

          <div className="stat-content">
            <span>Drafts</span>

            <strong>16</strong>

            <small>Need your attention</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon green">
            <FiFolder size={20} />
          </div>

          <div className="stat-content">
            <span>Collections</span>

            <strong>12</strong>

            <small>Across your workspace</small>
          </div>
        </Card>
      </section>

      {/* Main dashboard content */}
      <section className="dashboard-grid">
        {/* Recent documents */}
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
            {recentDocuments.map((document) => (
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

                    <Badge
                      variant={
                        document.status === 'Published' ? 'green' : 'yellow'
                      }>
                      {document.status}
                    </Badge>
                  </div>

                  <p>{document.description}</p>

                  <div className="document-meta">
                    <span>{document.category}</span>

                    <span className="meta-separator">•</span>

                    <span>
                      <FiClock size={12} />
                      {document.updated}
                    </span>
                  </div>
                </div>

                <FiArrowRight className="document-arrow" size={16} />
              </Link>
            ))}
          </div>
        </Card>

        {/* Right column */}
        <div className="dashboard-side">
          {/* Quick actions */}
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

          {/* Recent activity */}
          <Card className="activity-card">
            <div className="section-header">
              <div>
                <h2>Recent activity</h2>

                <p>Latest workspace activity.</p>
              </div>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-avatar">GM</div>

                <div>
                  <p>
                    You updated
                    <strong>Authentication Guide</strong>
                  </p>

                  <span>10 minutes ago</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-avatar">AS</div>

                <div>
                  <p>
                    Alex created
                    <strong>Deployment Guide</strong>
                  </p>

                  <span>1 hour ago</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-avatar">JM</div>

                <div>
                  <p>
                    João published
                    <strong>API Architecture</strong>
                  </p>

                  <span>3 hours ago</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
