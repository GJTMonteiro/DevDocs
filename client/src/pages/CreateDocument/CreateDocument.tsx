import { useState } from 'react';

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

import { Link, useNavigate } from 'react-router-dom';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

import { createDocument } from '../../services/documents';

import './CreateDocument.css';

const DEVELOPMENT_USER_ID = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

const CreateDocument = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<'workspace' | 'private'>(
    'workspace',
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    console.log('SAVE CLICKED');

    setError('');

    if (!title.trim()) {
      console.log('TITLE EMPTY');
      setError('Please enter a document title.');
      return;
    }

    if (!content.trim()) {
      console.log('CONTENT EMPTY');
      setError('Please enter some content.');
      return;
    }

    try {
      console.log('SENDING DOCUMENT');

      setIsSaving(true);

      const document = await createDocument({
        title: title.trim(),
        content,
        category: category.trim() || null,
        visibility,
        createdBy: DEVELOPMENT_USER_ID,
      });

      console.log('DOCUMENT CREATED:', document);

      navigate('/documentation');
    } catch (error) {
      console.error('CREATE DOCUMENT ERROR:', error);

      setError(
        error instanceof Error ? error.message : 'Failed to create document.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="create-document">
      <section className="create-document-header">
        <div className="create-document-header-left">
          <Link to="/documentation" className="create-document-back">
            <FiArrowLeft size={16} />
          </Link>

          <div>
            <p className="create-document-eyebrow">Documentation</p>

            <h1>Create document</h1>

            <p className="create-document-description">
              Create a new document for your knowledge base.
            </p>
          </div>
        </div>

        <div className="create-document-actions">
          <Button
            variant="ghost"
            onClick={() => navigate('/documentation')}
            disabled={isSaving}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={isSaving}>
            <FiSave size={15} />

            {isSaving ? 'Saving...' : 'Save document'}
          </Button>
        </div>
      </section>

      {error && <div className="create-document-error">{error}</div>}

      <section className="create-document-layout">
        <Card className="create-document-editor">
          <div className="document-editor-title">
            <FiFileText className="document-editor-title-icon" size={20} />

            <input
              type="text"
              placeholder="Untitled document"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="document-editor-meta">
            <Badge variant="blue">Draft</Badge>

            <span>{isSaving ? 'Saving...' : 'Not saved yet'}</span>
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
              onChange={(event) => setContent(event.target.value)}
              disabled={isSaving}
            />
          </div>
        </Card>

        <aside className="create-document-sidebar">
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
                onChange={(event) => setCategory(event.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="document-setting">
              <label>Visibility</label>

              <select
                className="document-select"
                value={visibility}
                onChange={(event) =>
                  setVisibility(event.target.value as 'workspace' | 'private')
                }
                disabled={isSaving}>
                <option value="workspace">Workspace</option>

                <option value="private">Private</option>
              </select>
            </div>
          </Card>

          <Card className="document-tips-card">
            <div className="document-tips-icon">✦</div>

            <div>
              <h3>Writing with AI</h3>

              <p>
                Use the AI Assistant to help structure, improve or expand your
                documentation.
              </p>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
};

export default CreateDocument;
