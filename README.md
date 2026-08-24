# 🚀 DevDocs

> An AI-first internal documentation platform designed to help teams create, organize, search and interact with technical documentation in one centralized workspace.

---

# 📌 About the Project

**DevDocs** is a full-stack internal documentation platform focused on modern software development workflows.

The platform is designed to provide a centralized workspace where teams can:

- Create and manage documentation
- Organize technical information
- Search documentation
- Manage user profiles
- Configure application preferences
- Receive notifications
- Interact with an AI Assistant
- Generate context-aware responses using documentation

The project is designed with an **AI-first architecture**, with future support for technologies such as **RAG (Retrieval-Augmented Generation)** and **MCP (Model Context Protocol)**.

The main goal is to create a modern documentation platform where documentation is not only stored, but can also be actively used by AI to help developers find and understand information.

---

# ✨ Features

## 📚 Documentation

DevDocs provides a centralized environment for managing internal technical documentation.

Planned capabilities include:

- Create documents
- Organize documents
- Edit documents
- Search documentation
- Manage document metadata
- Connect documentation with AI features

---

# 🤖 AI Assistant

DevDocs is designed around an AI-first workflow.

The AI Assistant will allow users to interact with their internal documentation using natural language.

Features include:

- AI-powered documentation search
- Context-aware responses
- Documentation-based answers
- Natural language interaction
- AI access to relevant project information

The AI architecture is designed to evolve towards **RAG** and **MCP-based integrations**.

---

# 🧠 Context-Aware Responses

The platform includes a dedicated setting for controlling context-aware AI responses.

When enabled, the AI Assistant can use relevant documentation context when generating answers.

This allows DevDocs to provide responses based on the organization's internal knowledge instead of relying exclusively on general AI knowledge.

---

# 👤 User Profile

DevDocs includes a user profile system.

Profile information includes:

- Name
- Email
- Role

Users can update their profile information directly through the Settings page.

---

# 🔔 Notifications

DevDocs includes a notification preference system.

Users can configure notification preferences such as:

- Email notifications
- Documentation updates
- Mentions

Notification preferences are stored in the database and can be updated through the application settings.

---

# ⚙️ Settings

DevDocs provides a centralized settings page for managing application preferences.

## Profile

Users can:

- View profile information
- Edit their name
- Edit their email
- Change their role

## 🎨 Appearance

Users can choose between:

- Dark
- Light
- System

The selected theme is persisted and applied across the application.

## 🤖 AI Preferences

Users can configure:

- AI Assistant
- Context-aware responses

Context-aware responses are automatically disabled when the AI Assistant itself is disabled.

---

# 🔐 Security

DevDocs is designed with security and user data isolation in mind.

The backend is responsible for:

- User authentication
- User-specific data access
- Secure database operations
- Protected application resources

Authentication and additional security features are still being expanded as development continues.

---

# 🎨 Interface

DevDocs uses a modern developer-focused interface.

Features include:

- Dark interface
- Light interface
- Responsive design
- Sidebar navigation
- Settings interface
- Reusable UI components
- Modal interfaces
- Interactive controls
- Developer-focused visual design

---

# 📱 Responsive Design

The application is designed to work across different screen sizes.

Supported layouts include:

- Desktop
- Laptop
- Tablet
- Mobile

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- React Icons
- CSS

## Backend

- Node.js
- Express
- TypeScript

## Database

- PostgreSQL

## ORM

- Drizzle ORM

---

# 🗄️ Database

DevDocs uses **PostgreSQL** as its primary database.

The database currently contains systems for managing information such as:

- Users
- User preferences
- Notifications
- Documentation-related data

The database architecture is designed to support future AI and RAG functionality.
