import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-blue-600 text-2xl font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v3m0 12v3m9-9h-3m-12 0H3m15.364 5.636L17.05 19.95m0-15.9l1.414-1.414M7.05 4.05 5.636 5.464M4.05 7.05 5.464 8.464M19.95 17.05 18.536 18.464M4.05 16.95l1.414 1.414"
              />
            </svg>
            RBAC
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-gray-700">
          <a href="/users/list" className="hover:text-blue-500">Users</a>
          <a href="/roles/list" className="hover:text-blue-500">Roles</a>
          <a href="/permissions/list" className="hover:text-blue-500">Permissions</a>
        </nav>

        {/* Profile Dropdown */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700" title="Profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 7.5l-1.5 1.5m0 0l-1.5-1.5m1.5 1.5V3m0 9.75l-1.5 1.5m0 0l-1.5-1.5m1.5 1.5V9m3.75 7.5h-1.5m0 0h-6m6 0a1.5 1.5 0 01-1.5 1.5H9m6-1.5a1.5 1.5 0 01-1.5 1.5H9"
              />
            </svg>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600">
            Logout
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden text-black">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} title="Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow">
          <a href="/users/list" className="block px-4 py-2 text-black hover:bg-blue-100">Users</a>
          <a href="/roles/list" className="block px-4 py-2 text-black hover:bg-blue-100">Roles</a>
          <a href="/permissions/list" className="block px-4 py-2 text-black hover:bg-blue-100">Permissions</a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
