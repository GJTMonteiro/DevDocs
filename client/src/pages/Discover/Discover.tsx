import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiFolder,
  FiGrid,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

import './Discover.css';

interface DiscoverDocument {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  updated: string;
  views: number;
}

const popularDocuments: DiscoverDocument[] = [
  {
    id: 1,
    title: 'Authentication Guide',
    description:
      'Everything you need to know about authentication and authorization.',
    category: 'Backend',
    author: 'Guilherme',
    updated: '10 minutes ago',
    views: 342,
  },
  {
    id: 2,
    title: 'API Architecture',
    description:
      'Learn how our API is structured and how services communicate.',
    category: 'Architecture',
    author: 'Alex',
    updated: '1 hour ago',
    views: 287,
  },
  {
    id: 3,
    title: 'React Components',
    description: 'Best practices for building reusable frontend components.',
    category: 'Frontend',
    author: 'João',
    updated: '3 hours ago',
    views: 231,
  },
];

const recommendedDocuments: DiscoverDocument[] = [
  {
    id: 4,
    title: 'Database Guidelines',
    description:
      'Database structure, naming conventions and recommended patterns.',
    category: 'Database',
    author: 'Guilherme',
    updated: 'Yesterday',
    views: 128,
  },
  {
    id: 5,
    title: 'Deployment Guide',
    description: 'Learn how applications are deployed to our infrastructure.',
    category: 'DevOps',
    author: 'Alex',
    updated: '2 days ago',
    views: 114,
  },
];

const Discover = () => {
  return (
    <div className="discover">
      <section className="discover-header">
        <div>
          <p className="discover-eyebrow">Explore</p>

          <h1>Discover</h1>

          <p className="discover-description">
            Explore useful documentation and discover knowledge from across your
            workspace.
          </p>
        </div>
      </section>

      <section className="discover-categories">
        <button className="discover-category active">
          <FiGrid size={16} />
          All
        </button>

        <button className="discover-category">
          <FiBookOpen size={16} />
          Engineering
        </button>

        <button className="discover-category">
          <FiZap size={16} />
          AI
        </button>

        <button className="discover-category">
          <FiUsers size={16} />
          Team
        </button>
      </section>

      <section className="discover-featured">
        <Card className="discover-featured-card">
          <div className="featured-icon">
            <FiTrendingUp size={22} />
          </div>

          <div className="featured-content">
            <Badge variant="blue">Trending</Badge>

            <h2>Most useful documentation this week</h2>

            <p>
              See what your team has been reading and using the most across the
              workspace.
            </p>
          </div>

          <button className="featured-arrow">
            <FiArrowRight size={17} />
          </button>
        </Card>
      </section>

      <section className="discover-section">
        <div className="discover-section-header">
          <div>
            <h2>Popular documentation</h2>

            <p>Documents your team is reading the most.</p>
          </div>

          <button>
            View all
            <FiArrowRight size={14} />
          </button>
        </div>

        <div className="discover-document-grid">
          {popularDocuments.map((document) => (
            <Card className="discover-document" key={document.id}>
              <div className="discover-document-icon">
                <FiFileText size={18} />
              </div>

              <Badge variant="gray">{document.category}</Badge>

              <h3>{document.title}</h3>

              <p>{document.description}</p>

              <div className="discover-document-meta">
                <span>
                  <FiUsers size={11} />
                  {document.author}
                </span>

                <span>
                  <FiTrendingUp size={11} />
                  {document.views} views
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="discover-section">
        <div className="discover-section-header">
          <div>
            <h2>Recommended for you</h2>

            <p>Documentation you may find useful.</p>
          </div>
        </div>

        <div className="discover-recommended-list">
          {recommendedDocuments.map((document) => (
            <Card className="discover-recommended" key={document.id}>
              <div className="recommended-icon">
                <FiFolder size={18} />
              </div>

              <div className="recommended-content">
                <div className="recommended-title-row">
                  <h3>{document.title}</h3>

                  <Badge variant="blue">{document.category}</Badge>
                </div>

                <p>{document.description}</p>

                <div className="recommended-meta">
                  <span>
                    <FiClock size={11} />
                    {document.updated}
                  </span>

                  <span>
                    <FiUsers size={11} />
                    {document.author}
                  </span>
                </div>
              </div>

              <button className="recommended-arrow">
                <FiArrowRight size={15} />
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Discover;
