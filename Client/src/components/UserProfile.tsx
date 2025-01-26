import { Wallet, Award, BarChart2 } from "lucide-react"

type UserProfileProps = {
  username: string
  walletAddress: string
  tokenBalance: number
  posts: number
  comments: number
  totalEarnings: number
}

export default function UserProfile({
  username,
  walletAddress,
  tokenBalance,
  posts,
  comments,
  totalEarnings,
}: UserProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{username}</h2>
        <div className="flex items-center space-x-2 mb-4">
          <Wallet size={20} className="text-gray-500" />
          <span className="text-sm text-gray-600">{walletAddress}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Award size={20} className="mr-2 text-blue-500" />
              Token Balance
            </h3>
            <p className="text-2xl font-bold text-blue-600">{tokenBalance}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <BarChart2 size={20} className="mr-2 text-green-500" />
              Total Earnings
            </h3>
            <p className="text-2xl font-bold text-green-600">{totalEarnings}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Posts</h3>
            <p className="text-2xl font-bold text-gray-700">{posts}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            <p className="text-2xl font-bold text-gray-700">{comments}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

