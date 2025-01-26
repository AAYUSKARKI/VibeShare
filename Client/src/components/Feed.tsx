import { useState } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle, TrendingUp, Share2 } from "lucide-react"
import { Link } from "react-router-dom" // Import Link from "react-router-dom"

type Post = {
  id: string
  author: string
  content: string
  imageUrl?: string
  sentiment: {
    positive: number
    negative: number
    neutral: number
  }
  likes: number
  dislikes: number
  comments: number
}

const initialPosts: Post[] = [
  {
    id: "1",
    author: "Alice",
    content: "Just had an amazing day at the beach! 🏖️ #SummerVibes",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS45XRGoOgqDujrdcAQAME0LjyIg0YnR8Jk-A&s",
    sentiment: { positive: 0.8, negative: 0.1, neutral: 0.1 },
    likes: 42,
    dislikes: 2,
    comments: 5,
  },
  {
    id: "2",
    author: "Bob",
    content: "Feeling down today. Could use some positive vibes. 😔",
    sentiment: { positive: 0.2, negative: 0.6, neutral: 0.2 },
    likes: 15,
    dislikes: 0,
    comments: 8,
  },
  {
    id: "3",
    author: "Charlie",
    content: "Just finished my first marathon! 🏃‍♂️ #Accomplished",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLFAjdtgTjUI0K4WcYKr0ZTW4lbEInVANkOQ&s",
    sentiment: { positive: 0.9, negative: 0.0, neutral: 0.1 },
    likes: 87,
    dislikes: 1,
    comments: 23,
  },
]

export default function Feed() {
  const [posts, setPosts] = useState(initialPosts)

  const handleLike = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const handleDislike = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post)))
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-lg"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Link to={`/profile/${post.author}`} className="font-semibold text-blue-600 hover:underline">
                {post.author}
              </Link>
              <div className="flex items-center space-x-2 text-gray-500">
                <TrendingUp size={16} />
                <span className="text-sm">Trending</span>
              </div>
            </div>
            <p className="text-gray-800 mb-4">{post.content}</p>
          </div>
          {post.imageUrl && (
            <div className="relative h-64 w-full">
              <img src={post.imageUrl || "/placeholder.svg"} className="w-full h-full object-cover" alt="Post image" />
            </div>
          )}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition duration-200"
                >
                  <ThumbsUp size={20} />
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => handleDislike(post.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition duration-200"
                >
                  <ThumbsDown size={20} />
                  <span>{post.dislikes}</span>
                </button>
                <Link
                  to={`/post/${post.id}`}
                  className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition duration-200"
                >
                  <MessageCircle size={20} />
                  <span>{post.comments}</span>
                </Link>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600 transition duration-200">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-600">
                  {(post.sentiment.positive * 100).toFixed(0)}%
                </span>
                <span className="text-sm font-medium text-red-600">{(post.sentiment.negative * 100).toFixed(0)}%</span>
                <span className="text-sm font-medium text-gray-600">{(post.sentiment.neutral * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

