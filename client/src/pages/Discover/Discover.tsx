import { useEffect, useMemo, useState } from 'react';

import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiFolder,
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

  /*
   * =========================================
   * FILTER DOCUMENTS
   * =========================================
   */

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

  /*
   * =========================================
   * POPULAR DOCUMENTS
   * =========================================
   *
   * We don't have a views field in the database,
   * so we use the most recently updated documents
   * instead of fake view counts.
   */

  const popularDocuments = useMemo(() => {
    return [...filteredDocuments]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 3);
  }, [filteredDocuments]);

  /*
   * =========================================
   * RECOMMENDED DOCUMENTS
   * =========================================
   */

  const recommendedDocuments = useMemo(() => {
    return [...filteredDocuments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [filteredDocuments]);

  /*
   * =========================================
   * FORMAT DATE
   * =========================================
   */

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

  /*
   * =========================================
   * DESCRIPTION
   * =========================================
   */

  const getDescription = (document: Document) => {
    const content = document.content.trim();

    if (!content) {
      return 'No description available for this document.';
    }

    if (content.length <= 150) {
      return content;
    }

    return `${content.slice(0, 150)}...`;
  };

  /*
   * =========================================
   * INITIALS
   * =========================================
   */

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  /*
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <div className="discover">
      {/* HEADER */}

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

      {/* SEARCH */}

      <section className="discover-search">
        <FiSearch size={17} />

        <input
          type="text"
          placeholder="Search documentation..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      {/* CATEGORIES */}

      <section className="discover-categories">
        <button
          type="button"
          className={`discover-category ${
            activeFilter === 'all' ? 'active' : ''
          }`}
          onClick={() => setActiveFilter('all')}>
          <FiGrid size={16} />
          All
        </button>

        <button
          type="button"
          className={`discover-category ${
            activeFilter === 'engineering' ? 'active' : ''
          }`}
          onClick={() => setActiveFilter('engineering')}>
          <FiBookOpen size={16} />
          Engineering
        </button>

        <button
          type="button"
          className={`discover-category ${
            activeFilter === 'ai' ? 'active' : ''
          }`}
          onClick={() => setActiveFilter('ai')}>
          <FiZap size={16} />
          AI
        </button>

        <button
          type="button"
          className={`discover-category ${
            activeFilter === 'team' ? 'active' : ''
          }`}
          onClick={() => setActiveFilter('team')}>
          <FiUsers size={16} />
          Team
        </button>
      </section>

      {/* ERROR */}

      {error && <div className="discover-error">{error}</div>}

      {/* LOADING */}

      {isLoading && (
        <div className="discover-empty">
          <FiFileText size={24} />

          <h3>Loading documentation...</h3>

          <p>Fetching documents from your workspace.</p>
        </div>
      )}

      {/* CONTENT */}

      {!isLoading && !error && (
        <>
          {/* FEATURED */}

          <section className="discover-featured">
            <Card className="discover-featured-card">
              <div className="featured-icon">
                <FiTrendingUp size={22} />
              </div>

              <div className="featured-content">
                <Badge variant="blue">Recently updated</Badge>

                <h2>Explore your workspace knowledge</h2>

                <p>Discover documentation created and updated by your team.</p>
              </div>

              <button
                type="button"
                className="featured-arrow"
                onClick={() => navigate('/documentation')}
                aria-label="Open documentation">
                <FiArrowRight size={17} />
              </button>
            </Card>
          </section>

          {/* POPULAR */}

          <section className="discover-section">
            <div className="discover-section-header">
              <div>
                <h2>Popular documentation</h2>

                <p>Recently updated documents from your workspace.</p>
              </div>

              <Link to="/documentation">
                View all
                <FiArrowRight size={14} />
              </Link>
            </div>

            {popularDocuments.length === 0 ? (
              <div className="discover-empty">
                <FiFileText size={24} />

                <h3>No documentation found</h3>

                <p>Create a document to start building your knowledge base.</p>

                <button
                  type="button"
                  onClick={() => navigate('/documentation/create')}>
                  <FiFileText size={15} />
                  Create document
                </button>
              </div>
            ) : (
              <div className="discover-document-grid">
                {popularDocuments.map((document) => (
                  <Link
                    to={`/documentation/${document.id}`}
                    key={document.id}
                    className="discover-document-link">
                    <Card className="discover-document">
                      <div className="discover-document-icon">
                        <FiFileText size={18} />
                      </div>

                      {document.category && (
                        <Badge variant="gray">{document.category}</Badge>
                      )}

                      <h3>{document.title}</h3>

                      <p>{getDescription(document)}</p>

                      <div className="discover-document-meta">
                        <span>
                          <FiUsers size={11} />

                          <span>{getInitials(document.author.name)}</span>

                          {document.author.name}
                        </span>

                        <span>
                          <FiClock size={11} />

                          {formatUpdatedDate(document.updatedAt)}
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* RECOMMENDED */}

          <section className="discover-section">
            <div className="discover-section-header">
              <div>
                <h2>Recommended for you</h2>

                <p>Documentation you may find useful.</p>
              </div>
            </div>

            {recommendedDocuments.length === 0 ? (
              <div className="discover-empty">
                <FiFolder size={24} />

                <h3>Nothing to recommend yet</h3>

                <p>
                  Your recommendations will appear when documentation is
                  available.
                </p>
              </div>
            ) : (
              <div className="discover-recommended-list">
                {recommendedDocuments.map((document) => (
                  <Link
                    to={`/documentation/${document.id}`}
                    key={document.id}
                    className="discover-recommended-link">
                    <Card className="discover-recommended">
                      <div className="recommended-icon">
                        <FiFolder size={18} />
                      </div>

                      <div className="recommended-content">
                        <div className="recommended-title-row">
                          <h3>{document.title}</h3>

                          {document.category && (
                            <Badge variant="blue">{document.category}</Badge>
                          )}
                        </div>

                        <p>{getDescription(document)}</p>

                        <div className="recommended-meta">
                          <span>
                            <FiClock size={11} />

                            {formatUpdatedDate(document.updatedAt)}
                          </span>

                          <span>
                            <FiUsers size={11} />

                            {document.author.name}
                          </span>
                        </div>
                      </div>

                      <div className="recommended-arrow">
                        <FiArrowRight size={15} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Discover;
