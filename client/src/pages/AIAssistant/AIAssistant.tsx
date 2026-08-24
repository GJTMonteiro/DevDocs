import { useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';

import {
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiCopy,
  FiEdit2,
  FiFileText,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiSettings,
  FiSidebar,
  FiThumbsDown,
  FiThumbsUp,
  FiTrash2,
  FiX,
  FiZap,
} from 'react-icons/fi';

import { Link } from 'react-router-dom';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

import { askAI, type AIChatSource } from '../../services/ai';

import './AIAssistant.css';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: AIChatSource[];
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'devdocs-ai-conversations';

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatRelativeDate = (date: string) => {
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

const createConversation = (): Conversation => ({
  id: createMessageId(),
  title: 'New conversation',
  updatedAt: new Date().toISOString(),
  messages: [],
});

const AIAssistant = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const [input, setInput] = useState('');

  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState('');

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<
    Record<string, 'positive' | 'negative'>
  >({});

  const [openConversationMenu, setOpenConversationMenu] = useState<
    string | null
  >(null);

  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);

  const [editingTitle, setEditingTitle] = useState('');

  const [deletingConversationId, setDeletingConversationId] = useState<
    string | null
  >(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  /*
   * =========================================
   * LOAD CONVERSATIONS
   * =========================================
   */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as Conversation[];

        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed);
          setActiveConversationId(parsed[0].id);

          return;
        }
      }
    } catch {
      console.warn('Unable to restore AI conversations.');
    }

    const initialConversation = createConversation();

    setConversations([initialConversation]);
    setActiveConversationId(initialConversation.id);
  }, []);

  /*
   * =========================================
   * SAVE CONVERSATIONS
   * =========================================
   */

  useEffect(() => {
    if (conversations.length === 0) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      console.warn('Unable to save AI conversations.');
    }
  }, [conversations]);

  /*
   * =========================================
   * ACTIVE CONVERSATION
   * =========================================
   */

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ) ?? null,
    [conversations, activeConversationId],
  );

  /*
   * =========================================
   * UPDATE CONVERSATION
   * =========================================
   */

  const updateConversation = (conversationId: string, message: ChatMessage) => {
    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const isFirstUserMessage =
          conversation.messages.length === 0 && message.role === 'user';

        return {
          ...conversation,

          title: isFirstUserMessage
            ? message.content.slice(0, 60) +
              (message.content.length > 60 ? '...' : '')
            : conversation.title,

          updatedAt: new Date().toISOString(),

          messages: [...conversation.messages, message],
        };
      }),
    );
  };

  /*
   * =========================================
   * SEND MESSAGE
   * =========================================
   */

  const handleSend = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || isSending || !activeConversationId) {
      return;
    }

    const conversationId = activeConversationId;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: trimmedInput,
    };

    setInput('');
    setError('');

    updateConversation(conversationId, userMessage);

    try {
      setIsSending(true);

      const response = await askAI(trimmedInput);

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      };

      updateConversation(conversationId, assistantMessage);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to communicate with DevDocs AI.',
      );
    } finally {
      setIsSending(false);
    }
  };

  /*
   * =========================================
   * NEW CONVERSATION
   * =========================================
   */

  const handleNewConversation = () => {
    if (isSending) {
      return;
    }

    const conversation = createConversation();

    setConversations((current) => [conversation, ...current]);

    setActiveConversationId(conversation.id);

    setInput('');
    setError('');
    setOpenConversationMenu(null);
  };

  /*
   * =========================================
   * SELECT CONVERSATION
   * =========================================
   */

  const handleSelectConversation = (conversationId: string) => {
    if (isSending) {
      return;
    }

    setActiveConversationId(conversationId);

    setInput('');
    setError('');
    setOpenConversationMenu(null);
  };

  /*
   * =========================================
   * RENAME
   * =========================================
   */

  const handleStartRename = (conversation: Conversation) => {
    setEditingConversationId(conversation.id);
    setEditingTitle(conversation.title);
    setOpenConversationMenu(null);
  };

  const handleCancelRename = () => {
    setEditingConversationId(null);
    setEditingTitle('');
  };

  const handleSaveRename = () => {
    if (!editingConversationId) {
      return;
    }

    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === editingConversationId
          ? {
              ...conversation,
              title: trimmedTitle,
              updatedAt: new Date().toISOString(),
            }
          : conversation,
      ),
    );

    handleCancelRename();
  };

  /*
   * =========================================
   * DELETE CONVERSATION
   * =========================================
   */

  const handleDeleteConversation = () => {
    if (!deletingConversationId) {
      return;
    }

    const conversationId = deletingConversationId;

    setConversations((current) => {
      const remaining = current.filter(
        (conversation) => conversation.id !== conversationId,
      );

      if (remaining.length === 0) {
        const newConversation = createConversation();

        setActiveConversationId(newConversation.id);

        return [newConversation];
      }

      if (activeConversationId === conversationId) {
        setActiveConversationId(remaining[0].id);
      }

      return remaining;
    });

    setDeletingConversationId(null);
    setOpenConversationMenu(null);
    setInput('');
    setError('');
  };

  /*
   * =========================================
   * SUGGESTIONS
   * =========================================
   */

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  /*
   * =========================================
   * COPY MESSAGE
   * =========================================
   */

  const handleCopy = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);

      setCopiedMessageId(message.id);

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 1500);
    } catch {
      setError('Unable to copy the message.');
    }
  };

  /*
   * =========================================
   * FEEDBACK
   * =========================================
   */

  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    setFeedback((current) => {
      if (current[messageId] === type) {
        const next = {
          ...current,
        };

        delete next[messageId];

        return next;
      }

      return {
        ...current,
        [messageId]: type,
      };
    });
  };

  /*
   * =========================================
   * KEYBOARD
   * =========================================
   */

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  /*
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <div className="ai-assistant">
      {/* HEADER */}

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
          <button type="button" title="AI settings">
            <FiSettings size={16} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            onClick={() => setSidebarOpen((current) => !current)}>
            <FiSidebar size={16} />
          </button>
        </div>
      </section>

      {/* ERROR */}

      {error && <div className="ai-assistant-error">{error}</div>}

      {/* MAIN */}

      <section
        className={`ai-assistant-layout ${
          sidebarOpen ? '' : 'sidebar-hidden'
        }`}>
        {/* SIDEBAR */}

        {sidebarOpen && (
          <aside className="ai-assistant-sidebar">
            <button
              type="button"
              className="new-conversation"
              onClick={handleNewConversation}
              disabled={isSending}>
              <FiPlus size={15} />

              <span>New conversation</span>
            </button>

            <div className="conversation-section">
              <span className="conversation-section-title">Recent</span>

              <div className="conversation-list">
                {conversations.map((conversation) => (
                  <div
                    className={`conversation-item-wrapper ${
                      conversation.id === activeConversationId ? 'active' : ''
                    }`}
                    key={conversation.id}>
                    <button
                      type="button"
                      className={`conversation-item ${
                        conversation.id === activeConversationId ? 'active' : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation.id)}>
                      <FiMessageSquare size={15} />

                      <div>
                        <span>{conversation.title}</span>

                        <small>
                          {formatRelativeDate(conversation.updatedAt)}
                        </small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="conversation-menu-button"
                      title="Conversation actions"
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpenConversationMenu((current) =>
                          current === conversation.id ? null : conversation.id,
                        );
                      }}>
                      <FiChevronDown size={13} />
                    </button>

                    {openConversationMenu === conversation.id && (
                      <div className="conversation-menu">
                        <button
                          type="button"
                          onClick={() => handleStartRename(conversation)}>
                          <FiEdit2 size={13} />

                          <span>Rename</span>
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => {
                            setDeletingConversationId(conversation.id);
                            setOpenConversationMenu(null);
                          }}>
                          <FiTrash2 size={13} />

                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* CHAT */}

        <main className="ai-chat">
          <div className="ai-chat-messages">
            {!activeConversation || activeConversation.messages.length === 0 ? (
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
                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestion('How does authentication work?')
                    }>
                    <FiBookOpen size={15} />

                    <span>Ask about authentication</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestion(
                        'What is the most relevant documentation for this topic?',
                      )
                    }>
                    <FiFileText size={15} />

                    <span>Find relevant documentation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestion(
                        'Explain the relevant documentation for this topic.',
                      )
                    }>
                    <FiZap size={15} />

                    <span>Explain documentation</span>
                  </button>
                </div>
              </div>
            ) : (
              activeConversation.messages.map((message) => (
                <div
                  className={`chat-message ${
                    message.role === 'user' ? 'user-message' : 'ai-message'
                  }`}
                  key={message.id}>
                  <div
                    className={`chat-avatar ${
                      message.role === 'user' ? 'user' : 'ai'
                    }`}>
                    {message.role === 'user' ? 'You' : <FiZap size={15} />}
                  </div>

                  <div className="chat-message-content">
                    <div className="chat-message-author-row">
                      <span className="chat-message-author">
                        {message.role === 'user' ? 'You' : 'DevDocs AI'}
                      </span>

                      {message.role === 'assistant' && (
                        <Badge variant="blue">AI</Badge>
                      )}
                    </div>

                    <div className="chat-answer">
                      {message.content.split('\n\n').map((paragraph, index) => (
                        <p key={`${message.id}-${index}`}>{paragraph}</p>
                      ))}

                      {/* SOURCES */}

                      {message.role === 'assistant' &&
                        message.sources &&
                        message.sources.length > 0 && (
                          <div className="chat-source-box">
                            <div className="chat-source-header">
                              <span>Sources</span>

                              <span>
                                {message.sources.length} document
                                {message.sources.length === 1 ? '' : 's'}
                              </span>
                            </div>

                            {message.sources.map((source) => (
                              <Link
                                to={`/documentation/${source.id}`}
                                className="chat-source"
                                key={source.id}>
                                <FiFileText size={14} />

                                <span className="chat-source-info">
                                  <span className="chat-source-title">
                                    {source.title}
                                  </span>

                                  {source.category && (
                                    <small>{source.category}</small>
                                  )}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}

                      {message.role === 'assistant' &&
                        (!message.sources || message.sources.length === 0) && (
                          <div className="chat-no-sources">
                            <FiBookOpen size={14} />

                            <span>
                              No relevant documentation sources were found.
                            </span>
                          </div>
                        )}
                    </div>

                    {message.role === 'assistant' && (
                      <div className="chat-message-actions">
                        <button
                          type="button"
                          title={
                            copiedMessageId === message.id ? 'Copied' : 'Copy'
                          }
                          onClick={() => handleCopy(message)}>
                          <FiCopy size={13} />
                        </button>

                        <button
                          type="button"
                          title="Helpful"
                          className={
                            feedback[message.id] === 'positive' ? 'active' : ''
                          }
                          onClick={() =>
                            handleFeedback(message.id, 'positive')
                          }>
                          <FiThumbsUp size={13} />
                        </button>

                        <button
                          type="button"
                          title="Not helpful"
                          className={
                            feedback[message.id] === 'negative' ? 'active' : ''
                          }
                          onClick={() =>
                            handleFeedback(message.id, 'negative')
                          }>
                          <FiThumbsDown size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* LOADING */}

            {isSending && (
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
                    <p>Searching your documentation...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}

          <div className="ai-chat-input-area">
            <Card className="ai-chat-input">
              <textarea
                placeholder="Ask anything about your documentation..."
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
              />

              <div className="ai-chat-input-footer">
                <div className="ai-chat-tools">
                  <button
                    type="button"
                    disabled
                    title="Attachments are not available yet">
                    <FiPlus size={15} />
                  </button>

                  <button type="button" title="Documentation context">
                    <FiBookOpen size={15} />

                    <span>Documentation</span>
                  </button>

                  <button type="button" title="Select context">
                    <FiChevronDown size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  className="ai-send"
                  title="Send message"
                  disabled={!input.trim() || isSending}
                  onClick={handleSend}>
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

      {/* RENAME MODAL */}

      {editingConversationId && (
        <div className="ai-modal-overlay" onClick={handleCancelRename}>
          <div
            className="ai-modal"
            onClick={(event) => event.stopPropagation()}>
            <div className="ai-modal-header">
              <div>
                <span className="ai-modal-eyebrow">Conversation</span>

                <h2>Rename conversation</h2>
              </div>

              <button
                type="button"
                className="ai-modal-close"
                onClick={handleCancelRename}>
                <FiX size={17} />
              </button>
            </div>

            <div className="ai-modal-body">
              <label htmlFor="conversation-title">Conversation name</label>

              <input
                id="conversation-title"
                type="text"
                value={editingTitle}
                onChange={(event) => setEditingTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSaveRename();
                  }

                  if (event.key === 'Escape') {
                    handleCancelRename();
                  }
                }}
                autoFocus
                maxLength={100}
              />
            </div>

            <div className="ai-modal-footer">
              <button
                type="button"
                className="ai-modal-button secondary"
                onClick={handleCancelRename}>
                Cancel
              </button>

              <button
                type="button"
                className="ai-modal-button primary"
                disabled={!editingTitle.trim()}
                onClick={handleSaveRename}>
                <FiCheck size={14} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}

      {deletingConversationId && (
        <div
          className="ai-modal-overlay"
          onClick={() => setDeletingConversationId(null)}>
          <div
            className="ai-modal"
            onClick={(event) => event.stopPropagation()}>
            <div className="ai-modal-header">
              <div>
                <span className="ai-modal-eyebrow danger">Danger zone</span>

                <h2>Delete conversation?</h2>
              </div>

              <button
                type="button"
                className="ai-modal-close"
                onClick={() => setDeletingConversationId(null)}>
                <FiX size={17} />
              </button>
            </div>

            <div className="ai-modal-body">
              <p className="ai-delete-description">
                This conversation and all of its messages will be permanently
                removed.
              </p>
            </div>

            <div className="ai-modal-footer">
              <button
                type="button"
                className="ai-modal-button secondary"
                onClick={() => setDeletingConversationId(null)}>
                Cancel
              </button>

              <button
                type="button"
                className="ai-modal-button danger"
                onClick={handleDeleteConversation}>
                <FiTrash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
