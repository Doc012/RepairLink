import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { BiSun, BiMoon } from 'react-icons/bi';
import Button from '../common/Button';
import NavLink from '../navigation/NavLink';
import Logo from '../common/Logo';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Professionals', path: '/professionals' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-300 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-x-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-x-4">
          <Button 
            variant="ghost"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <BiSun size={20} /> : <BiMoon size={20} />}
          </Button>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:gap-x-4">
            <Button to="/login" variant="secondary">
              Sign In
            </Button>
            <Button to="/register" variant="primary">
              Get Started
            </Button>
          </div>

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="flex flex-col gap-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <NavLink to="/login" onClick={() => setIsOpen(false)}>
              Sign In
            </NavLink>
            <NavLink to="/register" onClick={() => setIsOpen(false)}>
              Get Started
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;