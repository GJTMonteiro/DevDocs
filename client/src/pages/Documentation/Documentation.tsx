import {
  FiBookOpen,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiFilter,
  FiFolder,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiStar,
  FiUsers,
} from 'react-icons/fi';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

import './Documentation.css';

interface DocumentItem {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  updated: string;
  views: number;
  tags: string[];
  favorite: boolean;
}

const documents: DocumentItem[] = [
  {
    id: 1,
    title: 'Authentication Guide',
    description:
      'Learn how authentication, sessions and authorization work across our applications.',
    category: 'Backend',
    author: 'Guilherme Monteiro',
    updated: '10 minutes ago',
    views: 324,
    tags: ['Auth', 'JWT', 'Security'],
    favorite: true,
  },
  {
    id: 2,
    title: 'API Architecture',
    description:
      'Overview of our REST API architecture, conventions and recommended patterns.',
    category: 'Architecture',
    author: 'Alex Silva',
    updated: '1 hour ago',
    views: 287,
    tags: ['API', 'REST', 'Architecture'],
    favorite: true,
  },
  {
    id: 3,
    title: 'React Components',
    description:
      'Internal guidelines for building reusable and maintainable React components.',
    category: 'Frontend',
    author: 'Guilherme Monteiro',
    updated: '3 hours ago',
    views: 241,
    tags: ['React', 'TypeScript', 'UI'],
    favorite: false,
  },
  {
    id: 4,
    title: 'Database Guidelines',
    description:
      'Database structure, naming conventions, relationships and best practices.',
    category: 'Database',
    author: 'João Martins',
    updated: 'Yesterday',
    views: 198,
    tags: ['PostgreSQL', 'Database'],
    favorite: false,
  },
  {
    id: 5,
    title: 'Deployment Guide',
    description:
      'Everything you need to know about deploying our applications to production.',
    category: 'DevOps',
    author: 'Alex Silva',
    updated: 'Yesterday',
    views: 176,
    tags: ['Docker', 'CI/CD', 'Production'],
    favorite: true,
  },
  {
    id: 6,
    title: 'Coding Standards',
    description:
      'Our coding standards, conventions and practices for keeping code consistent.',
    category: 'Development',
    author: 'Guilherme Monteiro',
    updated: '2 days ago',
    views: 154,
    tags: ['Code', 'Standards', 'Git'],
    favorite: false,
  },
];

const categories = [
  {
    name: 'All documents',
    count: 128,
    icon: <FiBookOpen size={17} />,
  },
  {
    name: 'Frontend',
    count: 31,
    icon: <FiFileText size={17} />,
  },
  {
    name: 'Backend',
    count: 27,
    icon: <FiFolder size={17} />,
  },
  {
    name: 'Architecture',
    count: 18,
    icon: <FiBookOpen size={17} />,
  },
  {
    name: 'DevOps',
    count: 15,
    icon: <FiUsers size={17} />,
  },
];

const Documentation = () => {
  return (
    <div className="documentation">
      <section className="documentation-header">
        <div>
          <p className="documentation-eyebrow">Knowledge base</p>

          <h1>Documentation</h1>

          <p>
            Everything your team needs to build, understand and maintain your
            products.
          </p>
        </div>

        <Button>
          <FiPlus size={16} />
          Create document
        </Button>
      </section>

      <section className="documentation-toolbar">
        <div className="documentation-search">
          <FiSearch size={17} />

          <input type="text" placeholder="Search documentation..." />

          <kbd>⌘ K</kbd>
        </div>

        <div className="documentation-filters">
          <button className="filter-button">
            <FiFilter size={15} />
            Filters
          </button>

          <button className="filter-button">
            Recently updated
            <FiChevronDown size={14} />
          </button>
        </div>
      </section>

      <div className="documentation-layout">
        <aside className="documentation-sidebar">
          <div className="documentation-sidebar-section">
            <div className="documentation-sidebar-title">
              <span>Categories</span>

              <button>
                <FiPlus size={14} />
              </button>
            </div>

            <nav className="category-list">
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  className={`category-item ${index === 0 ? 'active' : ''}`}>
                  <div>
                    {category.icon}
                    <span>{category.name}</span>
                  </div>

                  <span className="category-count">{category.count}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="documentation-sidebar-section">
            <div className="documentation-sidebar-title">
              <span>Collections</span>

              <button>
                <FiPlus size={14} />
              </button>
            </div>

            <div className="collection-list">
              <button>
                <span className="collection-dot blue" />
                Engineering
              </button>

              <button>
                <span className="collection-dot purple" />
                Product
              </button>

              <button>
                <span className="collection-dot green" />
                Design
              </button>
            </div>
          </div>
        </aside>

        <section className="documentation-content">
          <div className="documentation-content-header">
            <div>
              <h2>All documents</h2>

              <span>128 documents</span>
            </div>

            <button className="view-button">
              <FiMoreHorizontal size={17} />
            </button>
          </div>

          <div className="document-grid">
            {documents.map((document) => (
              <Card className="documentation-card" key={document.id}>
                <div className="documentation-card-top">
                  <div className="documentation-card-icon">
                    <FiFileText size={19} />
                  </div>

                  <button
                    className={`favorite-button ${
                      document.favorite ? 'favorite' : ''
                    }`}>
                    <FiStar
                      size={16}
                      fill={document.favorite ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <a
                  href={`/documentation/${document.id}`}
                  className="documentation-card-body">
                  <div className="documentation-card-title">
                    <h3>{document.title}</h3>

                    <Badge variant="blue">{document.category}</Badge>
                  </div>

                  <p>{document.description}</p>
                </a>

                <div className="documentation-card-tags">
                  {document.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="documentation-card-footer">
                  <div className="documentation-author">
                    <div>
                      {document.author
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .slice(0, 2)}
                    </div>

                    <span>{document.author}</span>
                  </div>

                  <div className="documentation-updated">
                    <FiClock size={12} />
                    {document.updated}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Documentation;
