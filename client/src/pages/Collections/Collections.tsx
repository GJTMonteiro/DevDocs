import { useEffect, useState } from 'react';

import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiEdit2,
  FiFileText,
  FiFolder,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

import Card from '../../components/ui/Card';

import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
  type Collection,
  type CollectionColor,
} from '../../services/collections';

import './Collections.css';

const USER_ID = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

const COLORS: CollectionColor[] = ['blue', 'purple', 'green', 'yellow'];

interface CollectionForm {
  name: string;
  description: string;
  color: CollectionColor;
}

const EMPTY_FORM: CollectionForm = {
  name: '',
  description: '',
  color: 'blue',
};

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );

  const [form, setForm] = useState<CollectionForm>(EMPTY_FORM);

  const [isSaving, setIsSaving] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getCollections(search);

      setCollections(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : 'Failed to load collections.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadCollections();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const openCreateModal = () => {
    setEditingCollection(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (collection: Collection) => {
    setEditingCollection(collection);

    setForm({
      name: collection.name,
      description: collection.description ?? '',
      color: collection.color,
    });

    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingCollection(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      if (editingCollection) {
        await updateCollection(editingCollection.id, {
          name: form.name.trim(),
          description: form.description.trim() || null,
          color: form.color,
        });
      } else {
        await createCollection({
          name: form.name.trim(),
          description: form.description.trim() || null,
          color: form.color,
          createdBy: USER_ID,
        });
      }

      closeModal();

      await loadCollections();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : 'Failed to save collection.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (collection: Collection) => {
    setOpenMenuId(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${collection.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteCollection(collection.id);

      await loadCollections();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : 'Failed to delete collection.',
      );
    }
  };

  const formatUpdatedAt = (value: string) => {
    const date = new Date(value);

    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="collections">
      {/* HEADER */}
      <section className="collections-header">
        <div>
          <p className="collections-eyebrow">Library</p>

          <h1>Collections</h1>

          <p className="collections-description">
            Organize your documentation into meaningful knowledge groups.
          </p>
        </div>

        <div className="collections-count">
          <FiFolder size={14} />

          <span>
            {collections.length}{' '}
            {collections.length === 1 ? 'collection' : 'collections'}
          </span>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="collections-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* TOOLBAR */}
      <section className="collections-toolbar">
        <div className="collections-search">
          <FiSearch size={16} />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search collections..."
          />
        </div>
      </section>

      {/* LOADING */}
      {isLoading && (
        <section className="collections-empty">
          <FiFolder size={24} />

          <h2>Loading collections...</h2>

          <p>Fetching your collections.</p>
        </section>
      )}

      {/* EMPTY */}
      {!isLoading && !error && collections.length === 0 && (
        <section className="collections-empty">
          <FiFolder size={24} />

          <h2>{search ? 'No collections found' : 'No collections yet'}</h2>

          <p>
            {search
              ? 'Try a different search term.'
              : 'Create your first collection to start organizing your documentation.'}
          </p>

          {!search && (
            <button
              type="button"
              className="collections-create"
              onClick={openCreateModal}>
              <FiPlus size={16} />
              New collection
            </button>
          )}
        </section>
      )}

      {/* COLLECTIONS */}
      {!isLoading && !error && collections.length > 0 && (
        <section className="collections-list">
          {collections.map((collection) => (
            <Card className="collection-card" key={collection.id}>
              {/* ICON */}
              <div className={`collection-icon ${collection.color}`}>
                <FiFolder size={19} />
              </div>

              {/* CONTENT */}
              <div className="collection-content">
                <div className="collection-title-row">
                  <h2>{collection.name}</h2>
                </div>

                <p>{collection.description || 'No description provided.'}</p>

                <div className="collection-meta">
                  <span>
                    <FiFileText size={12} />
                    {collection.documents}{' '}
                    {collection.documents === 1 ? 'document' : 'documents'}
                  </span>

                  <span>
                    <FiClock size={12} />

                    {formatUpdatedAt(collection.updatedAt)}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="collection-actions">
                <button
                  type="button"
                  className="collection-more"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === collection.id ? null : collection.id,
                    )
                  }
                  aria-label="Collection actions">
                  <FiMoreHorizontal size={17} />
                </button>

                {openMenuId === collection.id && (
                  <div className="collection-menu">
                    <button
                      type="button"
                      onClick={() => openEditModal(collection)}>
                      <FiEdit2 size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(collection)}>
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="collection-open"
                  aria-label={`Open ${collection.name}`}>
                  <FiArrowRight size={16} />
                </button>
              </div>
            </Card>
          ))}
        </section>
      )}

      {/* INFORMATION */}
      <section className="collections-info">
        <Card className="collections-info-card">
          <div className="collections-info-icon">
            <FiBookOpen size={18} />
          </div>

          <div>
            <h3>Organize your knowledge</h3>

            <p>
              Collections help your team group related documentation together
              and make knowledge easier to discover.
            </p>
          </div>
        </Card>
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="collections-modal-overlay" onMouseDown={closeModal}>
          <div
            className="collections-modal"
            onMouseDown={(event) => event.stopPropagation()}>
            <div className="collections-modal-header">
              <div>
                <p className="collections-eyebrow">Library</p>

                <h2>
                  {editingCollection ? 'Edit collection' : 'New collection'}
                </h2>
              </div>

              <button
                type="button"
                className="collections-modal-close"
                onClick={closeModal}
                disabled={isSaving}>
                <FiX size={18} />
              </button>
            </div>

            <form className="collections-form" onSubmit={handleSubmit}>
              <label>
                <span>Name</span>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Engineering"
                  autoFocus
                />
              </label>

              <label>
                <span>Description</span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe what belongs in this collection..."
                  rows={4}
                />
              </label>

              <div className="collections-color-field">
                <span>Color</span>

                <div className="collections-color-options">
                  {COLORS.map((color) => (
                    <button
                      type="button"
                      key={color}
                      className={`collections-color-option ${color} ${
                        form.color === color ? 'active' : ''
                      }`}
                      onClick={() =>
                        setForm({
                          ...form,
                          color,
                        })
                      }
                      aria-label={`Use ${color} color`}>
                      <FiFolder size={17} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="collections-form-actions">
                <button
                  type="button"
                  className="collections-cancel"
                  onClick={closeModal}
                  disabled={isSaving}>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="collections-save"
                  disabled={isSaving || !form.name.trim()}>
                  {isSaving
                    ? 'Saving...'
                    : editingCollection
                      ? 'Save changes'
                      : 'Create collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
