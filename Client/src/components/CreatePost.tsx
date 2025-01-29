import { useState } from "react";
import { ImageIcon, Tag, X } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";

interface SentimentResult {
  label: string;
  score: number;
}

export default function CreatePost({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useSelector((state: any) => state.user);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));
    if (image) {
      formData.append("imageUrl", image);
    }

    try {
      const response = await axios.post<SentimentResult[]>('http://127.0.0.1:5000/classify', { text: content });
      setResult(response.data[0]);
      if (response.data) {
        toast.success("Sentiment analysis successful!");
        formData.append("label", response.data[0].label);
        formData.append("score", response.data[0].score.toString());
      } else {
        toast.error("Sentiment analysis failed. Please try again.");
      }
      const res = await axios.post("http://localhost:7000/api/v1/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.data.refreshtoken}`,
        },
      });
      if (res.data) {
        toast.success("Post created successfully!");
      }
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    }
  };

  const resetForm = () => {
    setContent("");
    setTags([]);
    setImage(null);
    setImagePreview(null);
    setCurrentTag("");
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex items-center space-x-4 mb-4">
            <label
              htmlFor="image"
              className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition duration-200"
            >
              <ImageIcon size={20} />
              <span>Add Image</span>
              <input type="file" name="image" onChange={handleImageChange} className="hidden" id="image" />
            </label>
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                onClick={handleAddTag}
              >
                <Tag size={20} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}