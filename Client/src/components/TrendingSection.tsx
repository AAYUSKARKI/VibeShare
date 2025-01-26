import { TrendingUp, User } from "lucide-react"
import { Link } from "react-router-dom"

type TrendingPost = {
  id: string
  title: string
  author: string
}

type TrendingUser = {
  id: string
  username: string
  score: number
}

const trendingPosts: TrendingPost[] = [
  { id: "1", title: "The Future of AI", author: "TechGuru" },
  { id: "2", title: "Sustainable Living Tips", author: "EcoWarrior" },
  { id: "3", title: "Crypto Market Analysis", author: "CryptoExpert" },
]

const trendingUsers: TrendingUser[] = [
  { id: "1", username: "InnovatorX", score: 1250 },
  { id: "2", username: "CreativeMinds", score: 980 },
  { id: "3", username: "FutureVisionary", score: 875 },
]

export default function TrendingSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Trending</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <TrendingUp className="mr-2" size={20} /> Trending Posts
        </h3>
        <ul className="space-y-2">
          {trendingPosts.map((post) => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
              <span className="text-gray-500 text-sm ml-2">by {post.author}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <User className="mr-2" size={20} /> Trending Users
        </h3>
        <ul className="space-y-2">
          {trendingUsers.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <Link to={`/profile/${user.id}`} className="text-blue-600 hover:underline">
                {user.username}
              </Link>
              <span className="text-gray-500 text-sm">Score: {user.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

