import { useEffect, useState } from 'react';

import {
  FiArrowLeft,
  FiBold,
  FiCode,
  FiFileText,
  FiItalic,
  FiLink,
  FiList,
  FiMoreHorizontal,
  FiSave,
} from 'react-icons/fi';

import { Link, useNavigate, useParams } from 'react-router-dom';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

import { getDocumentById, updateDocument } from '../../services/documents';

import './EditDocument.css';

const EditDocument = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [title, setTitle] = useState('');

  const [content, setContent] = useState('');

  const [category, setCategory] = useState('');

  const [visibility, setVisibility] = useState<'workspace' | 'private'>(
    'workspace',
  );

  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(
    'draft',
  );

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');

  const [hasChanges, setHasChanges] = useState(false);

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

        const document = await getDocumentById(id);

        setTitle(document.title);

        setContent(document.content);

        setCategory(document.category ?? '');

        setVisibility(document.visibility);

        setStatus(document.status);

        setHasChanges(false);
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

  const handleSave = async () => {
    if (!id) {
      setError('Invalid document id.');

      return;
    }

    if (!title.trim()) {
      setError('Please enter a document title.');

      return;
    }

    if (!content.trim()) {
      setError('Please enter some content.');

      return;
    }

    try {
      setIsSaving(true);
      setError('');

      await updateDocument(id, {
        title: title.trim(),

        content,

        category: category.trim() || null,

        visibility,

        status,
      });

      setHasChanges(false);

      navigate(`/documentation/${id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update document.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      hasChanges &&
      !window.confirm(
        'You have unsaved changes. Are you sure you want to leave?',
      )
    ) {
      return;
    }

    navigate(`/documentation/${id}`);
  };

  if (isLoading) {
    return (
      <div className="edit-document">
        <div className="edit-document-loading">
          <FiFileText size={24} />

          <h2>Loading document...</h2>

          <p>Fetching the document from your workspace.</p>
        </div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="edit-document">
        <div className="edit-document-error-state">
          <FiFileText size={24} />

          <h2>Unable to load document</h2>

          <p>{error}</p>

          <Button onClick={() => navigate('/documentation')}>
            <FiArrowLeft size={15} />
            Back to documentation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-document">
      <section className="edit-document-header">
        <div className="edit-document-header-left">
          <Link
            to={`/documentation/${id}`}
            className="edit-document-back"
            onClick={(event) => {
              if (!hasChanges) {
                return;
              }

              const confirmed = window.confirm(
                'You have unsaved changes. Are you sure you want to leave?',
              );

              if (!confirmed) {
                event.preventDefault();
              }
            }}>
            <FiArrowLeft size={16} />
          </Link>

          <div>
            <p className="edit-document-eyebrow">Documentation</p>

            <h1>Edit document</h1>

            <p className="edit-document-description">
              Update your documentation and keep your knowledge base accurate.
            </p>
          </div>
        </div>

        <div className="edit-document-actions">
          <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={isSaving}>
            <FiSave size={15} />

            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </section>

      {error && <div className="edit-document-error">{error}</div>}

      <section className="edit-document-layout">
        <Card className="edit-document-editor">
          <div className="document-editor-title">
            <FiFileText className="document-editor-title-icon" size={20} />

            <input
              type="text"
              placeholder="Untitled document"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);

                setHasChanges(true);
              }}
              disabled={isSaving}
            />
          </div>

          <div className="document-editor-meta">
            <Badge
              variant={
                status === 'published'
                  ? 'green'
                  : status === 'archived'
                    ? 'blue'
                    : 'yellow'
              }>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>

            <span>
              {isSaving
                ? 'Saving...'
                : hasChanges
                  ? 'Unsaved changes'
                  : 'All changes saved'}
            </span>
          </div>

          <div className="document-editor-toolbar">
            <button type="button" title="Bold">
              <FiBold size={16} />
            </button>

            <button type="button" title="Italic">
              <FiItalic size={16} />
            </button>

            <div className="toolbar-divider" />

            <button type="button" title="Code">
              <FiCode size={16} />
            </button>

            <button type="button" title="Link">
              <FiLink size={16} />
            </button>

            <div className="toolbar-divider" />

            <button type="button" title="List">
              <FiList size={16} />
            </button>

            <button type="button" title="More">
              <FiMoreHorizontal size={16} />
            </button>
          </div>

          <div className="document-editor-content">
            <textarea
              placeholder="Start writing your documentation..."
              value={content}
              onChange={(event) => {
                setContent(event.target.value);

                setHasChanges(true);
              }}
              disabled={isSaving}
            />
          </div>
        </Card>

        <aside className="edit-document-sidebar">
          <Card className="document-settings-card">
            <div className="document-settings-header">
              <h2>Document settings</h2>
            </div>

            <div className="document-setting">
              <label>Collection</label>

              <button type="button" className="document-select">
                Select collection
              </button>
            </div>

            <div className="document-setting">
              <label>Category</label>

              <input
                type="text"
                className="document-select"
                placeholder="e.g. Development"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);

                  setHasChanges(true);
                }}
                disabled={isSaving}
              />
            </div>

            <div className="document-setting">
              <label>Visibility</label>

              <select
                className="document-select"
                value={visibility}
                onChange={(event) => {
                  setVisibility(event.target.value as 'workspace' | 'private');

                  setHasChanges(true);
                }}
                disabled={isSaving}>
                <option value="workspace">Workspace</option>

                <option value="private">Private</option>
              </select>
            </div>

            <div className="document-setting">
              <label>Status</label>

              <select
                className="document-select"
                value={status}
                onChange={(event) => {
                  setStatus(
                    event.target.value as 'draft' | 'published' | 'archived',
                  );

                  setHasChanges(true);
                }}
                disabled={isSaving}>
                <option value="draft">Draft</option>

                <option value="published">Published</option>

                <option value="archived">Archived</option>
              </select>
            </div>
          </Card>

          <Card className="document-tips-card">
            <div className="document-tips-icon">✦</div>

            <div>
              <h3>Keep it up to date</h3>

              <p>
                Well-maintained documentation helps your team find the right
                information when they need it.
              </p>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
};

export default EditDocument;
