import { Wallet, Award, BarChart2 } from "lucide-react"
import ConnectWallet from "./ConnectWallet"

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
      <div className="p-6 ">
      <h2 className="text-2xl font-bold">User Profile</h2>
      </div>
     <ConnectWallet />
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

