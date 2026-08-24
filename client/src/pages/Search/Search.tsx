import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiSearch as FiSearchIcon,
  FiZap,
} from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';

import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

import { getDocuments, type Document } from '../../services/documents';

import './Search.css';

const Search = () => {
  const navigate = useNavigate();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /*
   * =========================================
   * LOAD DOCUMENTATION
   * =========================================
   */

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await getDocuments();

        setDocuments(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load documentation.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, []);

  /*
   * =========================================
   * AUTO FOCUS SEARCH
   * =========================================
   */

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  /*
   * =========================================
   * GLOBAL SEARCH SHORTCUT
   * =========================================
   */

  useEffect(() => {
    const handleKeyboardShortcut = (event: globalThis.KeyboardEvent) => {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (!isSearchShortcut) {
        return;
      }

      event.preventDefault();

      searchInputRef.current?.focus();
    };

    window.addEventListener('keydown', handleKeyboardShortcut);

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, []);

  /*
   * =========================================
   * FILTER DOCUMENTS
   * =========================================
   */

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return documents;
    }

    return documents.filter((document) => {
      return (
        document.title.toLowerCase().includes(normalizedQuery) ||
        document.content.toLowerCase().includes(normalizedQuery) ||
        document.category?.toLowerCase().includes(normalizedQuery) ||
        document.author.name.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [documents, submittedQuery]);

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

    return `${days} days ago`;
  };

  /*
   * =========================================
   * DOCUMENT DESCRIPTION
   * =========================================
   */

  const getDescription = (document: Document) => {
    const content = document.content.trim();

    if (content.length <= 180) {
      return content;
    }

    return `${content.slice(0, 180)}...`;
  };

  /*
   * =========================================
   * SEARCH
   * =========================================
   */

  const handleSearch = () => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setSubmittedQuery('');
      searchInputRef.current?.focus();
      return;
    }

    setError('');
    setSubmittedQuery(normalizedQuery);
  };

  /*
   * =========================================
   * SEARCH SUGGESTIONS
   * =========================================
   */

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setSubmittedQuery(suggestion);

    searchInputRef.current?.focus();
  };

  /*
   * =========================================
   * ENTER KEY
   * =========================================
   */

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  /*
   * =========================================
   * OPEN DOCUMENT
   * =========================================
   */

  const handleOpenDocument = (documentId: string) => {
    navigate(`/documentation/${documentId}`);
  };

  const hasQuery = submittedQuery.trim().length > 0;

  /*
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <div className="ai-search">
      {/* =========================================
          HEADER
      ========================================= */}

      <section className="ai-search-header">
        <div className="ai-search-header-icon">
          <FiZap size={22} />
        </div>

        <div>
          <p className="ai-search-eyebrow">AI Search</p>

          <h1>Ask your documentation.</h1>

          <p className="ai-search-description">
            Search your knowledge base using natural language and get answers
            grounded in your documentation.
          </p>
        </div>
      </section>

      {/* =========================================
          SEARCH BOX
      ========================================= */}

      <section className="ai-search-box-section">
        <Card className="ai-search-box">
          <div className="ai-search-input-wrapper">
            <FiSearchIcon className="ai-search-input-icon" size={20} />

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Ask a question about your documentation..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Search documentation"
            />

            <kbd>⌘ K</kbd>
          </div>

          <button
            type="button"
            className="ai-search-submit"
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}>
            <FiZap size={17} />
            Ask AI
          </button>
        </Card>

        {/* =========================================
            SUGGESTIONS
        ========================================= */}

        <div className="ai-search-suggestions">
          <span>Try asking:</span>

          <button
            type="button"
            onClick={() => handleSuggestion('How does authentication work?')}>
            How does authentication work?
          </button>

          <button
            type="button"
            onClick={() => handleSuggestion('Where is the API documented?')}>
            Where is the API documented?
          </button>

          <button
            type="button"
            onClick={() =>
              handleSuggestion('How should React components be structured?')
            }>
            How should React components be structured?
          </button>
        </div>
      </section>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && <div className="ai-search-error">{error}</div>}

      {/* =========================================
          SEARCH SUMMARY
      ========================================= */}

      {hasQuery && !isLoading && !error && (
        <section className="ai-answer-section">
          <Card className="ai-answer-card">
            <div className="ai-answer-header">
              <div className="ai-answer-title">
                <div className="ai-answer-icon">
                  <FiZap size={17} />
                </div>

                <div>
                  <h2>Search results</h2>

                  <span>Based on your documentation</span>
                </div>
              </div>

              <Badge variant="blue">Documentation</Badge>
            </div>

            <div className="ai-answer-content">
              <p>
                Here are the documents that best match your search. The AI
                answer will be connected to the documentation RAG system here.
              </p>

              <div className="ai-answer-highlight">
                <strong>Your question</strong>

                <span>{submittedQuery}</span>
              </div>
            </div>

            <div className="ai-answer-footer">
              <span>
                {filteredDocuments.length === 0
                  ? 'No matching documents'
                  : 'Answer generated from your documentation'}
              </span>
            </div>
          </Card>
        </section>
      )}

      {/* =========================================
          RESULTS
      ========================================= */}

      <section className="search-results-section">
        <div className="search-results-header">
          <div>
            <h2>{hasQuery ? 'Relevant documentation' : 'Documentation'}</h2>

            <p>
              {hasQuery
                ? 'Documents matching your search.'
                : 'Browse the documentation available in your workspace.'}
            </p>
          </div>

          {!isLoading && (
            <span>
              {filteredDocuments.length === 0
                ? 'No documents'
                : filteredDocuments.length === 1
                  ? 'One document'
                  : 'Documents available'}
            </span>
          )}
        </div>

        {/* =========================================
            LOADING
        ========================================= */}

        {isLoading && (
          <div className="search-results-empty">
            <FiFileText size={24} />

            <h3>Loading documentation...</h3>

            <p>Fetching your documentation from the workspace.</p>
          </div>
        )}

        {/* =========================================
            EMPTY
        ========================================= */}

        {!isLoading && !error && filteredDocuments.length === 0 && (
          <div className="search-results-empty">
            <FiFileText size={24} />

            <h3>
              {hasQuery ? 'No matching documentation' : 'No documentation yet'}
            </h3>

            <p>
              {hasQuery
                ? 'Try another search or use a different question.'
                : 'Create a document to start building your knowledge base.'}
            </p>
          </div>
        )}

        {/* =========================================
            DOCUMENTS
        ========================================= */}

        {!isLoading && !error && filteredDocuments.length > 0 && (
          <div className="search-results-list">
            {filteredDocuments.map((document) => (
              <Card
                className="search-result-card"
                key={document.id}
                onClick={() => handleOpenDocument(document.id)}>
                <div className="search-result-icon">
                  <FiFileText size={18} />
                </div>

                <div className="search-result-content">
                  <div className="search-result-title-row">
                    <h3>{document.title}</h3>

                    {document.category && (
                      <Badge variant="gray">{document.category}</Badge>
                    )}
                  </div>

                  <p>{getDescription(document)}</p>

                  <div className="search-result-meta">
                    {document.category && (
                      <>
                        <span>
                          <FiBookOpen size={12} />
                          {document.category}
                        </span>

                        <span className="search-result-separator">•</span>
                      </>
                    )}

                    <span>
                      <FiClock size={12} />
                      {formatUpdatedDate(document.updatedAt)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="search-result-arrow"
                  title="Open document"
                  aria-label={`Open ${document.title}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenDocument(document.id);
                  }}>
                  <FiArrowRight size={16} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Search;
