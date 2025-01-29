import Feed from "./Feed"
import UserProfile from "./UserProfile"
import TrendingSection from "./TrendingSection"
import FloatingActionButton from "./FloatingActionButton"
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state: any) => state.user);
console.log(user.data)
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4">Your Feed</h2>
        <Feed />
      </div>
      <div className="lg:w-1/3 space-y-8">
        <UserProfile
          username={user.data.username}
          walletAddress="0x1234...5678"
          tokenBalance={100}
          posts={15}
          comments={42}
          totalEarnings={250}
        />
        <TrendingSection />
      </div>
      <FloatingActionButton />
    </div>
  )
}

