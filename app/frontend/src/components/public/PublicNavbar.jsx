import { Link } from 'react-router-dom';

const PublicNavbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {/* <img
                src="@/assets/react.svg" // Replace with your logo
                alt="RepairLink"
                className="h-8 w-auto"
              /> */}
              <span className="ml-2 text-xl font-bold text-gray-900">RepairLink</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          
          
        </div>
      </nav>
    </header>
  );
};

export default PublicNavbar;