import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Documentation from "../pages/Documentation/Documentation";
import Document from "../pages/Document/Document";
import CreateDocument from "../pages/CreateDocument/CreateDocument";
import Search from "../pages/Search/Search";
import Settings from "../pages/Settings/Settings";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/documentation" element={<Documentation />} />

            <Route
                path="/documentation/:id"
                element={<Document />}
            />

            <Route
                path="/documentation/create"
                element={<CreateDocument />}
            />

            <Route path="/search" element={<Search />} />

            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
};

export default AppRoutes;