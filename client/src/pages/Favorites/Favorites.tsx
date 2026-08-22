import { useEffect, useMemo, useState } from 'react';

import {
  FiArrowRight,
  FiClock,
  FiFileText,
  FiSearch,
  FiStar,
} from 'react-icons/fi';

import { Link } from 'react-router-dom';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

import {
  getDocuments,
  toggleDocumentFavorite,
  type Document,
} from '../../services/documents';

import './Favorites.css';

const Favorites = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const [search, setSearch] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState('');

  const [processingFavoriteId, setProcessingFavoriteId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await getDocuments();

        setDocuments(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load favorites.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const favoriteDocuments = useMemo(() => {
    return documents.filter((document) => document.isFavorite);
  }, [documents]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();

    favoriteDocuments.forEach((document) => {
      if (document.category) {
        uniqueCategories.add(document.category);
      }
    });

    return Array.from(uniqueCategories).sort();
  }, [favoriteDocuments]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return favoriteDocuments.filter((document) => {
      const matchesSearch =
        !normalizedSearch ||
        document.title.toLowerCase().includes(normalizedSearch) ||
        document.content.toLowerCase().includes(normalizedSearch) ||
        document.category?.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === 'all' || document.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [favoriteDocuments, search, selectedCategory]);

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

    if (content.length <= 180) {
      return content;
    }

    return `${content.slice(0, 180)}...`;
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

  const handleRemoveFavorite = async (documentId: string) => {
    try {
      setProcessingFavoriteId(documentId);

      setError('');

      await toggleDocumentFavorite(documentId);

      setDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          document.id === documentId
            ? {
                ...document,
                isFavorite: false,
              }
            : document,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to remove favorite.',
      );
    } finally {
      setProcessingFavoriteId(null);
    }
  };

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

          <span>
            {favoriteDocuments.length}{' '}
            {favoriteDocuments.length === 1 ? 'favorite' : 'favorites'}
          </span>
        </div>
      </section>

      {error && <div className="favorites-error">{error}</div>}

      <section className="favorites-toolbar">
        <div className="favorites-search">
          <FiSearch size={16} />

          <input
            type="text"
            placeholder="Search favorites..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="favorites-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="all">All categories</option>

          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </section>

      {isLoading && (
        <section className="favorites-empty">
          <FiStar size={24} />

          <h2>Loading favorites...</h2>

          <p>Fetching your favorite documents.</p>
        </section>
      )}

      {!isLoading && !error && favoriteDocuments.length === 0 && (
        <section className="favorites-empty">
          <FiStar size={24} />

          <h2>No favorites yet</h2>

          <p>Documents you mark as favorites will appear here.</p>

          <Link to="/documentation" className="favorites-empty-link">
            Browse documentation
            <FiArrowRight size={14} />
          </Link>
        </section>
      )}

      {!isLoading &&
        !error &&
        favoriteDocuments.length > 0 &&
        filteredDocuments.length === 0 && (
          <section className="favorites-empty">
            <FiSearch size={24} />

            <h2>No favorites found</h2>

            <p>Try changing your search or category filter.</p>
          </section>
        )}

      {!isLoading && !error && filteredDocuments.length > 0 && (
        <section className="favorites-list">
          {filteredDocuments.map((document) => (
            <Card className="favorite-card" key={document.id}>
              <div className="favorite-icon">
                <FiFileText size={19} />
              </div>

              <Link
                to={`/documentation/${document.id}`}
                className="favorite-content">
                <div className="favorite-title-row">
                  <h2>{document.title}</h2>

                  <Badge variant={getStatusVariant(document.status)}>
                    {getStatusLabel(document.status)}
                  </Badge>
                </div>

                <p>{getDescription(document)}</p>

                <div className="favorite-meta">
                  {document.category && (
                    <>
                      <span>{document.category}</span>

                      <span className="favorite-separator">•</span>
                    </>
                  )}

                  <span>
                    <FiClock size={12} />

                    {formatUpdatedDate(document.updatedAt)}
                  </span>
                </div>
              </Link>

              <div className="favorite-actions">
                <button
                  type="button"
                  className="favorite-star active"
                  title="Remove from favorites"
                  disabled={processingFavoriteId === document.id}
                  onClick={() => handleRemoveFavorite(document.id)}>
                  <FiStar size={16} />
                </button>

                <Link
                  to={`/documentation/${document.id}`}
                  className="favorite-open"
                  title="Open document">
                  <FiArrowRight size={16} />
                </Link>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
};

export default Favorites;
