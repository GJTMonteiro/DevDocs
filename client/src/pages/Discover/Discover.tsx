import { useEffect, useMemo, useState } from 'react';

import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiGrid,
  FiSearch,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { getDocuments, type Document } from '../../services/documents';

import './Discover.css';

type DiscoverFilter = 'all' | 'engineering' | 'ai' | 'team';

const Discover = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeFilter, setActiveFilter] = useState<DiscoverFilter>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await getDocuments();

        setDocuments(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load documents.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesSearch =
        !normalizedSearch ||
        document.title.toLowerCase().includes(normalizedSearch) ||
        document.content.toLowerCase().includes(normalizedSearch) ||
        document.category?.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      if (activeFilter === 'all') {
        return true;
      }

      const category = document.category?.toLowerCase() ?? '';

      if (activeFilter === 'engineering') {
        return (
          category.includes('engineering') ||
          category.includes('frontend') ||
          category.includes('backend') ||
          category.includes('database') ||
          category.includes('devops') ||
          category.includes('development') ||
          category.includes('architecture')
        );
      }

      if (activeFilter === 'ai') {
        return (
          category.includes('ai') ||
          category.includes('artificial intelligence') ||
          category.includes('machine learning') ||
          document.title.toLowerCase().includes('ai')
        );
      }

      if (activeFilter === 'team') {
        return (
          category.includes('team') ||
          category.includes('process') ||
          category.includes('management') ||
          category.includes('guidelines')
        );
      }

      return true;
    });
  }, [documents, activeFilter, search]);

  const recommendedDocuments = useMemo(() => {
    return [...filteredDocuments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [filteredDocuments]);

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

    if (days < 7) {
      return `${days} days ago`;
    }

    return updatedAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDescription = (document: Document) => {
    const content = document.content.trim();

    if (!content) {
      return 'No description available for this document.';
    }

    if (content.length <= 180) {
      return content;
    }

    return `${content.slice(0, 180)}...`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="discover">
      {/* HEADER */}
      <section className="discover-header">
        <div>
          <p className="discover-eyebrow">Library</p>

          <h1>Discover</h1>

          <p className="discover-description">
            Explore useful documentation and discover knowledge from across your
            workspace.
          </p>
        </div>

        <div className="discover-count">
          <FiBookOpen size={14} />

          <span>
            {filteredDocuments.length}{' '}
            {filteredDocuments.length === 1 ? 'document' : 'documents'}
          </span>
        </div>
      </section>

      {/* ERROR */}
      {error && <div className="discover-error">{error}</div>}

      {/* TOOLBAR */}
      <section className="discover-toolbar">
        <div className="discover-search">
          <FiSearch size={16} />

          <input
            type="text"
            placeholder="Search documentation..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="discover-filters">
          <button
            type="button"
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => setActiveFilter('all')}>
            <FiGrid size={15} />
            All
          </button>

          <button
            type="button"
            className={activeFilter === 'engineering' ? 'active' : ''}
            onClick={() => setActiveFilter('engineering')}>
            <FiBookOpen size={15} />
            Engineering
          </button>

          <button
            type="button"
            className={activeFilter === 'ai' ? 'active' : ''}
            onClick={() => setActiveFilter('ai')}>
            <FiZap size={15} />
            AI
          </button>

          <button
            type="button"
            className={activeFilter === 'team' ? 'active' : ''}
            onClick={() => setActiveFilter('team')}>
            <FiUsers size={15} />
            Team
          </button>
        </div>
      </section>

      {/* LOADING */}
      {isLoading && (
        <section className="discover-empty">
          <FiFileText size={24} />

          <h2>Loading documentation...</h2>

          <p>Fetching documents from your workspace.</p>
        </section>
      )}

      {/* NO DOCUMENTS */}
      {!isLoading && !error && documents.length === 0 && (
        <section className="discover-empty">
          <FiFileText size={24} />

          <h2>No documentation yet</h2>

          <p>Create a document to start building your knowledge base.</p>

          <button
            type="button"
            onClick={() => navigate('/documentation/create')}>
            <FiFileText size={15} />
            Create document
          </button>
        </section>
      )}

      {/* NO RESULTS */}
      {!isLoading &&
        !error &&
        documents.length > 0 &&
        filteredDocuments.length === 0 && (
          <section className="discover-empty">
            <FiSearch size={24} />

            <h2>No documentation found</h2>

            <p>Try changing your search or category filter.</p>
          </section>
        )}

      {/* DOCUMENTS */}
      {!isLoading && !error && filteredDocuments.length > 0 && (
        <section className="discover-list">
          {filteredDocuments.map((document) => (
            <Card className="discover-card" key={document.id}>
              <div className="discover-icon">
                <FiFileText size={19} />
              </div>

              <Link
                to={`/documentation/${document.id}`}
                className="discover-content">
                <div className="discover-title-row">
                  <h2>{document.title}</h2>

                  {document.category && (
                    <Badge variant="gray">{document.category}</Badge>
                  )}
                </div>

                <p>{getDescription(document)}</p>

                <div className="discover-meta">
                  <span>
                    <FiUsers size={11} />

                    <span>{getInitials(document.author.name)}</span>

                    {document.author.name}
                  </span>

                  <span>
                    <FiClock size={12} />

                    {formatUpdatedDate(document.updatedAt)}
                  </span>
                </div>
              </Link>

              <Link
                to={`/documentation/${document.id}`}
                className="discover-open"
                title="Open document">
                <FiArrowRight size={16} />
              </Link>
            </Card>
          ))}
        </section>
      )}

      {/* RECOMMENDED */}
      {!isLoading && !error && recommendedDocuments.length > 0 && (
        <section className="discover-recommended">
          <div className="discover-section-header">
            <div>
              <p className="discover-eyebrow">Explore</p>

              <h2>Recommended for you</h2>

              <p>Documentation you may find useful.</p>
            </div>

            <FiTrendingUp size={18} />
          </div>

          <div className="discover-recommended-list">
            {recommendedDocuments.map((document) => (
              <Link
                to={`/documentation/${document.id}`}
                key={document.id}
                className="discover-recommended-link">
                <Card className="discover-recommended-card">
                  <div>
                    <h3>{document.title}</h3>

                    {document.category && (
                      <Badge variant="blue">{document.category}</Badge>
                    )}

                    <p>{getDescription(document)}</p>
                  </div>

                  <div className="discover-recommended-meta">
                    <span>
                      <FiClock size={11} />
                      {formatUpdatedDate(document.updatedAt)}
                    </span>

                    <FiArrowRight size={15} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Discover;
