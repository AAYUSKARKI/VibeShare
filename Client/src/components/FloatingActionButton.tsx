"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import CreatePost from "./CreatePost"

export default function FloatingActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition duration-300"
      >
        <Plus size={24} />
      </button>
      {isModalOpen && <CreatePost onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

