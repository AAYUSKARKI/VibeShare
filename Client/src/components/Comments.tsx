import { useState } from "react"
import { MessageCircle } from "lucide-react"

type Comment = {
  id: string
  author: string
  content: string
  likes: number
  replies: Comment[]
}

type CommentsProps = {
  comments: Comment[]
}

function CommentItem({ comment }: { comment: Comment }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle reply submission logic here
    console.log("Submitting reply:", replyContent)
    // Reset form and hide it
    setReplyContent("")
    setShowReplyForm(false)
  }

  return (
    <div className="mb-4">
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
        <div className="flex-1">
          <p className="font-semibold">{comment.author}</p>
          <p className="text-gray-700">{comment.content}</p>
          <div className="flex items-center space-x-4 mt-2">
            <button className="text-sm text-gray-500 hover:text-blue-600">Like ({comment.likes})</button>
            <button
              className="text-sm text-gray-500 hover:text-blue-600"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </button>
          </div>
          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-2">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Submit Reply
              </button>
            </form>
          )}
          {comment.replies.length > 0 && (
            <div className="ml-8 mt-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Comments({ comments }: CommentsProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle comment submission logic here
    console.log("Submitting comment:", newComment)
    // Reset form
    setNewComment("")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Post Comment
        </button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}

