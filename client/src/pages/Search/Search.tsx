import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiSearch,
  FiZap,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

import './Search.css';

interface SearchResult {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  updated: string;
}

const searchResults: SearchResult[] = [
  {
    id: 1,
    title: 'Authentication Guide',
    description:
      'How authentication and authorization work across the DevDocs platform, including JWT tokens, sessions and protected routes.',
    category: 'Backend',
    type: 'Guide',
    updated: '10 minutes ago',
  },
  {
    id: 2,
    title: 'API Architecture',
    description:
      'Overview of the REST API architecture, endpoint conventions, request validation and service organization.',
    category: 'Architecture',
    type: 'Documentation',
    updated: '1 hour ago',
  },
  {
    id: 3,
    title: 'React Components',
    description:
      'Internal guidelines for creating reusable React components, component composition and frontend conventions.',
    category: 'Frontend',
    type: 'Guide',
    updated: '3 hours ago',
  },
];

const Search = () => {
  return (
    <div className="ai-search">
      {/* Header */}
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

      {/* Search */}
      <section className="ai-search-box-section">
        <Card className="ai-search-box">
          <div className="ai-search-input-wrapper">
            <FiSearch className="ai-search-input-icon" size={20} />

            <input
              type="text"
              placeholder="Ask a question about your documentation..."
            />

            <kbd>⌘ K</kbd>
          </div>

          <button className="ai-search-submit">
            <FiZap size={17} />
            Ask AI
          </button>
        </Card>

        <div className="ai-search-suggestions">
          <span>Try asking:</span>

          <button>How does authentication work?</button>

          <button>Where is the API documented?</button>

          <button>How should React components be structured?</button>
        </div>
      </section>

      {/* AI Answer */}
      <section className="ai-answer-section">
        <Card className="ai-answer-card">
          <div className="ai-answer-header">
            <div className="ai-answer-title">
              <div className="ai-answer-icon">
                <FiZap size={17} />
              </div>

              <div>
                <h2>AI Answer</h2>

                <span>Based on your documentation</span>
              </div>
            </div>

            <Badge variant="blue">AI Generated</Badge>
          </div>

          <div className="ai-answer-content">
            <p>
              Authentication in DevDocs is handled through JWT-based
              authentication. Users authenticate through the API and receive an
              access token that is used to access protected resources.
            </p>

            <p>
              Protected routes use authentication middleware to validate the
              token before allowing the request to continue. Authorization can
              then be applied based on the user's role and permissions.
            </p>

            <div className="ai-answer-highlight">
              <strong>In short</strong>

              <span>
                Login → JWT token → Authentication middleware → Protected
                resource
              </span>
            </div>
          </div>

          <div className="ai-answer-footer">
            <span>Answer generated from 4 documents</span>

            <button>
              View sources
              <FiArrowRight size={14} />
            </button>
          </div>
        </Card>
      </section>

      {/* Sources */}
      <section className="search-results-section">
        <div className="search-results-header">
          <div>
            <h2>Relevant documentation</h2>

            <p>Documents used to generate the answer.</p>
          </div>

          <span>3 results</span>
        </div>

        <div className="search-results-list">
          {searchResults.map((result) => (
            <Card className="search-result-card" key={result.id}>
              <div className="search-result-icon">
                <FiFileText size={18} />
              </div>

              <div className="search-result-content">
                <div className="search-result-title-row">
                  <h3>{result.title}</h3>

                  <Badge variant="gray">{result.type}</Badge>
                </div>

                <p>{result.description}</p>

                <div className="search-result-meta">
                  <span>
                    <FiBookOpen size={12} />
                    {result.category}
                  </span>

                  <span className="search-result-separator">•</span>

                  <span>
                    <FiClock size={12} />
                    {result.updated}
                  </span>
                </div>
              </div>

              <button className="search-result-arrow" title="Open document">
                <FiArrowRight size={16} />
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Search;
