import React from 'react';

interface SideNavProps {
  isOpen: boolean;
  handleClose: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, handleClose }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-30 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
      onClick={handleClose}
    >
      <div
        className="w-64 bg-white dark:bg-black h-full shadow-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SideNav content goes here */}
        <button onClick={handleClose} className="text-gray-600 dark:text-gray-400">
          Close
        </button>
        <ul className="mt-4 space-y-2">
          <li><a href="/" className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600">Home</a></li>
          <li><a href="/events" className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600">Events</a></li>
          <li><a href="/about" className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600">About Us</a></li>
          <li><a href="/contact" className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600">Contact</a></li>
          <li><a href="/login" className="block text-indigo-600 hover:text-indigo-700">Login</a></li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
