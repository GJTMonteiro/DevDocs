import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import Dashboard from '../pages/Dashboard/Dashboard';
import Documentation from '../pages/Documentation/Documentation';
import CreateDocument from '../pages/CreateDocument/CreateDocument';
import Search from '../pages/Search/Search';
import Favorites from '../pages/Favorites/Favorites';
import Collections from '../pages/Collections/Collections';
import Discover from '../pages/Discover/Discover';
import AIAssistant from '../pages/AIAssistant/AIAssistant';
import Settings from '../pages/Settings/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/documentation/create" element={<CreateDocument />} />
        <Route path="/search" element={<Search />} />

        {/* Library */}
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/collections" element={<Collections />} />

        {/* Explore */}
        <Route path="/discover" element={<Discover />} />

        {/* AI */}
        <Route path="/ai-assistant" element={<AIAssistant />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
