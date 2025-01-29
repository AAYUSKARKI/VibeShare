import { Search, PlusCircle } from "lucide-react"
import { useState } from "react";
import { Link } from "react-router-dom"
import CreatePost from "./CreatePost";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="flex items-center justify-end md:flex-1 lg:w-0">
          <button
              onClick={handleOpenModal}
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="mr-2" size={20} />
              Create Post
            </button>
            <Link
              to="/profile"
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-600 bg-white hover:bg-gray-50"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
      {isModalOpen && <CreatePost onClose={handleCloseModal} />}
    </header>
  )
}

