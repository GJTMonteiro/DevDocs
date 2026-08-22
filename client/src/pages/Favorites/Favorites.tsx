import {
  FiArrowRight,
  FiClock,
  FiFileText,
  FiFolder,
  FiMoreHorizontal,
  FiSearch,
  FiStar,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

import './Favorites.css';

interface FavoriteDocument {
  id: number;
  title: string;
  description: string;
  category: string;
  collection: string;
  updated: string;
  status: 'Published' | 'Draft';
}

const favoriteDocuments: FavoriteDocument[] = [
  {
    id: 1,
    title: 'Authentication Guide',
    description:
      'How authentication and authorization work across the platform.',
    category: 'Backend',
    collection: 'Engineering',
    updated: '10 minutes ago',
    status: 'Published',
  },
  {
    id: 2,
    title: 'API Architecture',
    description:
      'Overview of the REST API architecture and internal conventions.',
    category: 'Architecture',
    collection: 'Engineering',
    updated: '1 hour ago',
    status: 'Published',
  },
  {
    id: 3,
    title: 'React Components',
    description: 'Guidelines for creating reusable React components.',
    category: 'Frontend',
    collection: 'Frontend',
    updated: '3 hours ago',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Database Guidelines',
    description: 'Database structure, naming conventions and best practices.',
    category: 'Database',
    collection: 'Engineering',
    updated: 'Yesterday',
    status: 'Draft',
  },
  {
    id: 5,
    title: 'Deployment Guide',
    description: 'How to deploy applications across our infrastructure.',
    category: 'DevOps',
    collection: 'Infrastructure',
    updated: '2 days ago',
    status: 'Published',
  },
];

const Favorites = () => {
  return (
    <div className="favorites">
      <section className="favorites-header">
        <div>
          <p className="favorites-eyebrow">Library</p>

          <h1>Favorites</h1>

          <p className="favorites-description">
            Keep your most important documentation close at hand.
          </p>
        </div>

        <div className="favorites-count">
          <FiStar size={14} />
          <span>{favoriteDocuments.length} favorites</span>
        </div>
      </section>

      <section className="favorites-toolbar">
        <div className="favorites-search">
          <FiSearch size={16} />

          <input type="text" placeholder="Search favorites..." />
        </div>

        <button className="favorites-filter">
          <FiFolder size={15} />
          All collections
        </button>

        <button className="favorites-filter">All categories</button>
      </section>

      <section className="favorites-list">
        {favoriteDocuments.map((document) => (
          <Card className="favorite-card" key={document.id}>
            <div className="favorite-icon">
              <FiFileText size={19} />
            </div>

            <div className="favorite-content">
              <div className="favorite-title-row">
                <h2>{document.title}</h2>

                <Badge
                  variant={
                    document.status === 'Published' ? 'green' : 'yellow'
                  }>
                  {document.status}
                </Badge>
              </div>

              <p>{document.description}</p>

              <div className="favorite-meta">
                <span>{document.category}</span>

                <span className="favorite-separator">•</span>

                <span>
                  <FiFolder size={12} />
                  {document.collection}
                </span>

                <span className="favorite-separator">•</span>

                <span>
                  <FiClock size={12} />
                  {document.updated}
                </span>
              </div>
            </div>

            <div className="favorite-actions">
              <button
                className="favorite-star active"
                title="Remove from favorites">
                <FiStar size={16} />
              </button>

              <button className="favorite-more" title="More options">
                <FiMoreHorizontal size={17} />
              </button>

              <button className="favorite-open" title="Open document">
                <FiArrowRight size={16} />
              </button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Favorites;
