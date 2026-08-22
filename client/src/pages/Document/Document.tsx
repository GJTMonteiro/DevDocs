import { useEffect, useState } from 'react';

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiEdit3,
  FiFileText,
  FiStar,
} from 'react-icons/fi';

import { Link, useNavigate, useParams } from 'react-router-dom';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

import {
  getDocumentById,
  toggleDocumentFavorite,
  type Document as DocumentType,
} from '../../services/documents';

import './Document.css';

const Document = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [document, setDocument] = useState<DocumentType | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Invalid document id.');
      setIsLoading(false);
      return;
    }

    const loadDocument = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await getDocumentById(id);

        setDocument(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load document.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  const handleFavorite = async () => {
    if (!document) {
      return;
    }

    try {
      setIsFavoriteLoading(true);
      setError('');

      const isFavorite = await toggleDocumentFavorite(document.id);

      setDocument((currentDocument) =>
        currentDocument
          ? {
              ...currentDocument,
              isFavorite,
            }
          : currentDocument,
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update favorite.',
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusVariant = (status: DocumentType['status']) => {
    if (status === 'published') {
      return 'green' as const;
    }

    if (status === 'draft') {
      return 'yellow' as const;
    }

    return 'blue' as const;
  };

  const getStatusLabel = (status: DocumentType['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <div className="document-page">
        <div className="document-state">
          <FiFileText size={24} />

          <h2>Loading document...</h2>

          <p>Fetching the document from your workspace.</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="document-page">
        <div className="document-state">
          <FiFileText size={24} />

          <h2>Unable to load document</h2>

          <p>{error || 'Document not found.'}</p>

          <Button onClick={() => navigate('/documentation')}>
            <FiArrowLeft size={15} />
            Back to documentation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="document-page">
      <section className="document-header">
        <div className="document-header-top">
          <Link to="/documentation" className="document-back">
            <FiArrowLeft size={16} />

            <span>Documentation</span>
          </Link>

          <div className="document-actions">
            <button
              type="button"
              className={`document-favorite ${
                document.isFavorite ? 'active' : ''
              }`}
              onClick={handleFavorite}
              disabled={isFavoriteLoading}
              title={
                document.isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }>
              <FiStar size={16} />

              {document.isFavorite ? 'Favorited' : 'Favorite'}
            </button>

            <Link to={`/documentation/${document.id}/edit`}>
              <Button>
                <FiEdit3 size={15} />
                Edit document
              </Button>
            </Link>
          </div>
        </div>

        <div className="document-heading">
          <div className="document-heading-icon">
            <FiFileText size={22} />
          </div>

          <div className="document-heading-content">
            <div className="document-heading-meta">
              {document.category && (
                <Badge variant="blue">{document.category}</Badge>
              )}

              <Badge variant={getStatusVariant(document.status)}>
                {getStatusLabel(document.status)}
              </Badge>

              <span>{document.visibility}</span>
            </div>

            <h1>{document.title}</h1>

            <div className="document-author">
              <div className="document-author-avatar">
                {getInitials(document.author.name)}
              </div>

              <div>
                <strong>{document.author.name}</strong>

                <span>{document.author.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && <div className="document-error">{error}</div>}

      <div className="document-layout">
        <main className="document-content">
          <Card className="document-content-card">
            <article className="document-article">
              {document.content.split('\n').map((paragraph, index) => {
                if (!paragraph.trim()) {
                  return (
                    <div key={index} className="document-content-spacer" />
                  );
                }

                return <p key={index}>{paragraph}</p>;
              })}
            </article>
          </Card>
        </main>

        <aside className="document-sidebar">
          <Card className="document-info-card">
            <div className="document-info-header">
              <h2>Document information</h2>
            </div>

            <div className="document-info-list">
              <div className="document-info-item">
                <div className="document-info-icon">
                  <FiCalendar size={14} />
                </div>

                <div>
                  <span>Created</span>

                  <strong>{formatDate(document.createdAt)}</strong>
                </div>
              </div>

              <div className="document-info-item">
                <div className="document-info-icon">
                  <FiClock size={14} />
                </div>

                <div>
                  <span>Last updated</span>

                  <strong>{formatDateTime(document.updatedAt)}</strong>
                </div>
              </div>

              <div className="document-info-item">
                <div className="document-info-icon">
                  <FiFileText size={14} />
                </div>

                <div>
                  <span>Status</span>

                  <strong>{getStatusLabel(document.status)}</strong>
                </div>
              </div>
            </div>
          </Card>

          <Card className="document-author-card">
            <div className="document-author-card-header">
              <h2>Author</h2>
            </div>

            <div className="document-author-card-content">
              <div className="document-author-avatar large">
                {getInitials(document.author.name)}
              </div>

              <div>
                <strong>{document.author.name}</strong>

                <span>{document.author.email}</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Document;
