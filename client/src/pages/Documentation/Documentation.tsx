import { useEffect, useMemo, useState } from 'react';

import {
  FiBookOpen,
  FiChevronDown,
  FiClock,
  FiCopy,
  FiEdit3,
  FiExternalLink,
  FiFileText,
  FiFilter,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
} from 'react-icons/fi';

import { Link, useNavigate } from 'react-router-dom';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

import {
  deleteAllDocuments,
  deleteDocument,
  getDocuments,
  toggleDocumentFavorite,
  type Document,
} from '../../services/documents';

import './Documentation.css';

const Documentation = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [processingFavoriteId, setProcessingFavoriteId] = useState<
    string | null
  >(null);

  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );

  const [deletingAllDocuments, setDeletingAllDocuments] = useState(false);

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

    if (!normalizedSearch) {
      return documents;
    }

    return documents.filter((document) => {
      return (
        document.title.toLowerCase().includes(normalizedSearch) ||
        document.content.toLowerCase().includes(normalizedSearch) ||
        document.category?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [documents, search]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();

    documents.forEach((document) => {
      if (!document.category) {
        return;
      }

      counts.set(document.category, (counts.get(document.category) ?? 0) + 1);
    });

    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [documents]);

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

    if (content.length <= 140) {
      return content;
    }

    return `${content.slice(0, 140)}...`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleFavorite = async (documentId: string) => {
    try {
      setProcessingFavoriteId(documentId);
      setError('');

      const isFavorite = await toggleDocumentFavorite(documentId);

      setDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          document.id === documentId
            ? {
                ...document,
                isFavorite,
              }
            : document,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update favorite.',
      );
    } finally {
      setProcessingFavoriteId(null);
    }
  };

  const handleCopyLink = async (documentId: string) => {
    try {
      setError('');

      const url = `${window.location.origin}/documentation/${documentId}`;

      await navigator.clipboard.writeText(url);

      setOpenMenuId(null);
    } catch {
      setError('Failed to copy document link.');
    }
  };

  const handleDelete = async (document: Document) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${document.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingDocumentId(document.id);
      setError('');

      await deleteDocument(document.id);

      setDocuments((currentDocuments) =>
        currentDocuments.filter((item) => item.id !== document.id),
      );

      setOpenMenuId(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete document.',
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  const handleDeleteAllDocuments = async () => {
    if (documents.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete all ${documents.length} documents? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAllDocuments(true);
      setError('');
      setOpenMenuId(null);

      await deleteAllDocuments();

      setDocuments([]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete all documents.',
      );
    } finally {
      setDeletingAllDocuments(false);
    }
  };

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

        <div className="documentation-header-actions">
          {documents.length > 0 && (
            <button
              type="button"
              className="delete-all-documents-button"
              disabled={deletingAllDocuments}
              onClick={handleDeleteAllDocuments}>
              <FiTrash2 size={16} />

              {deletingAllDocuments ? 'Deleting...' : 'Delete all'}
            </button>
          )}

          <Button onClick={() => navigate('/documentation/create')}>
            <FiPlus size={16} />
            Create document
          </Button>
        </div>
      </section>

      {error && <div className="documentation-error">{error}</div>}

      <section className="documentation-toolbar">
        <div className="documentation-search">
          <FiSearch size={17} />

          <input
            type="text"
            placeholder="Search documentation..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <kbd>⌘ K</kbd>
        </div>

        <div className="documentation-filters">
          <button type="button" className="filter-button">
            <FiFilter size={15} />
            Filters
          </button>

          <button type="button" className="filter-button">
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

              <button type="button" aria-label="Add category">
                <FiPlus size={14} />
              </button>
            </div>

            <nav className="category-list">
              <button type="button" className="category-item active">
                <div>
                  <FiBookOpen size={17} />
                  <span>All documents</span>
                </div>

                <span className="category-count">{documents.length}</span>
              </button>

              {categories.map((category) => (
                <button
                  type="button"
                  key={category.name}
                  className="category-item">
                  <div>
                    <FiFileText size={17} />
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

              <button type="button" aria-label="Add collection">
                <FiPlus size={14} />
              </button>
            </div>

            <div className="collection-list">
              <p className="documentation-sidebar-empty">No collections yet.</p>
            </div>
          </div>
        </aside>

        <section className="documentation-content">
          <div className="documentation-content-header">
            <div>
              <h2>All documents</h2>

              <span>
                {filteredDocuments.length}{' '}
                {filteredDocuments.length === 1 ? 'document' : 'documents'}
              </span>
            </div>
          </div>

          {isLoading && (
            <div className="documentation-empty">
              <FiFileText size={24} />

              <h3>Loading documents...</h3>

              <p>Fetching your documentation from the workspace.</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="documentation-empty">
              <FiFileText size={24} />

              <h3>Unable to load documents</h3>

              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && filteredDocuments.length === 0 && (
            <div className="documentation-empty">
              <FiFileText size={24} />

              <h3>{search ? 'No documents found' : 'No documents yet'}</h3>

              <p>
                {search
                  ? 'Try a different search term.'
                  : 'Create your first document to get started.'}
              </p>

              {!search && (
                <Button onClick={() => navigate('/documentation/create')}>
                  <FiPlus size={16} />
                  Create document
                </Button>
              )}
            </div>
          )}

          {!isLoading && !error && filteredDocuments.length > 0 && (
            <div className="document-grid">
              {filteredDocuments.map((document) => (
                <Card className="documentation-card" key={document.id}>
                  <div className="documentation-card-top">
                    <div className="documentation-card-icon">
                      <FiFileText size={19} />
                    </div>

                    <div className="documentation-card-actions">
                      <button
                        type="button"
                        className={`favorite-button ${
                          document.isFavorite ? 'active' : ''
                        }`}
                        disabled={processingFavoriteId === document.id}
                        title={
                          document.isFavorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                        }
                        aria-label={
                          document.isFavorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                        }
                        onClick={() => handleFavorite(document.id)}>
                        <FiStar size={16} />
                      </button>

                      <button
                        type="button"
                        className="view-button"
                        title="More actions"
                        aria-label="More actions"
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === document.id ? null : document.id,
                          )
                        }>
                        <FiMoreHorizontal size={17} />
                      </button>

                      {openMenuId === document.id && (
                        <div className="document-actions-menu">
                          <Link
                            to={`/documentation/${document.id}/edit`}
                            onClick={() => setOpenMenuId(null)}>
                            <FiEdit3 size={15} />
                            Edit document
                          </Link>

                          <Link
                            to={`/documentation/${document.id}`}
                            onClick={() => setOpenMenuId(null)}>
                            <FiExternalLink size={15} />
                            Open document
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleCopyLink(document.id)}>
                            <FiCopy size={15} />
                            Copy link
                          </button>

                          <button
                            type="button"
                            className="danger"
                            disabled={deletingDocumentId === document.id}
                            onClick={() => handleDelete(document)}>
                            <FiTrash2 size={15} />

                            {deletingDocumentId === document.id
                              ? 'Deleting...'
                              : 'Delete document'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/documentation/${document.id}`}
                    className="documentation-card-body">
                    <div className="documentation-card-title">
                      <h3>{document.title}</h3>

                      {document.category && (
                        <Badge variant="blue">{document.category}</Badge>
                      )}
                    </div>

                    <p>{getDescription(document)}</p>
                  </Link>

                  <div className="documentation-card-tags">
                    <span>{document.status}</span>
                    <span>{document.visibility}</span>
                  </div>

                  <div className="documentation-card-footer">
                    <div className="documentation-author">
                      <div>{getInitials(document.author.name)}</div>

                      <span>{document.author.name}</span>
                    </div>

                    <div className="documentation-updated">
                      <FiClock size={12} />
                      {formatUpdatedDate(document.updatedAt)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Documentation;
