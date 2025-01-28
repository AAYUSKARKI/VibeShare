import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setuser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { 
  Loader, 
  Share2,
  Mail, 
  Lock,
  User,
  ArrowRight
} from "lucide-react";

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface ApiError {
  message: string;
}

const AuthPage = () => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post<FormData, { data: FormData }>(
        isLogin ? "http://localhost:7000/api/v1/users/login" : "http://localhost:7000/api/v1/users/register",
        formData
      );

      if (response.data) {
        setIsLoading(false);
        toast.success("Authentication successful!");
        dispatch(setuser(response.data));
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setError(error.response?.data.message || "An error occurred.");
      } else {
        setError("An error occurred.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4">
      {/* Animated Header Section */}
      <div className="mb-10 text-center scale-in-center">
        <div className="flex items-center justify-center gap-2 mb-4 hover:transform hover:scale-105 transition-transform duration-300">
          <Share2 className="h-8 w-8 text-blue-600 animate-pulse" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            VibeShare
          </h1>
        </div>
        <p className="text-gray-600 text-lg font-light slide-up">
          Share vibes. Connect. Earn rewards.
        </p>
      </div>

      {/* Enhanced Auth Form Card */}
      <div className="w-full max-w-md perspective-1000">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative overflow-hidden hover:shadow-3xl transition-shadow duration-300 scale-in-center">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 animate-gradient" />

          {/* Form Title Animation */}
          <div className="relative mb-8">
            <div 
              className="transition-all duration-700 ease-out transform slide-fade"
              style={{
                opacity: isLogin ? 1 : 0,
                transform: `translateY(${isLogin ? 0 : '-20px'}) scale(${isLogin ? 1 : 0.8})`,
                position: isLogin ? 'relative' : 'absolute',
                width: '100%'
              }}
            >
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Welcome Back
              </h2>
            </div>
            <div 
              className="transition-all duration-700 ease-out transform slide-fade"
              style={{
                opacity: !isLogin ? 1 : 0,
                transform: `translateY(${!isLogin ? 0 : '20px'}) scale(${!isLogin ? 1 : 0.8})`,
                position: !isLogin ? 'relative' : 'absolute',
                width: '100%'
              }}
            >
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Create Account
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Animated Name Input */}
            <div 
              className="transition-all duration-700 ease-out"
              style={{
                maxHeight: !isLogin ? '80px' : '0',
                opacity: !isLogin ? 1 : 0,
                transform: `translateY(${!isLogin ? 0 : '-20px'})`,
                marginBottom: !isLogin ? '20px' : '0'
              }}
            >
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  name="username"
                  required={!isLogin}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 hover:border-blue-300"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Enhanced Input Fields */}
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 hover:border-blue-300"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
              <input
                type="password"
                name="password"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 hover:border-blue-300"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            {/* Animated Error Message */}
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg animate-shake">
                {error}
              </div>
            )}

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span className="relative">{isLogin ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Enhanced Toggle Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 hover:scale-105 transform inline-flex items-center gap-1 text-sm"
            >
              {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .scale-in-center {
          animation: scaleInCenter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slide-up {
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slide-fade {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 8s linear infinite;
        }

        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
        }

        @keyframes scaleInCenter {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;