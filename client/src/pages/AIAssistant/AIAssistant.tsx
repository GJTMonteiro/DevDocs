import {
  FiBookOpen,
  FiChevronDown,
  FiCopy,
  FiFileText,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiSettings,
  FiSidebar,
  FiThumbsDown,
  FiThumbsUp,
  FiZap,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

import './AIAssistant.css';

interface Conversation {
  id: number;
  title: string;
  updated: string;
}

const conversations: Conversation[] = [
  {
    id: 1,
    title: 'How authentication works',
    updated: 'Just now',
  },
  {
    id: 2,
    title: 'API architecture overview',
    updated: 'Yesterday',
  },
  {
    id: 3,
    title: 'React component guidelines',
    updated: '2 days ago',
  },
];

const AIAssistant = () => {
  return (
    <div className="ai-assistant">
      {/* Header */}
      <section className="ai-assistant-header">
        <div className="ai-assistant-title">
          <div className="ai-assistant-title-icon">
            <FiZap size={20} />
          </div>

          <div>
            <p className="ai-assistant-eyebrow">AI Assistant</p>

            <h1>DevDocs AI</h1>
          </div>
        </div>

        <div className="ai-assistant-header-actions">
          <button type="button">
            <FiSettings size={16} />
            <span>Settings</span>
          </button>

          <button type="button" title="Toggle sidebar">
            <FiSidebar size={16} />
          </button>
        </div>
      </section>

      {/* Main layout */}
      <section className="ai-assistant-layout">
        {/* Conversations */}
        <aside className="ai-assistant-sidebar">
          <button type="button" className="new-conversation">
            <FiPlus size={15} />
            <span>New conversation</span>
          </button>

          <div className="conversation-section">
            <span className="conversation-section-title">Recent</span>

            <div className="conversation-list">
              {conversations.map((conversation) => (
                <button
                  type="button"
                  className={`conversation-item ${
                    conversation.id === 1 ? 'active' : ''
                  }`}
                  key={conversation.id}>
                  <FiMessageSquare size={15} />

                  <div>
                    <span>{conversation.title}</span>

                    <small>{conversation.updated}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat */}
        <main className="ai-chat">
          <div className="ai-chat-messages">
            {/* Welcome */}
            <div className="ai-welcome">
              <div className="ai-welcome-icon">
                <FiZap size={22} />
              </div>

              <h2>How can I help?</h2>

              <p>
                Ask questions about your documentation, codebase, architecture
                or internal processes.
              </p>

              <div className="ai-capabilities">
                <button type="button">
                  <FiBookOpen size={15} />
                  <span>Search documentation</span>
                </button>

                <button type="button">
                  <FiFileText size={15} />
                  <span>Explain a document</span>
                </button>

                <button type="button">
                  <FiZap size={15} />
                  <span>Help me write documentation</span>
                </button>
              </div>
            </div>

            {/* User message */}
            <div className="chat-message user-message">
              <div className="chat-avatar user">GM</div>

              <div className="chat-message-content">
                <span className="chat-message-author">You</span>

                <p>How does authentication work in our application?</p>
              </div>
            </div>

            {/* AI message */}
            <div className="chat-message ai-message">
              <div className="chat-avatar ai">
                <FiZap size={15} />
              </div>

              <div className="chat-message-content">
                <div className="chat-message-author-row">
                  <span className="chat-message-author">DevDocs AI</span>

                  <Badge variant="blue">AI</Badge>
                </div>

                <div className="chat-answer">
                  <p>
                    Authentication is handled through JWT-based authentication.
                    Users authenticate through the API and receive an access
                    token that is then used when accessing protected resources.
                  </p>

                  <p>
                    Requests to protected routes pass through authentication
                    middleware, which validates the token before the request
                    reaches the application logic.
                  </p>

                  <div className="chat-source-box">
                    <div className="chat-source-header">
                      <span>Sources</span>

                      <span>3 documents</span>
                    </div>

                    <div className="chat-source">
                      <FiFileText size={14} />

                      <span>Authentication Guide</span>
                    </div>

                    <div className="chat-source">
                      <FiFileText size={14} />

                      <span>API Architecture</span>
                    </div>
                  </div>
                </div>

                <div className="chat-message-actions">
                  <button type="button" title="Copy">
                    <FiCopy size={13} />
                  </button>

                  <button type="button" title="Helpful">
                    <FiThumbsUp size={13} />
                  </button>

                  <button type="button" title="Not helpful">
                    <FiThumbsDown size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="ai-chat-input-area">
            <Card className="ai-chat-input">
              <textarea
                placeholder="Ask anything about your documentation..."
                rows={2}
              />

              <div className="ai-chat-input-footer">
                <div className="ai-chat-tools">
                  <button type="button" title="Add attachment">
                    <FiPlus size={15} />
                  </button>

                  <button type="button">
                    <FiBookOpen size={15} />
                    <span>Documentation</span>
                  </button>

                  <button type="button" title="Select context">
                    <FiChevronDown size={13} />
                  </button>
                </div>

                <button type="button" className="ai-send" title="Send message">
                  <FiSend size={15} />
                </button>
              </div>
            </Card>

            <p className="ai-chat-disclaimer">
              DevDocs AI uses your documentation as context. Always verify
              important information.
            </p>
          </div>
        </main>
      </section>
    </div>
  );
};

export default AIAssistant;
