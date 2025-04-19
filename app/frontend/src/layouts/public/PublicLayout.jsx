import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import PublicFooter from '../../components/public/PublicFooter';

const PublicLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex min-h-screen flex-col ${darkMode ? 'dark' : ''}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;