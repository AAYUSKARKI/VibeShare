import { Link } from "react-router-dom"
import { Home, TrendingUpIcon as Trending, User, Bell, Settings } from "lucide-react"

const Sidebar = () => {
  return (
    <div className="bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <Link to="/" className="text-3xl font-semibold text-center text-blue-600 flex items-center justify-center">
        <span className="mr-2">🌟</span> VibeShare
      </Link>
      <nav>
        <Link to="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-600 hover:text-white">
          <Home className="inline-block mr-2" size={20} /> Home
        </Link>
        <Link
          to="/trending"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-600 hover:text-white"
        >
          <Trending className="inline-block mr-2" size={20} /> Trending
        </Link>
        <Link
          to="/profile"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-600 hover:text-white"
        >
          <User className="inline-block mr-2" size={20} /> Profile
        </Link>
        <Link
          to="/notifications"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-600 hover:text-white"
        >
          <Bell className="inline-block mr-2" size={20} /> Notifications
        </Link>
        <Link
          to="/settings"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-600 hover:text-white"
        >
          <Settings className="inline-block mr-2" size={20} /> Settings
        </Link>
      </nav>
    </div>
  )
}

export default Sidebar

