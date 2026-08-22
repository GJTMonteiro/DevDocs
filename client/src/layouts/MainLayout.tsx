import { Outlet } from 'react-router-dom';

import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';

import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />

      <div className="main-content-wrapper">
        <Navbar />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
