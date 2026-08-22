import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiFolder,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';

import './Collections.css';

interface Collection {
  id: number;
  name: string;
  description: string;
  documents: number;
  updated: string;
  color: 'blue' | 'purple' | 'green' | 'yellow';
}

const collections: Collection[] = [
  {
    id: 1,
    name: 'Engineering',
    description: 'Backend, frontend, architecture and engineering standards.',
    documents: 42,
    updated: '10 minutes ago',
    color: 'blue',
  },
  {
    id: 2,
    name: 'Frontend',
    description: 'React, TypeScript, UI components and frontend conventions.',
    documents: 28,
    updated: '3 hours ago',
    color: 'purple',
  },
  {
    id: 3,
    name: 'Infrastructure',
    description: 'Deployment, CI/CD, servers and infrastructure documentation.',
    documents: 19,
    updated: 'Yesterday',
    color: 'green',
  },
  {
    id: 4,
    name: 'Product',
    description:
      'Product requirements, workflows and internal product knowledge.',
    documents: 24,
    updated: '2 days ago',
    color: 'yellow',
  },
];

const Collections = () => {
  return (
    <div className="collections">
      <section className="collections-header">
        <div>
          <p className="collections-eyebrow">Library</p>

          <h1>Collections</h1>

          <p className="collections-description">
            Organize your documentation into meaningful knowledge groups.
          </p>
        </div>

        <button className="collections-create">
          <FiPlus size={16} />
          New collection
        </button>
      </section>

      <section className="collections-toolbar">
        <div className="collections-search">
          <FiSearch size={16} />

          <input type="text" placeholder="Search collections..." />
        </div>

        <span>{collections.length} collections</span>
      </section>

      <section className="collections-grid">
        {collections.map((collection) => (
          <Card className="collection-card" key={collection.id}>
            <div className="collection-card-header">
              <div className={`collection-icon ${collection.color}`}>
                <FiFolder size={19} />
              </div>

              <button className="collection-more">
                <FiMoreHorizontal size={17} />
              </button>
            </div>

            <div className="collection-content">
              <h2>{collection.name}</h2>

              <p>{collection.description}</p>
            </div>

            <div className="collection-footer">
              <div className="collection-meta">
                <span>
                  <FiFileText size={12} />
                  {collection.documents} documents
                </span>

                <span>
                  <FiClock size={12} />
                  {collection.updated}
                </span>
              </div>

              <button className="collection-open">
                <FiArrowRight size={15} />
              </button>
            </div>
          </Card>
        ))}
      </section>

      <section className="collections-info">
        <Card className="collections-info-card">
          <div className="collections-info-icon">
            <FiBookOpen size={18} />
          </div>

          <div>
            <h3>Organize your knowledge</h3>

            <p>
              Collections help your team group related documentation together
              and make knowledge easier to discover.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Collections;
