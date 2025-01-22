import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Image Gallery</div>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-gray-300"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4">
          <a href="#home" className="text-white hover:text-gray-300">Home</a>
          <a href="#gallery" className="text-white hover:text-gray-300">Gallery</a>
          <a href="#upload" className="text-white hover:text-gray-300">Upload</a>
          <a href="#about" className="text-white hover:text-gray-300">About</a>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden absolute top-16 right-0 left-0 bg-gray-800 p-4`}>
          <div className="flex flex-col space-y-2">
            <a href="#home" className="text-white hover:text-gray-300">Home</a>
            <a href="#gallery" className="text-white hover:text-gray-300">Gallery</a>
            <a href="#upload" className="text-white hover:text-gray-300">Upload</a>
            <a href="#about" className="text-white hover:text-gray-300">About</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
