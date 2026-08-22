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

import { Link } from 'react-router-dom';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

import './CreateDocument.css';

const CreateDocument = () => {
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
          <Button variant="ghost">Cancel</Button>

          <Button>
            <FiSave size={15} />
            Save document
          </Button>
        </div>
      </section>

      <section className="create-document-layout">
        <Card className="create-document-editor">
          <div className="document-editor-title">
            <FiFileText className="document-editor-title-icon" size={20} />

            <input type="text" placeholder="Untitled document" />
          </div>

          <div className="document-editor-meta">
            <Badge variant="blue">Draft</Badge>

            <span>Last saved just now</span>
          </div>

          <div className="document-editor-toolbar">
            <button title="Bold">
              <FiBold size={16} />
            </button>

            <button title="Italic">
              <FiItalic size={16} />
            </button>

            <div className="toolbar-divider" />

            <button title="Code">
              <FiCode size={16} />
            </button>

            <button title="Link">
              <FiLink size={16} />
            </button>

            <div className="toolbar-divider" />

            <button title="List">
              <FiList size={16} />
            </button>

            <button title="More">
              <FiMoreHorizontal size={16} />
            </button>
          </div>

          <div className="document-editor-content">
            <textarea placeholder="Start writing your documentation..." />
          </div>
        </Card>

        <aside className="create-document-sidebar">
          <Card className="document-settings-card">
            <div className="document-settings-header">
              <h2>Document settings</h2>
            </div>

            <div className="document-setting">
              <label>Collection</label>

              <button className="document-select">Select collection</button>
            </div>

            <div className="document-setting">
              <label>Category</label>

              <button className="document-select">Select category</button>
            </div>

            <div className="document-setting">
              <label>Visibility</label>

              <button className="document-select">Workspace</button>
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
